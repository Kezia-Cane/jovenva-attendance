import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/common/UIComponents"
import { format, isSameDay, startOfWeek, addDays, differenceInMinutes } from "date-fns"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { formatInManila, getManilaTime } from "@/lib/date-utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface AttendanceRecord {
    id: string
    date: string
    check_in_time: string | null
    check_out_time: string | null
    status: 'PRESENT' | 'ABSENT'
}

export async function WeeklyAttendanceTable({ date }: { date?: string }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get start/end of current week (Monday start)
    const currentTimestamp = getManilaTime()
    const viewDate = date ? new Date(date) : currentTimestamp
    const startOfCurrentWeek = startOfWeek(viewDate, { weekStartsOn: 1 })

    const prevWeek = format(addDays(startOfCurrentWeek, -7), 'yyyy-MM-dd')
    const nextWeek = format(addDays(startOfCurrentWeek, 7), 'yyyy-MM-dd')

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()

    let records: AttendanceRecord[] = []

    if (user) {
        const { data } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd'))
            .order('date', { ascending: true })

        if (data) records = data as AttendanceRecord[]
    }

    // Generate days for the current week (Mon-Fri)
    const weekDays = Array.from({ length: 7 })
        .map((_, i) => addDays(startOfCurrentWeek, i))
        .filter(day => {
            const d = day.getDay()
            return d !== 0 && d !== 6 // Exclude Sunday(0) and Saturday(6)
        })

    return (
        <Card className="border-none shadow-md rounded-2xl h-fit bg-card">
            <CardHeader className="pt-6 px-6 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Weekly Attendance</CardTitle>
                <div className="flex items-center gap-2">
                    <Link href={`?date=${prevWeek}`} scroll={false} className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-90 text-gray-500 hover:text-teal-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <Link href={`?date=${nextWeek}`} scroll={false} className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-90 text-gray-500 hover:text-teal-500">
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="text-gray-400 text-[10px] uppercase font-bold tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="px-2 py-3">Day</th>
                                <th className="px-2 py-3">Date</th>
                                <th className="px-2 py-3">Status</th>
                                <th className="px-2 py-3">Check-in</th>
                                <th className="px-2 py-3">Check-out</th>
                                <th className="px-2 py-3">Total Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {weekDays.map((day) => {
                                const dateStr = format(day, "yyyy-MM-dd")
                                const record = records.find(r => r.date === dateStr)
                                const isToday = isSameDay(day, currentTimestamp)
                                const isFuture = day > currentTimestamp

                                let duration = "—"
                                if (record?.check_in_time && record?.check_out_time) {
                                    const start = new Date(record.check_in_time)
                                    const end = new Date(record.check_out_time)
                                    const diff = differenceInMinutes(end, start)
                                    const hours = Math.floor(diff / 60)
                                    const minutes = diff % 60
                                    duration = `${hours}h ${minutes}m`
                                }

                                // Determine attendance status
                                let statusDisplay = null
                                if (record) {
                                    const checkInTime = record.check_in_time ? new Date(record.check_in_time) : null

                                    // Check if late: shift starts at 9pm (21:00)
                                    // Convert check-in to Manila time and check if after 21:00
                                    let isLate = false
                                    if (checkInTime) {
                                        const manilaCheckIn = new Date(checkInTime.toLocaleString("en-US", { timeZone: "Asia/Manila" }))
                                        const checkInHour = manilaCheckIn.getHours()
                                        const checkInMinute = manilaCheckIn.getMinutes()
                                        // Late if after 21:00 (9:00 PM) - allowing a few minutes grace
                                        isLate = checkInHour > 21 || (checkInHour === 21 && checkInMinute > 5)
                                    }

                                    // Check for missed check-out (has check-in but no check-out, and it's not today)
                                    const missedCheckOut = record.check_in_time && !record.check_out_time && !isToday

                                    if (missedCheckOut) {
                                        statusDisplay = (
                                            <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                                                Missed Out
                                            </span>
                                        )
                                    } else if (isLate) {
                                        statusDisplay = (
                                            <span className="bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100">
                                                Late
                                            </span>
                                        )
                                    } else {
                                        statusDisplay = (
                                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                                Present
                                            </span>
                                        )
                                    }
                                } else {
                                    statusDisplay = (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${(isToday || isFuture)
                                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                                            : "bg-red-50 text-red-500 border-red-100"
                                            }`}>
                                            {(isToday || isFuture) ? "Pending" : "Absent"}
                                        </span>
                                    )
                                }

                                return (
                                    <tr key={dateStr} className={`hover:bg-gray-50 transition-colors ${isToday ? "bg-green-50/30" : ""}`}>
                                        <td className="px-2 py-3 font-bold text-gray-700 text-sm">
                                            {format(day, "EEE")}
                                        </td>
                                        <td className="px-2 py-3 font-bold text-gray-700 text-sm">
                                            {format(day, "MMM, d yyyy")}
                                        </td>
                                        <td className="px-2 py-3">
                                            {statusDisplay}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 font-bold text-xs">
                                            {record?.check_in_time
                                                ? formatInManila(record.check_in_time, "hh:mm a")
                                                : "—"}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 font-bold text-xs">
                                            {record?.check_out_time
                                                ? formatInManila(record.check_out_time, "hh:mm a")
                                                : "—"}
                                        </td>
                                        <td className="px-2 py-3 text-teal-600 font-bold text-xs">
                                            {duration}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}

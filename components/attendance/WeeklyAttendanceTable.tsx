import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/common/UIComponents"
import { format, isSameDay, startOfWeek, addDays, differenceInMinutes } from "date-fns"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { formatInManila, getManilaTime } from "@/lib/date-utils"

interface AttendanceRecord {
    id: string
    date: string
    check_in_time: string | null
    check_out_time: string | null
    status: 'PRESENT' | 'ABSENT'
}

export async function WeeklyAttendanceTable() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get start/end of current week (Monday start)
    const now = getManilaTime()
    const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 })

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
        <Card className="border-none shadow-md rounded-2xl h-fit bg-white">
            <CardHeader className="pt-6 px-6 pb-4">
                <CardTitle className="text-lg font-bold text-gray-800">Weekly Attendance</CardTitle>
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
                                const isToday = isSameDay(day, now)

                                let duration = "—"
                                if (record?.check_in_time && record?.check_out_time) {
                                    const start = new Date(record.check_in_time)
                                    const end = new Date(record.check_out_time)
                                    const diff = differenceInMinutes(end, start)
                                    const hours = Math.floor(diff / 60)
                                    const minutes = diff % 60
                                    duration = `${hours}h ${minutes}m`
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
                                            {record ? (
                                                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                                    Present
                                                </span>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isToday ? "bg-yellow-50 text-yellow-600 border-yellow-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                                                    {isToday ? "Pending" : "Absent"}
                                                </span>
                                            )}
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

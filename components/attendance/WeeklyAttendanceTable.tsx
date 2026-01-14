import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/common/UIComponents"
import { format, isSameDay, startOfWeek, addDays, parseISO } from "date-fns"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"

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
    const now = new Date()
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

    // Generate days for the current week (Mon-Sun)
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i))

    return (
        <Card className="border-none shadow-md rounded-2xl h-full bg-white">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {weekDays.map((day) => {
                                const dateStr = format(day, "yyyy-MM-dd")
                                const record = records.find(r => r.date === dateStr)
                                const isToday = isSameDay(day, now)

                                return (
                                    <tr key={dateStr} className={`hover:bg-gray-50 transition-colors ${isToday ? "bg-green-50/30" : ""}`}>
                                        <td className="px-2 py-3 font-bold text-gray-700 text-sm">
                                            {format(day, "EEE")}
                                        </td>
                                        <td className="px-2 py-3 font-bold text-gray-700 text-sm">
                                            {format(day, "dd.MM.yyyy")}
                                        </td>
                                        <td className="px-2 py-3">
                                            {record ? (
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold">
                                                    Present
                                                </span>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-md text-xs font-bold ${isToday ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"}`}>
                                                    {isToday ? "Pending" : "Absent"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 font-bold text-xs">
                                            {record?.check_in_time
                                                ? format(parseISO(record.check_in_time), "hh:mm a")
                                                : "—"}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 font-bold text-xs">
                                            {record?.check_out_time
                                                ? format(parseISO(record.check_out_time), "hh:mm a")
                                                : "—"}
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

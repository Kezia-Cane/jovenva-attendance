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
    // We can fetch a bit more than just the week to be safe, or just filter in JS if dataset is small
    // Here we strictly query the week for efficiency

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()

    let records: AttendanceRecord[] = []

    if (user) {
        const { data } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', format(startOfCurrentWeek, 'yyyy-MM-dd'))
            // .lte('date', ...) // Optional, but fetching forward is fine
            .order('date', { ascending: true })

        if (data) records = data as AttendanceRecord[]
    }

    // Generate days for the current week (Mon-Sun)
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i))

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Check In</th>
                                <th className="px-4 py-3 font-medium">Check Out</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {weekDays.map((day) => {
                                const dateStr = format(day, "yyyy-MM-dd")
                                const record = records.find(r => r.date === dateStr)
                                const isToday = isSameDay(day, now)
                                const isFuture = day > now && !isToday

                                return (
                                    <tr key={dateStr} className={isToday ? "bg-blue-50/50" : ""}>
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {format(day, "EEE, MMM d")}
                                            {isToday && <span className="ml-2 text-xs text-blue-600 font-normal">(Today)</span>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {record ? (
                                                <Badge variant="success">Present</Badge>
                                            ) : (
                                                <Badge variant={isToday ? "warning" : "default"} className={isFuture ? "opacity-50" : ""}>
                                                    {isToday ? "Pending" : "Absent"}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 font-mono">
                                            {record?.check_in_time
                                                ? format(parseISO(record.check_in_time), "HH:mm")
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 font-mono">
                                            {record?.check_out_time
                                                ? format(parseISO(record.check_out_time), "HH:mm")
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

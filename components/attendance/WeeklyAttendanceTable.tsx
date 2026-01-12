"use client"

import { useEffect, useState } from "react"
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/common/UIComponents"
import { format, isSameDay, startOfWeek, addDays, parseISO } from "date-fns"

interface AttendanceRecord {
    id: string
    date: string
    check_in_time: string | null
    check_out_time: string | null
    status: 'PRESENT' | 'ABSENT'
}

export function WeeklyAttendanceTable() {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchWeekly() {
            try {
                const res = await fetch('/api/attendance/weekly')
                if (res.ok) {
                    const data = await res.json()
                    setRecords(data)
                }
            } catch (error) {
                console.error("Failed to fetch attendance", error)
            } finally {
                setLoading(false)
            }
        }
        fetchWeekly()
    }, [])

    // Generate days for the current week (Mon-Sun)
    const today = new Date()
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 })
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i))

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
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
                                    const isToday = isSameDay(day, today)

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
                                                    <Badge variant={isToday ? "warning" : "default"}>
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
                )}
            </CardContent>
        </Card>
    )
}

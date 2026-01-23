
"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/common/UIComponents"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, Search } from "lucide-react"

export default function AdminAttendancePage() {
    const [records, setRecords] = useState<any[]>([])
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [loading, setLoading] = useState(true)

    const fetchAttendance = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/attendance?date=${date}`)
            const data = await res.json()
            if (Array.isArray(data)) setRecords(data)
        } catch (error) {
            console.error("Failed to fetch attendance", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendance()
    }, [date])

    const formatTime = (time: string | null) => {
        if (!time) return "—";
        return new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Attendance Master Log</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="date"
                            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-card focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-gray-600"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Check In</th>
                                    <th className="px-6 py-4">Check Out</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 flex flex-col items-center">
                                            <div className="h-6 w-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2" />
                                            Loading records...
                                        </td>
                                    </tr>
                                ) : records.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500 italic">
                                            No attendance records found for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    records.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 font-bold text-xs overflow-hidden">
                                                        {record.users?.avatar_url ? (
                                                            <img src={record.users.avatar_url} alt={record.users.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            record.users?.name?.charAt(0).toUpperCase() || "?"
                                                        )}
                                                    </div>
                                                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                                                        {record.users?.name || "Unknown"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-500">
                                                {format(new Date(record.date), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {formatTime(record.check_in_time)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                {formatTime(record.check_out_time)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {record.status === 'PRESENT' ? (
                                                    <span className="bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                        Present
                                                    </span>
                                                ) : record.status === 'LATE' ? (
                                                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                        Late
                                                    </span>
                                                ) : (
                                                    <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                                                        Absent
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

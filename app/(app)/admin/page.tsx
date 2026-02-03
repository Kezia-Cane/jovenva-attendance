
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/UIComponents"
import { Users, Clock, AlertTriangle, MessageSquare, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { AttendanceAreaChart, LatenessPieChart } from "@/components/admin/AdminCharts"
import Link from "next/link"

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats')
                const data = await res.json()
                if (data.stats) setStats(data.stats)

                // Mock chart data if API doesn't return enough points yet
                // For now, let's use some dummy data for visualization if empty
                // In production, use data.attendanceHistory processed

                const mockHistory = [
                    { date: 'Mon', count: 12 },
                    { date: 'Tue', count: 15 },
                    { date: 'Wed', count: 14 },
                    { date: 'Thu', count: 16 },
                    { date: 'Fri', count: 15 },
                    { date: 'Sat', count: 8 },
                    { date: 'Sun', count: 5 },
                ]
                setChartData(mockHistory)

            } catch (error) {
                console.error("Failed to fetch admin stats", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    const pieData = [
        { name: 'On Time', value: 75, color: '#4FD1C5' }, // Teal
        { name: 'Late', value: 15, color: '#F6E05E' }, // Yellow
        { name: 'Absent', value: 10, color: '#FC8181' }, // Red
    ]

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Admin Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Employees</CardTitle>
                        <Users className="h-4 w-4 text-teal-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats?.totalEmployees}</div>
                        <p className="text-xs text-gray-400 mt-1">Registered users</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Active Now</CardTitle>
                        <Clock className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? "..." : stats?.activeNow}</div>
                        <p className="text-xs text-gray-400 mt-1">Checked in today</p>
                    </CardContent>
                </Card>

                <Link href="/admin/attendance">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-400 cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Missing Checkouts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : stats?.missingCheckouts}</div>
                            <p className="text-xs text-gray-400 mt-1">Requires attention</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/feedback">
                    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-400 cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Feedback</CardTitle>
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? "..." : stats?.feedbackCount}</div>
                            <p className="text-xs text-gray-400 mt-1">New items</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AttendanceAreaChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle>Lateness Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LatenessPieChart data={pieData} />
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    <Link href="/admin/users">
                        <button className="btn-3d btn-3d-teal w-full">
                            <span className="btn-3d-shadow"></span>
                            <span className="btn-3d-edge"></span>
                            <span className="btn-3d-front flex items-center justify-center gap-2">
                                <Users size={18} /> Manage Users
                            </span>
                        </button>
                    </Link>
                    <Link href="/admin/attendance">
                        <button className="btn-3d w-full" style={{ '--btn-front-bg': '#805AD5', '--btn-edge-bg': '#6B46C1', '--btn-text-color': 'white' } as any}>
                            <span className="btn-3d-shadow"></span>
                            <span className="btn-3d-edge"></span>
                            <span className="btn-3d-front flex items-center justify-center gap-2">
                                <Clock size={18} /> Attendance Logs
                            </span>
                        </button>
                    </Link>
                    <Link href="/admin/feedback">
                        <button className="btn-3d w-full" style={{ '--btn-front-bg': '#DD6B20', '--btn-edge-bg': '#C05621', '--btn-text-color': 'white' } as any}>
                            <span className="btn-3d-shadow"></span>
                            <span className="btn-3d-edge"></span>
                            <span className="btn-3d-front flex items-center justify-center gap-2">
                                <MessageSquare size={18} /> View Feedback
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

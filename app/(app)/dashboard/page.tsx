import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WeeklyAttendanceTable } from "@/components/attendance/WeeklyAttendanceTable"
import { AttendanceActions } from "@/components/attendance/AttendanceActions"
import { StatCard } from "@/components/dashboard/StatCard"
import { SystemStatus } from "@/components/dashboard/SystemStatus"
import { Calendar, CheckCircle, Clock } from "lucide-react"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Top Row - Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Check-ins"
                    value="18 / 20"
                    icon={CheckCircle}
                    subtext="Present: 90%"
                    status="success"
                />
                <StatCard
                    title="My Weekly Attendance"
                    value="4 / 5"
                    icon={Calendar}
                    subtext="Mon, Tue, Wed, Thu Present"
                    status="neutral"
                />
                <StatCard
                    title="Pending Actions"
                    value="None"
                    icon={Clock}
                />
                {/* Placeholder for 4th card if needed, or stretch others. Prototype shows 3 main ones or 3+1 grid. */}
            </div>

            {/* Middle Row - Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Weekly Table */}
                <div className="lg:col-span-2 h-full">
                    <WeeklyAttendanceTable />
                </div>

                {/* Right Column: Actions & Status */}
                <div className="flex flex-col gap-6">
                    <AttendanceActions user_id={user.id} />
                    <SystemStatus />
                </div>
            </div>
        </div>
    )
}

import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WeeklyAttendanceTable } from "@/components/attendance/WeeklyAttendanceTable"
import { AttendanceActions } from "@/components/attendance/AttendanceActions"
import { StatCard } from "@/components/dashboard/StatCard"
import { SystemStatus } from "@/components/dashboard/SystemStatus"
import { TeamHours } from "@/components/dashboard/TeamHours"
import { Calendar, CheckCircle, Clock } from "lucide-react"
import { Suspense } from "react"
import { LoadingCard } from "@/components/dashboard/LoadingCard"

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Top Row - Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>

                {/* Main Table */}
                <Suspense fallback={<LoadingCard height="min-h-[400px]" />}>
                    <WeeklyAttendanceTable />
                </Suspense>

                {/* Team Hours Component */}
                <Suspense fallback={<LoadingCard height="min-h-[300px]" />}>
                    <TeamHours />
                </Suspense>
            </div>

            {/* Right Column - Actions & Status (1/3 width) */}
            <div className="flex flex-col gap-6">
                <AttendanceActions user_id={user.id} />
                <Suspense fallback={<LoadingCard height="min-h-[400px]" />}>
                    <SystemStatus />
                </Suspense>
            </div>
        </div>
    )
}

import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WeeklyAttendanceTable } from "@/components/attendance/WeeklyAttendanceTable"
import { AttendanceActions } from "@/components/attendance/AttendanceActions"
import { SystemStatus } from "@/components/dashboard/SystemStatus"
import { TeamHours } from "@/components/dashboard/TeamHours"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { Suspense } from "react"
import { LoadingCard } from "@/components/dashboard/LoadingCard"

export default async function DashboardPage({ searchParams }: { searchParams: { date?: string } }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    // Get date from URL or undefined (defaults to current week in components)
    // Awaiting searchParams to be safe for Next.js 15+
    const resolvedParams = await searchParams
    const date = resolvedParams?.date

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content (2/3 width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Top Row - Stat Cards */}
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-[120px] bg-white rounded-2xl shadow-md animate-pulse" />
                        ))}
                    </div>
                }>
                    <DashboardStats />
                </Suspense>

                {/* Main Table */}
                <Suspense key={`table-${date || 'now'}`} fallback={<LoadingCard height="h-[400px]" />}>
                    <div className="w-full">
                        <WeeklyAttendanceTable date={date} />
                    </div>
                </Suspense>

                {/* Team Hours Component */}
                <Suspense key={`hours-${date || 'now'}`} fallback={<LoadingCard height="h-[300px]" />}>
                    <div className="w-full">
                        <TeamHours date={date} />
                    </div>
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

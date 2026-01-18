import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { StatCard } from "./StatCard"
import { Clock, AlertTriangle, AlertCircle } from "lucide-react"
import { startOfMonth, format, differenceInMinutes, parseISO } from "date-fns"
import { getShiftDate } from "@/lib/date-utils"

export async function DashboardStats() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch metrics
    // Fetch current month's attendance for calculation
    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now)
    const startStr = format(startOfCurrentMonth, 'yyyy-MM-dd')
    const todayShiftDate = getShiftDate()

    const { data: records } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startStr) // Fetch from start of month
        .order('date', { ascending: false })

    // 1. Average Shift Duration
    let totalMinutes = 0
    let presentCount = 0

    // 2. Lateness Rate
    let lateCount = 0
    let totalCheckIns = 0
    const EXPECTED_START_HOUR = 21 // 9:00 PM (Manila Time)

    // Calculate 1 & 2 from fetched 'records'
    records?.forEach(record => {
        // Avg Duration
        if (record.check_in_time && record.check_out_time) {
            const diff = differenceInMinutes(new Date(record.check_out_time), new Date(record.check_in_time))
            totalMinutes += diff
            presentCount++
        }

        // Lateness
        if (record.check_in_time) {
            totalCheckIns++
            const checkInDate = new Date(record.check_in_time)
            // Convert to Manila Time
            const manilaString = checkInDate.toLocaleString("en-US", { timeZone: "Asia/Manila" })
            const manilaDate = new Date(manilaString)
            const hours = manilaDate.getHours()
            const minutes = manilaDate.getMinutes()

            // Shift starts at 9:00 PM (21:00).
            // Late if:
            // - It is 9 PM and minutes > 0 (e.g. 21:01)
            // - It is after 9 PM (22, 23)
            // - It is early morning next day (00:00 - 12:00) which counts as late for the night shift
            if ((hours === EXPECTED_START_HOUR && minutes > 0) || hours > EXPECTED_START_HOUR || hours < 12) {
                lateCount++
            }
        }
    })

    const avgDuration = presentCount > 0 ? totalMinutes / presentCount : 0
    const avgHours = Math.floor(avgDuration / 60)
    const avgMins = Math.round(avgDuration % 60)
    const avgDisplay = `${avgHours}h ${avgMins}m`

    const latenessRate = totalCheckIns > 0 ? Math.round((lateCount / totalCheckIns) * 100) : 0

    // 3. Missing Check-outs Query
    // Count records where date < todayShiftDate AND check_in != null AND check_out == null
    const { count: missingCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lt('date', todayShiftDate)
        .not('check_in_time', 'is', null)
        .is('check_out_time', null)

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
                title="Average Shift Duration"
                value={avgDisplay}
                icon={Clock}
                subtext="Based on this month"
                status="neutral"
            />
            <StatCard
                title="Lateness Rate"
                value={`${latenessRate}%`}
                icon={AlertCircle}
                subtext={latenessRate > 0 ? "Needs Improvement" : "Perfect Attendance"}
                status={latenessRate > 0 ? "warning" : "success"}
            />
            <StatCard
                title="Missing Check-outs"
                value={missingCount || 0}
                icon={AlertTriangle}
                subtext={missingCount && missingCount > 0 ? "Action Required" : "All good"}
                status={missingCount && missingCount > 0 ? "danger" : "success"}
            />
        </div>
    )
}

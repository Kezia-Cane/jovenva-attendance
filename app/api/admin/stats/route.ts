
import { createClient } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { startOfMonth, format, subDays } from "date-fns"
import { getShiftDate } from "@/lib/date-utils"

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check Role
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData?.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const today = getShiftDate()

    // 1. Total Employees
    const { count: totalEmployees, error: employeesError } = await getSupabaseAdmin().from('users').select('*', { count: 'exact', head: true })
    if (employeesError) console.error("Stats Error (Employees):", employeesError)

    // 2. Active Now (Checked in today but not checked out)
    const { count: activeNow, error: activeError } = await getSupabaseAdmin()
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .not('check_in_time', 'is', null)
        .is('check_out_time', null)
    if (activeError) console.error("Stats Error (Active):", activeError)

    // 3. Missing Checkouts (Checked in BEFORE today but never checked out)
    const { count: missingCheckouts, error: missingError } = await getSupabaseAdmin()
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .lt('date', today)
        .not('check_in_time', 'is', null)
        .is('check_out_time', null)
    if (missingError) console.error("Stats Error (Missing):", missingError)

    // 4. Feedback (Pending)
    const { count: feedbackCount, error: feedbackError } = await getSupabaseAdmin()
        .from('feedbacks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PENDING')
    if (feedbackError) console.error("Stats Error (Feedback):", feedbackError)

    // 3. Late Today
    // We need to fetch records to check lateness logic manually or use a simple query if we store status
    // Assuming status is updated correctly or we calculate it. 
    // For simplicity, let's query status='PRESENT' and check in time > 9PM? 
    // Or just rely on the 'status' being ABSENT/PRESENT. 
    // Let's count 'missed' checkouts from yesterday as well?

    // Let's just return what we have
    const stats = {
        totalEmployees: totalEmployees || 0,
        activeNow: activeNow || 0,
        missingCheckouts: missingCheckouts || 0,
        feedbackCount: feedbackCount || 0
    }

    // Chart Data: Attendance over last 30 days
    const last30Days = format(subDays(new Date(), 30), 'yyyy-MM-dd')
    const { data: attendanceHistory } = await supabase
        .from('attendance')
        .select('date, status')
        .gte('date', last30Days)
        .order('date', { ascending: true })

    // Process for chart
    // Group by date
    const chartData = [] // Implement processing logic here or on frontend

    return NextResponse.json({ stats, attendanceHistory })
}

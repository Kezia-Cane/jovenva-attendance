import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { isCheckInAvailable, getShiftDate } from "@/lib/date-utils"
import { AttendanceTracker } from "./AttendanceTracker"

export async function AttendanceActions({ user_id }: { user_id: string }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const today = getShiftDate()

    const [userReq, recordReq] = await Promise.all([
        supabase.from('users').select('name, avatar_url').eq('id', user_id).single(),
        supabase.from('attendance').select('*').eq('user_id', user_id).eq('date', today).single()
    ])

    const userProfile = userReq.data || { name: 'User', avatar_url: null }
    const record = recordReq.data
    const { available: isTimeWindowOpen } = isCheckInAvailable()

    return (
        <AttendanceTracker
            userProfile={userProfile}
            initialRecord={record}
            isTimeWindowOpen={isTimeWindowOpen}
        />
    )
}

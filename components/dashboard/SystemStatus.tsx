
import { Card, CardContent } from "@/components/common/UIComponents"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { getShiftDate, getManilaTime } from "@/lib/date-utils"
import { SystemStatusList } from "./SystemStatusList"

export async function SystemStatus() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get distinct shift date (handles night shifts)
    const todayStr = getShiftDate()
    // Also get literal date to catch records created before the shift calculation fix
    const literalDate = format(getManilaTime(), 'yyyy-MM-dd')
    const queryDates = Array.from(new Set([todayStr, literalDate]))

    // Fetch all users
    const { data: users } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .order('name')

    // Fetch today's attendance (checking both potential date buckets)
    const { data: attendance } = await supabase
        .from('attendance')
        .select('user_id, status, check_in_time, check_out_time')
        .in('date', queryDates)

    return (
        <Card className="border-none shadow-md rounded-2xl h-full bg-card">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-foreground">Today's Attendance</h3>
                </div>

                <SystemStatusList
                    users={users || []}
                    initialAttendance={attendance || []}
                    queryDates={queryDates}
                />
            </CardContent>
        </Card>
    )
}

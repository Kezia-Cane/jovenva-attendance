
import { Card, CardContent } from "@/components/common/UIComponents"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { getManilaTime } from "@/lib/date-utils"

export async function SystemStatus() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get today's date in Manila time for consistency
    const now = getManilaTime()
    const todayStr = format(now, 'yyyy-MM-dd')

    // Fetch all users
    const { data: users } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .order('name')

    // Fetch today's attendance
    const { data: attendance } = await supabase
        .from('attendance')
        .select('user_id, status')
        .eq('date', todayStr)

    // Create a map of user_id -> status
    const attendanceMap = new Map()
    attendance?.forEach(record => {
        attendanceMap.set(record.user_id, record.status)
    })

    return (
        <Card className="border-none shadow-md rounded-2xl h-full bg-white">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Team Attendance</h3>

                </div>

                <div className="flex flex-col gap-4">
                    {users?.map((user) => {
                        const isPresent = attendanceMap.has(user.id)
                        // Use first letter as fallback avatar
                        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'

                        return (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="font-bold text-gray-500 text-sm">{initial}</span>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
                                        {user.name || "Unknown"}
                                    </span>
                                </div>

                                {isPresent ? (
                                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                        Present
                                        <CheckCircle size={12} className="ml-1" />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                                        Absent
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {(!users || users.length === 0) && (
                        <p className="text-gray-400 text-sm text-center py-4">No team members found.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

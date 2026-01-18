
import { Card, CardContent } from "@/components/common/UIComponents"
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { getShiftDate, getManilaTime } from "@/lib/date-utils"

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
        .select('user_id, status, check_in_time')
        .in('date', queryDates)

    // Create a map of user_id -> record
    const attendanceMap = new Map()
    attendance?.forEach(record => {
        // If duplicates exist (rare), prefer the one with check_in_time, or latest
        if (!attendanceMap.has(record.user_id) || record.check_in_time) {
            attendanceMap.set(record.user_id, record)
        }
    })

    // Merge and Sort
    // 1. Present users (sorted by check_in_time ASC)
    // 2. Absent users (sorted by name ASC)
    const processedUsers = (users || []).map(user => {
        const record = attendanceMap.get(user.id)
        return {
            ...user,
            record,
            isPresent: !!record,
            checkInTime: record?.check_in_time ? new Date(record.check_in_time).getTime() : Infinity
        }
    })

    processedUsers.sort((a, b) => {
        if (a.isPresent && !b.isPresent) return -1
        if (!a.isPresent && b.isPresent) return 1
        if (a.isPresent && b.isPresent) return a.checkInTime - b.checkInTime
        return a.name.localeCompare(b.name)
    })

    // Assign Ranks
    // Only present users get a rank
    const presentCount = processedUsers.filter(u => u.isPresent).length

    // Helper to render rank badge
    const renderRankBadge = (index: number, isLast: boolean) => {
        const rank = index + 1
        let badgeClass = "bg-gray-100 text-gray-500 border-white"
        let content = <span className="text-[8px] font-bold">{rank}th</span>

        if (rank === 1) {
            badgeClass = "bg-yellow-400 text-white border-white"
            content = <span className="text-[8px] font-bold text-white">1st</span>
        } else if (rank === 2) {
            badgeClass = "bg-gray-300 text-white border-white"
            content = <span className="text-[8px] font-bold text-white">2nd</span>
        } else if (rank === 3) {
            badgeClass = "bg-orange-400 text-white border-white"
            content = <span className="text-[8px] font-bold text-white">3rd</span>
        }

        if (isLast && rank > 3) {
            return (
                <div className="absolute -bottom-1 -right-2 bg-yellow-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm transform -rotate-6 border border-white z-10">
                    Last
                </div>
            )
        }

        return (
            <div className={`absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full border-2 shadow-sm z-10 ${badgeClass}`}>
                {content}
            </div>
        )
    }

    return (
        <Card className="border-none shadow-md rounded-2xl h-full bg-white">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Today's Attendance</h3>
                </div>

                <div className="flex flex-col gap-4">
                    {processedUsers.map((user, index) => {
                        const isPresent = user.isPresent
                        // Use first letter as fallback avatar
                        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'

                        // Check if this is the last present user
                        // Logic: must be present, and index must be equal to presentCount - 1
                        // Also presentCount must be > 1 to have a "Last" distinct from "1st" if only 1 person is there.
                        const isLast = isPresent && presentCount > 1 && index === presentCount - 1

                        return (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
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
                                        {isPresent && renderRankBadge(index, isLast)}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
                                        {user.name || "Unknown"}
                                    </span>
                                </div>

                                {isPresent ? (
                                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                        In
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                                        Out
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

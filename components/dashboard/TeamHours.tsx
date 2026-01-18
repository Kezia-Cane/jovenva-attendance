import { Card, CardContent } from "@/components/common/UIComponents"
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { startOfWeek, endOfWeek, differenceInMinutes, format } from "date-fns"

export async function TeamHours() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Current Week Range
    const now = new Date()
    const start = startOfWeek(now, { weekStartsOn: 1 }) // Monday
    const end = endOfWeek(now, { weekStartsOn: 1 })

    // Fetch all users
    const { data: users } = await supabase
        .from('users')
        .select('id, name, avatar_url')
        .order('name')

    // Fetch all attendance for this week
    const { data: attendance } = await supabase
        .from('attendance')
        .select('user_id, check_in_time, check_out_time')
        .gte('date', format(start, 'yyyy-MM-dd'))
        .lte('date', format(end, 'yyyy-MM-dd'))

    // Calculate hours per user
    const userHours = new Map<string, number>()

    attendance?.forEach(record => {
        if (record.check_in_time && record.check_out_time) {
            const duration = differenceInMinutes(new Date(record.check_out_time), new Date(record.check_in_time))
            const current = userHours.get(record.user_id) || 0
            userHours.set(record.user_id, current + (duration / 60))
        }
    })

    const data = users?.map(user => {
        const totalHours = Math.round(userHours.get(user.id) || 0)
        // Cap progress at 100% for 40 hours work week for visual logic, or 50?
        // Let's assume 45h is the 'max' for the bar visual based on image (42h is nearly full).
        const percentage = Math.min((totalHours / 45) * 100, 100)

        return {
            ...user,
            totalHours,
            percentage
        }
    }).sort((a, b) => b.totalHours - a.totalHours)

    return (
        <Card className="border-none shadow-md rounded-2xl h-fit bg-white mt-6">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-800">Weekly Total Hours</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm-14 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center mb-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                    <span className="col-span-4">Team Member</span>
                    <span className="col-span-8 text-right">Total Hours</span>
                </div>

                <div className="flex flex-col gap-5">
                    {data?.map(user => (
                        <div key={user.id} className="grid grid-cols-12 gap-4 items-center">
                            {/* Name */}
                            <div className="col-span-4 font-bold text-sm text-gray-700 truncate">
                                {user.name}
                            </div>

                            {/* Bar Section */}
                            <div className="col-span-8 flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-800 w-8 text-right shrink-0">
                                    {user.totalHours}h
                                </span>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-teal-400 rounded-full"
                                        style={{ width: `${user.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!data || data.length === 0) && (
                        <p className="text-gray-400 text-sm text-center">No check-in data available this week.</p>
                    )}
                </div>

            </CardContent>
        </Card>
    )
}

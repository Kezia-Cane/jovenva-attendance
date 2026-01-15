import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { CheckInButton } from "./CheckInButton"
import { CheckOutButton } from "./CheckOutButton"
import { SessionTimer } from "./SessionTimer"
import { isCheckInAvailable } from "@/lib/date-utils"
import { Card, CardContent } from "../common/UIComponents"
import { Clock } from "lucide-react"

export async function AttendanceActions({ user_id }: { user_id: string }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const today = format(new Date(), 'yyyy-MM-dd')

    const [userReq, recordReq] = await Promise.all([
        supabase.from('users').select('name, avatar_url').eq('id', user_id).single(),
        supabase.from('attendance').select('*').eq('user_id', user_id).eq('date', today).single()
    ])

    const userProfile = userReq.data
    const record = recordReq.data

    const isCheckedIn = !!record
    const isCheckedOut = !!record?.check_out_time

    const { available: isTimeWindowOpen } = isCheckInAvailable()
    const canCheckIn = !isCheckedIn && isTimeWindowOpen

    return (
        <Card className="border-none shadow-md rounded-2xl bg-white relative">
            <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-r from-teal-300 to-teal-400 z-0 rounded-t-2xl" />

            <CardContent className="relative z-10 pt-8 pb-10 flex flex-col items-center text-center">

                {/* Header Action Area */}
                <div className="mb-6 w-full flex justify-between items-center px-4 text-white uppercase text-sm font-bold">
                    <div className="w-8"></div> {/* Spacer for centering */}
                    <h3>Attendance</h3>
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Clock size={20} />
                    </div>
                </div>

                {/* Main Action Button Container */}
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[90%] -mt-4 mb-4 flex flex-col items-center gap-4">

                    {/* Profile Section */}
                    <div className="flex flex-col items-center -mt-12 mb-2">
                        <div className="h-20 w-20 rounded-2xl bg-gray-100 border-4 border-white shadow-sm overflow-hidden mb-3 flex items-center justify-center">
                            {userProfile?.avatar_url ? (
                                <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                    {(userProfile?.name?.charAt(0) || "U").toUpperCase()}
                                </span>
                            )}
                        </div>
                        <h3 className="text-gray-800 font-bold text-sm">{userProfile?.name || "Team Member"}</h3>
                        {/* Optional Status Text mimicking the screenshot "Yet to check-in" if desired, 
                             but user only explicitly asked for photo and name. 
                             I'll stick to just photo and name to not clutter unless implied.
                         */}
                    </div>

                    <div className="w-full">
                        {!isCheckedIn ? (
                            <CheckInButton
                                disabled={!canCheckIn}
                                className="w-full h-12 text-sm font-bold bg-teal-300 hover:bg-teal-400 text-white rounded-xl shadow-teal-md transition-all uppercase"
                            />
                        ) : (
                            <CheckOutButton
                                disabled={isCheckedOut}
                                className="w-full h-14 text-sm font-bold bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all uppercase"
                            />
                        )}
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Session Duration</p>
                        <SessionTimer
                            startTime={record?.check_in_time}
                            endTime={record?.check_out_time}
                            className="text-4xl font-bold text-gray-800 tabular-nums"
                        />
                    </div>
                </div>

                {!isTimeWindowOpen && !isCheckedIn && (
                    <div className="bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold border border-orange-100 flex items-center gap-2">
                        <span>⚠️</span> Check-in starts at 8:00 PM
                    </div>
                )}

            </CardContent>
        </Card>
    )
}

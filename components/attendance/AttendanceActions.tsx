import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { CheckInButton } from "./CheckInButton"
import { CheckOutButton } from "./CheckOutButton"
import { SessionTimer } from "./SessionTimer"
import { isCheckInAvailable, getShiftDate } from "@/lib/date-utils"
import { Card, CardContent } from "../common/UIComponents"
import { Clock } from "lucide-react"

export async function AttendanceActions({ user_id }: { user_id: string }) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const today = getShiftDate()

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
                {/* Header Action Area Removed */}
                <div className="mb-6 w-full h-8"></div> {/* Spacer to keep layout height if needed, or remove. 
                   The user reference image has a big teal header area. 
                   If I remove the text, I should keep the spacer or height?
                   "remove the "attendance" text the the time icon"
                   I'll remove the content but maybe keep the padding or structure if it affects position.
                   The styling `pt-8 pb-10` on CardContent handles padding.
                   The `absolute top-0` bg handles the background.
                   I'll just remove the div.
                */}

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
                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Shift Duration</p>
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

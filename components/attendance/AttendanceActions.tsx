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

    const { data: record } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user_id)
        .eq('date', today)
        .single()

    const isCheckedIn = !!record
    const isCheckedOut = !!record?.check_out_time

    const { available: isTimeWindowOpen } = isCheckInAvailable()
    const canCheckIn = !isCheckedIn && isTimeWindowOpen

    return (
        <Card className="h-full border-none shadow-md rounded-2xl overflow-hidden bg-white relative">
            <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-r from-blue-500 to-blue-600 z-0" />

            <CardContent className="relative z-10 pt-8 flex flex-col items-center text-center">

                {/* Header Action Area */}
                <div className="mb-6 w-full flex justify-between items-center px-4 text-white">
                    <h3 className="font-bold text-lg">Attendance</h3>
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Clock size={20} />
                    </div>
                </div>

                {/* Main Action Button Container */}
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-[90%] -mt-4 mb-4 flex flex-col items-center gap-4">

                    <div className="w-full">
                        {!isCheckedIn ? (
                            <CheckInButton disabled={!canCheckIn} className="w-full h-14 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-blue-md transition-all" />
                        ) : (
                            <CheckOutButton disabled={isCheckedOut} className="w-full h-14 text-lg font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-amber-md transition-all" />
                        )}
                    </div>

                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Session Duration</p>
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

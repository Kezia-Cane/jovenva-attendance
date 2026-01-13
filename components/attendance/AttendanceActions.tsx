import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { CheckInButton } from "./CheckInButton"
import { CheckOutButton } from "./CheckOutButton"
import { SessionTimer } from "./SessionTimer"
import { isCheckInAvailable } from "@/lib/date-utils"
import { Card, CardContent, CardHeader, CardTitle } from "../common/UIComponents"

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
        <Card>
            <CardHeader>
                <CardTitle>Today's Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <SessionTimer
                    startTime={record?.check_in_time}
                    endTime={record?.check_out_time}
                />

                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-4 justify-center">
                        <CheckInButton disabled={!canCheckIn} />
                        <CheckOutButton disabled={!isCheckedIn || isCheckedOut} />
                    </div>
                    {!isTimeWindowOpen && !isCheckedIn && (
                        <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
                            Check-in available at 8:00 PM (PH Time)
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

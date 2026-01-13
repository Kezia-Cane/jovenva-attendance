import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { format } from "date-fns"
import { CheckInButton } from "./CheckInButton"
import { CheckOutButton } from "./CheckOutButton"
import { SessionTimer } from "./SessionTimer"
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>Today's Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isCheckedIn && !isCheckedOut && record?.check_in_time && (
                    <SessionTimer startTime={record.check_in_time} />
                )}
                <div className="flex gap-4">
                    <CheckInButton disabled={isCheckedIn} />
                    <CheckOutButton disabled={!isCheckedIn || isCheckedOut} />
                </div>
            </CardContent>
        </Card>
    )
}

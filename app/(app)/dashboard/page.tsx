import { createClient } from "@/lib/supabase-server"
import { Button } from "@/components/common/Button"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { WeeklyAttendanceTable } from "@/components/attendance/WeeklyAttendanceTable"
import { AttendanceActions } from "@/components/attendance/AttendanceActions"

export default async function DashboardPage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-bold text-gray-900">JovenVA</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">Welcome, {user.email}</span>
                        <form
                            action={async () => {
                                "use server"
                                const cookieStore = cookies()
                                const supabase = createClient(cookieStore)
                                await supabase.auth.signOut()
                                redirect("/login")
                            }}
                        >
                            <Button variant="outline" size="sm" type="submit">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Status Cards could go here */}
                </div>

                <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                    <div className="flex-1">
                        <AttendanceActions user_id={user.id} />
                    </div>
                </div>

                <WeeklyAttendanceTable />
            </main>
        </div>
    )
}

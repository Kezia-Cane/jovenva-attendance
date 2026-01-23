"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent } from "../common/UIComponents"
import { SessionTimer } from "./SessionTimer"
import { TypingIndicator } from "@/components/common/TypingIndicator"
import { isCheckInAvailable } from "@/lib/date-utils" // We might need to handle this client-side or pass prop

interface AttendanceRecord {
    id: string
    date: string
    check_in_time: string
    check_out_time: string | null
    status: string
}

interface UserProfile {
    name: string | null
    avatar_url: string | null
}

interface AttendanceTrackerProps {
    userProfile: UserProfile
    initialRecord: AttendanceRecord | null
    isTimeWindowOpen: boolean
    serverTime: string
}

export function AttendanceTracker({ userProfile, initialRecord, isTimeWindowOpen, serverTime }: AttendanceTrackerProps) {
    const [record, setRecord] = useState<AttendanceRecord | null>(initialRecord)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const isCheckedIn = !!record
    const isCheckedOut = !!record?.check_out_time
    const canCheckIn = !isCheckedIn && isTimeWindowOpen

    const handleCheckIn = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-in", { method: "POST" })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to check in")
            }
            const newRecord = await res.json()
            setRecord(newRecord)
            router.refresh() // Sync server components too (like Weekly Table)
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : "Error checking in")
        } finally {
            setLoading(false)
        }
    }

    const handleCheckOut = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-out", { method: "POST" })
            if (!res.ok) throw new Error("Check-out failed")

            const updatedRecord = await res.json()
            setRecord(updatedRecord)
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to check out")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-none shadow-md rounded-2xl bg-card relative">
            <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-r from-teal-300 to-teal-400 z-0 rounded-t-2xl" />

            <CardContent className="relative z-10 pt-8 pb-10 flex flex-col items-center text-center">

                {/* Main Action Button Container */}
                <div className="w-full mt-20 mb-4 flex flex-col items-center gap-4">

                    {/* Profile Section */}
                    <div className="flex flex-col items-center -mt-12 mb-2">
                        <div className="h-28 w-28 rounded-2xl bg-gray-100 border-4 border-white shadow-sm overflow-hidden mb-3 flex items-center justify-center">
                            {userProfile?.avatar_url ? (
                                <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.name || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                    {(userProfile?.name?.charAt(0) || "U").toUpperCase()}
                                </span>
                            )}
                        </div>
                        <h3 className="text-foreground font-bold text-sm">{userProfile?.name || "Team Member"}</h3>
                    </div>

                    <div className="w-full">
                        {!isCheckedIn ? (
                            <button
                                onClick={handleCheckIn}
                                disabled={!canCheckIn || loading}
                                className={`btn-3d btn-3d-teal w-full h-12 text-sm font-bold bg-teal-300 hover:bg-teal-400 text-white rounded-xl shadow-teal-md transition-all uppercase ${(!canCheckIn || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="btn-3d-shadow"></span>
                                <span className="btn-3d-edge"></span>
                                <span className="btn-3d-front flex items-center justify-center">
                                    {loading ? <TypingIndicator /> : "Check In"}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleCheckOut}
                                disabled={isCheckedOut || loading}
                                className={`btn-3d btn-3d-red w-full h-14 text-sm font-bold bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all uppercase ${(isCheckedOut || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span className="btn-3d-shadow"></span>
                                <span className="btn-3d-edge"></span>
                                <span className="btn-3d-front flex items-center justify-center">
                                    {loading ? <TypingIndicator /> : (isCheckedOut ? "Checked Out" : "Check Out")}
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Shift Duration</p>
                        <SessionTimer
                            startTime={record?.check_in_time}
                            endTime={record?.check_out_time}
                            serverTime={serverTime}
                            className="text-4xl font-bold text-foreground tabular-nums"
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

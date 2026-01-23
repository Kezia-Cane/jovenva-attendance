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
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-card overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center">

                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full p-1 bg-white dark:bg-gray-800 shadow-sm mb-4">
                        <div className="h-full w-full rounded-full overflow-hidden relative">
                            {userProfile?.avatar_url ? (
                                <img
                                    src={userProfile.avatar_url}
                                    alt={userProfile.name || "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-400">
                                        {(userProfile?.name?.charAt(0) || "U").toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-foreground font-bold text-xl">{userProfile?.name || "Team Member"}</h3>
                </div>

                {/* Action Button */}
                <div className="w-full mb-8">
                    {!isCheckedIn ? (
                        <button
                            onClick={handleCheckIn}
                            disabled={!canCheckIn || loading}
                            className={`btn-3d btn-3d-teal w-full h-14 text-base font-bold bg-teal-400 hover:bg-teal-500 text-white rounded-full shadow-lg transition-all uppercase tracking-wide ${(!canCheckIn || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="btn-3d-shadow rounded-full"></span>
                            <span className="btn-3d-edge rounded-full"></span>
                            <span className="btn-3d-front rounded-full flex items-center justify-center">
                                {loading ? <TypingIndicator /> : "Check In"}
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleCheckOut}
                            disabled={isCheckedOut || loading}
                            className={`btn-3d btn-3d-red w-full h-14 text-base font-bold bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all uppercase tracking-wide ${(isCheckedOut || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="btn-3d-shadow rounded-full"></span>
                            <span className="btn-3d-edge rounded-full"></span>
                            <span className="btn-3d-front rounded-full flex items-center justify-center">
                                {loading ? <TypingIndicator /> : (isCheckedOut ? "Checked Out" : "Check Out")}
                            </span>
                        </button>
                    )}
                </div>

                {/* Shift Duration / Timer Section */}
                <div className="flex flex-col items-center w-full">
                    <p className="text-gray-400 text-[10px] font-bold uppercase mb-3 tracking-wider">Shift Duration</p>

                    <SessionTimer
                        startTime={record?.check_in_time}
                        endTime={record?.check_out_time}
                        serverTime={serverTime}
                        className="text-4xl font-bold text-teal-400 tracking-wider tabular-nums font-mono"
                    />
                </div>

                {!isTimeWindowOpen && !isCheckedIn && (
                    <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-xl text-xs font-bold border border-orange-100 dark:border-orange-800 flex items-center gap-2">
                        <span>⚠️</span> Check-in starts at 8:00 PM
                    </div>
                )}

            </CardContent>
        </Card>
    )
}


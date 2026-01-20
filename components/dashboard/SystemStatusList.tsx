"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { format } from "date-fns"

interface User {
    id: string
    name: string | null
    avatar_url: string | null
}

interface AttendanceRecord {
    user_id: string
    status: string
    check_in_time: string | null
    check_out_time: string | null
}

interface SystemStatusListProps {
    users: User[]
    initialAttendance: AttendanceRecord[]
    queryDates: string[]
}

export function SystemStatusList({ users, initialAttendance, queryDates }: SystemStatusListProps) {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance)
    const supabase = createClient()

    useEffect(() => {
        // Realtime Subscription
        const channel = supabase
            .channel('attendance-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT and UPDATE
                    schema: 'public',
                    table: 'attendance'
                },
                (payload) => {
                    const newRecord = payload.new as AttendanceRecord

                    // Filter out irrelevant dates (e.g. yesterday's updates if irrelevant, but queryDates handles today)
                    // Ideally we check if date matches, but date is "YYYY-MM-DD". payload.new has 'date'.
                    // payload.new might change structure.
                    // For simplicity, we just update/insert into our local state if user_id matches or add if new.
                    // We can verify date client side if needed, but 'today' logic is mostly correct.
                    // Let's being robust:

                    if (payload.eventType === 'INSERT') {
                        setAttendance(prev => [...prev.filter(r => r.user_id !== newRecord.user_id), newRecord])
                    } else if (payload.eventType === 'UPDATE') {
                        setAttendance(prev => prev.map(r => r.user_id === newRecord.user_id ? newRecord : r))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase])

    // Process Data
    const attendanceMap = new Map()
    attendance.forEach(record => {
        if (!attendanceMap.has(record.user_id) || record.check_in_time) {
            attendanceMap.set(record.user_id, record)
        }
    })

    const processedUsers = (users || []).map(user => {
        const record = attendanceMap.get(user.id)
        const checkInTime = record?.check_in_time ? new Date(record.check_in_time).getTime() : Infinity
        return {
            ...user,
            record,
            // "Present" means they have a record today (checked in at least once)
            // But for status badge "In" vs "Out", we check check_out_time
            hasRecord: !!record,
            isCheckedOut: !!record?.check_out_time,
            checkInTime
        }
    })

    processedUsers.sort((a, b) => {
        // Has record comes first
        if (a.hasRecord && !b.hasRecord) return -1
        if (!a.hasRecord && b.hasRecord) return 1
        // Then sort by check in time
        if (a.hasRecord && b.hasRecord) return a.checkInTime - b.checkInTime
        // Then alpha
        return (a.name || "").localeCompare(b.name || "")
    })

    // Count those with records for ranking
    const presentCount = processedUsers.filter(u => u.hasRecord).length

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
        <div className="flex flex-col gap-4">
            {processedUsers.map((user, index) => {
                const hasRecord = user.hasRecord
                const isCheckedOut = user.isCheckedOut
                const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'
                const isLast = hasRecord && presentCount > 1 && index === presentCount - 1

                return (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name || "User"}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-bold text-gray-500 text-sm">{initial}</span>
                                    )}
                                </div>
                                {hasRecord && renderRankBadge(index, isLast)}
                            </div>
                            <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">
                                {user.name || "Unknown"}
                            </span>
                        </div>

                        {hasRecord ? (
                            isCheckedOut ? (
                                <div className="flex items-center gap-1 bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                                    Out
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                    In
                                </div>
                            )
                        ) : (
                            <div className="flex items-center gap-1 bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">
                                Absent
                            </div>
                        )}
                    </div>
                )
            })}

            {(!users || users.length === 0) && (
                <p className="text-gray-400 text-sm text-center py-4">No team members found.</p>
            )}
        </div>
    )
}

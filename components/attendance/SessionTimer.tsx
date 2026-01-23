"use client"

import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

export interface SessionTimerProps {
    startTime?: string | null
    endTime?: string | null
    className?: string
    serverTime?: string
}

export function SessionTimer({ startTime, endTime, className, serverTime }: SessionTimerProps) {
    const [elapsed, setElapsed] = useState("00:00:00")
    const [status, setStatus] = useState<"READY" | "RUNNING" | "COMPLETED">("READY")

    const [offset] = useState(() => {
        if (serverTime) {
            return new Date(serverTime).getTime() - Date.now()
        }
        return 0
    })

    useEffect(() => {
        if (!startTime) {
            setElapsed("00:00:00")
            setStatus("READY")
            return
        }

        const start = new Date(startTime)
        // Check for invalid date
        if (isNaN(start.getTime())) {
            setElapsed("00:00:00")
            return
        }

        const updateTimer = () => {
            const now = endTime ? new Date(endTime) : new Date(Date.now() + offset)
            const totalSeconds = differenceInSeconds(now, start)

            // Clamp to 0 to avoid negative numbers if client clock is behind server
            const safeSeconds = Math.max(0, totalSeconds)

            const hours = Math.floor(safeSeconds / 3600)
            const minutes = Math.floor((safeSeconds % 3600) / 60)
            const seconds = safeSeconds % 60

            const pad = (num: number) => num.toString().padStart(2, '0')
            setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        }

        updateTimer() // Initial update

        let interval: NodeJS.Timeout

        if (endTime) {
            setStatus("COMPLETED")
        } else {
            setStatus("RUNNING")
            interval = setInterval(updateTimer, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [startTime, endTime])

    const getStatusColor = () => {
        switch (status) {
            case "RUNNING": return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800"
            case "COMPLETED": return "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800"
            default: return "bg-gray-50 text-gray-500 border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 w-full rounded-2xl bg-gray-50 border border-gray-100 dark:bg-gray-800/50 dark:border-gray-800 shadow-inner">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {status === "READY" ? "Ready to Start" : (status === "RUNNING" ? "Running" : "Completed")}
            </span>
            {/* Timer Display */}
            <div className={`font-mono text-4xl font-bold tracking-wider ${status === "RUNNING" ? "text-teal-400" : "text-gray-700 dark:text-gray-300"
                } ${className}`}>
                {elapsed}
            </div>
        </div>
    )
}

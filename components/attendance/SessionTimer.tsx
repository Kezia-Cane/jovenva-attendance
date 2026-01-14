"use client"

import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

export interface SessionTimerProps {
    startTime?: string | null
    endTime?: string | null
    className?: string
}

export function SessionTimer({ startTime, endTime, className }: SessionTimerProps) {
    const [elapsed, setElapsed] = useState("00:00:00")
    const [status, setStatus] = useState<"READY" | "RUNNING" | "COMPLETED">("READY")

    useEffect(() => {
        if (!startTime) {
            setElapsed("00:00:00")
            setStatus("READY")
            return
        }

        const start = new Date(startTime)
        let interval: NodeJS.Timeout

        const updateTimer = () => {
            const now = endTime ? new Date(endTime) : new Date()
            const totalSeconds = differenceInSeconds(now, start)

            if (totalSeconds < 0) {
                setElapsed("00:00:00")
                return
            }

            const hours = Math.floor(totalSeconds / 3600)
            const minutes = Math.floor((totalSeconds % 3600) / 60)
            const seconds = totalSeconds % 60

            const pad = (num: number) => num.toString().padStart(2, '0')
            setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`)
        }

        updateTimer()

        if (endTime) {
            setStatus("COMPLETED")
        } else {
            setStatus("RUNNING")
            interval = setInterval(updateTimer, 1000)
        }

        return () => clearInterval(interval)
    }, [startTime, endTime])

    const getStatusColor = () => {
        switch (status) {
            case "RUNNING": return "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800"
            case "COMPLETED": return "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-100 dark:border-green-800"
            default: return "bg-gray-50 text-gray-500 border-gray-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 w-full rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {status === "READY" ? "Ready to Start" : (status === "RUNNING" ? "Running" : "Completed")}
            </span>
            {/* Timer Display */}
            <div className={`font-mono text-3xl font-bold tracking-wider ${status === "RUNNING" ? "text-teal-400" : "text-gray-700"
                } ${className}`}>
                {elapsed}
            </div>
        </div>
    )
}

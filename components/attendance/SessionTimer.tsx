"use client"

import { useEffect, useState } from "react"
import { differenceInSeconds } from "date-fns"

export function SessionTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState("00:00:00")

    useEffect(() => {
        const start = new Date(startTime)

        const updateTimer = () => {
            const now = new Date()
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

        // Update immediately
        updateTimer()

        // Update every second
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [startTime])

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <span className="text-sm text-blue-600 dark:text-blue-300 font-medium uppercase tracking-wider">
                Current Session
            </span>
            <span className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-100 mt-1">
                {elapsed}
            </span>
        </div>
    )
}

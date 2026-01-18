"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TypingIndicator } from "@/components/common/TypingIndicator"

interface CheckInButtonProps {
    disabled?: boolean
    className?: string
}

export function CheckInButton({ disabled, className }: CheckInButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCheckIn = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-in", { method: "POST" })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to check in")
            }

            router.refresh()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : "Error checking in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleCheckIn}
            disabled={disabled || loading}
            className={`btn-3d btn-3d-teal ${className || ""}`}
        >
            <span className="btn-3d-shadow"></span>
            <span className="btn-3d-edge"></span>
            <span className="btn-3d-front">
                {loading ? <TypingIndicator /> : (disabled ? "Checked In" : "Check In")}
            </span>
        </button>
    )
}

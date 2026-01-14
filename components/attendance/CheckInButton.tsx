"use client"

import { useState } from "react"
import { Button } from "@/components/common/Button"
import { useRouter } from "next/navigation"

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
        <Button
            onClick={handleCheckIn}
            disabled={disabled || loading}
            className={className}
            variant="primary"
            size="lg"
        >
            {loading ? "Checking In..." : (disabled ? "Checked In" : "Check In")}
        </Button>
    )
}

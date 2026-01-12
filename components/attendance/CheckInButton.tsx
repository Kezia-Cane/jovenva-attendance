"use client"

import { useState } from "react"
import { Button } from "@/components/common/Button"
import { useRouter } from "next/navigation"

export function CheckInButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCheckIn = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-in", { method: "POST" })
            if (!res.ok) throw new Error("Failed to check in")

            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Error checking in")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleCheckIn}
            disabled={disabled || loading}
            className={disabled ? "opacity-50 cursor-not-allowed" : ""}
            variant="primary"
            size="lg"
        >
            {loading ? "Checking In..." : (disabled ? "Checked In" : "Check In")}
        </Button>
    )
}

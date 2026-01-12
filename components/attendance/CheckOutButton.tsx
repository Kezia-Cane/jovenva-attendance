"use client"

import { useState } from "react"
import { Button } from "@/components/common/Button"
import { useRouter } from "next/navigation"

export function CheckOutButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCheckOut = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-out", { method: "POST" })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to check out")
            }

            router.refresh()
        } catch (error) {
            console.error(error)
            alert(error instanceof Error ? error.message : "Error checking out")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleCheckOut}
            disabled={disabled || loading}
            variant="secondary"
            size="lg"
        >
            {loading ? "Checking Out..." : (disabled ? "Checked Out" : "Check Out")}
        </Button>
    )
}

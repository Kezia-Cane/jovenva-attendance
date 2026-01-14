"use client"

import { useState } from "react"
import { Button } from "@/components/common/Button"
import { useRouter } from "next/navigation"

interface CheckOutButtonProps {
    disabled?: boolean
    className?: string
}

export function CheckOutButton({ disabled, className }: CheckOutButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleCheckOut = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/attendance/check-out", { method: "POST" })
            if (!res.ok) throw new Error("Check-out failed")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to check out")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            onClick={handleCheckOut}
            disabled={disabled || loading}
            variant="secondary"
            className={className}
        >
            {loading ? "Checking Out..." : "Check Out"}
        </Button>
    )
}

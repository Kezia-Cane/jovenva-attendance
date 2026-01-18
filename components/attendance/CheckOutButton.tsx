"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TypingIndicator } from "@/components/common/TypingIndicator"

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
        <button
            onClick={handleCheckOut}
            disabled={disabled || loading}
            className={`btn-3d btn-3d-red ${className || ""}`}
        >
            <span className="btn-3d-shadow"></span>
            <span className="btn-3d-edge"></span>
            <span className="btn-3d-front">
                {loading ? <TypingIndicator /> : "Check Out"}
            </span>
        </button>
    )
}

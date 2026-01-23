"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase" // Use client-side client
import { User } from "@/lib/types"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push("/login")
                    return
                }

                // Fetch user profile to check role
                const { data: profile, error } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", user.id)
                    .single()

                if (error || !profile || profile.role !== "ADMIN") {
                    console.warn("Access denied: User is not an admin")
                    router.push("/dashboard") // Redirect to normal dashboard
                    return
                }

                setIsAuthorized(true)
            } catch (err) {
                console.error("Auth check failed", err)
                router.push("/dashboard")
            } finally {
                setIsLoading(false)
            }
        }

        checkUser()
    }, [router, supabase])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-teal-500" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Verifying Admin Privileges...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}

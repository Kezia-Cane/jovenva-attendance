"use client"

import { createClient } from "@/lib/supabase"
import { useState } from "react"
import { TypingIndicator } from "@/components/common/TypingIndicator"

export function GoogleSignInButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })
            if (error) throw error
        } catch (error) {
            console.error("Login error:", error)
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="btn-3d btn-3d-google"
        >
            <span className="btn-3d-shadow"></span>
            <span className="btn-3d-edge"></span>
            <span className="btn-3d-front gap-3">
                {isLoading ? (
                    <TypingIndicator />
                ) : (
                    <>
                        <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Sign in with Google
                    </>
                )}
            </span>
        </button>
    )
}

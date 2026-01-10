import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="text-center">
                    {/* Logo placeholder if needed, maybe just text for now */}
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        JovenVA Attendance
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access the system
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <GoogleSignInButton />
                </div>
            </div>
        </div>
    )
}

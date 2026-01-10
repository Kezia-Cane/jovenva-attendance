import { auth, signOut } from "@/lib/auth"
import { Button } from "@/components/common/Button"

export default async function DashboardPage() {
    const session = await auth()

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-bold text-gray-900">JovenVA</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-700">Welcome, {session?.user?.name}</span>
                        <form
                            action={async () => {
                                "use server"
                                await signOut()
                            }}
                        >
                            <Button variant="outline" size="sm" type="submit">
                                Sign Out
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="rounded-lg bg-white p-6 shadow">
                    <p>Dashboard content coming soon...</p>
                </div>
            </main>
        </div>
    )
}

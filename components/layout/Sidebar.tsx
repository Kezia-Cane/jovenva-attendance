"use client"

import { Home, Clock, Settings, HelpCircle, FileText, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOutAction } from "@/app/actions/auth"
import { useState } from "react"

import { FeedbackButton } from "@/components/common/FeedbackButton"
import { ConfirmModal } from "@/components/common/Modal"

export function Sidebar() {
    const pathname = usePathname()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogoutClick = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLogoutModalOpen(true)
    }

    const confirmLogout = async () => {
        setIsLoggingOut(true)
        try {
            await signOutAction()
        } catch (error) {
            console.error("Logout failed", error)
            setIsLoggingOut(false)
        }
    }

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Daily Schedule", href: "/schedule", icon: Calendar },
        { name: "Settings", href: "/settings", icon: Settings },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <>
            <aside className="fixed inset-y-0 left-0 z-50 w-64 block bg-transparent overflow-y-auto pb-4 pt-8 px-4 flex flex-col">
                <div className="flex items-center px-4 mb-14">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-300 text-white">
                        <span className="font-bold">J</span>
                    </div>
                    <span className="ml-3 text-sm font-bold uppercase text-gray-900">
                        JovenVA
                    </span>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    {links.map((link) => {
                        const active = isActive(link.href)
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all ease-in-out duration-300 ${active
                                    ? "bg-card text-foreground shadow-lg"
                                    : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${active
                                    ? "bg-teal-300 text-white shadow-teal-md"
                                    : "bg-card text-teal-300 shadow-sm"
                                    }`}>
                                    <link.icon size={16} />
                                </div>
                                {link.name}
                            </Link>
                        )
                    })}
                </div>

                {/* Action Buttons Column */}
                <div className="mt-auto mb-4 flex flex-col gap-3">
                    <FeedbackButton />

                    <form onSubmit={handleLogoutClick}>
                        <button
                            type="submit"
                            title="Logout"
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-card text-gray-500 dark:text-gray-400 border-2 border-transparent font-bold text-sm shadow-sm hover:border-red-100 hover:text-red-500 hover:shadow-red-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Log Out"
                message="Are you sure you want to log out?"
                confirmLabel="Log Out"
                variant="danger"
                isLoading={isLoggingOut}
            />
        </>
    )
}

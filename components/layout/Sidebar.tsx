"use client"

import { Home, Clock, Settings, HelpCircle, FileText, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOutAction } from "@/app/actions/auth"

import { FeedbackButton } from "@/components/common/FeedbackButton"

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Daily Schedule", href: "/schedule", icon: Calendar },
        { name: "Settings", href: "/settings", icon: Settings },
    ]

    const isActive = (path: string) => pathname === path

    return (
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
                                ? "bg-white text-gray-900 shadow-lg"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-lg ${active
                                ? "bg-teal-300 text-white shadow-teal-md"
                                : "bg-white text-teal-300 shadow-sm"
                                }`}>
                                <link.icon size={16} />
                            </div>
                            {link.name}
                        </Link>
                    )
                })}
            </div>

            {/* Logout Button */}
            <div className="mt-auto mb-4 flex flex-col gap-2">
                <FeedbackButton />
                <form action={signOutAction}>
                    <button type="submit" className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-gray-500 hover:text-red-500 transition-all ease-in-out duration-300 group">
                        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-white text-teal-300 shadow-sm group-hover:text-red-500 group-hover:shadow-red-sm transition-colors">
                            <LogOut size={16} />
                        </div>
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    )
}

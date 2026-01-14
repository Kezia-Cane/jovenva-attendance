"use client"

import { Home, Clock, Settings, HelpCircle, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Attendance History", href: "/history", icon: Clock },
        { name: "Settings", href: "/settings", icon: Settings },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 block bg-transparent overflow-y-auto pb-4 pt-8 px-4">
            <div className="flex items-center px-4 mb-8">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-300 text-white">
                    <span className="font-bold">J</span>
                </div>
                <span className="ml-3 text-sm font-bold uppercase text-gray-900">
                    JovenVA
                </span>
            </div>

            <div className="flex flex-col gap-2">
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

            {/* Help Card */}
            <div className="mt-auto">
                <div className="relative overflow-hidden rounded-2xl bg-teal-300 p-4 pb-4">
                    <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-opacity-30 text-white">
                        <HelpCircle size={18} />
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-white">Need help?</h4>
                    <p className="mb-4 text-xs font-medium text-white">
                        Please check our docs
                    </p>
                    <button className="w-full rounded-lg bg-white py-2 text-xs font-bold text-gray-800 transition-colors hover:bg-gray-100 uppercase">
                        Documentation
                    </button>

                    {/* Background decorations */}
                    <div className="absolute -right-4 -top-8 h-24 w-24 rounded-full bg-white opacity-20 blur-xl"></div>
                </div>
            </div>
        </aside>
    )
}

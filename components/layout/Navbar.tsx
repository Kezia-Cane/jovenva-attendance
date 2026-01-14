"use client"

import { Search, Bell, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { signOutAction } from "@/app/actions/auth"

export function Navbar() {
    const pathname = usePathname()
    // Convert /dashboard -> Dashboard
    const pageName = pathname.split("/").filter(Boolean).pop()
    const formattedName = pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : "Dashboard"

    return (
        <nav className="sticky top-4 z-40 mx-4 mt-4 flex flex-col gap-4 rounded-2xl border-none backdrop-blur-xl bg-white/30 p-2 md:flex-row md:items-center md:justify-between px-4 py-3 shadow-none transition-all">
            <div className="flex flex-col gap-1">
                {/* Breadcrumbs removed as requested */}
                <h6 className="text-base font-bold text-gray-800 capitalize">
                    {formattedName}
                </h6>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex items-center rounded-2xl bg-white px-3 py-2 shadow-sm border border-gray-100">
                    <Search size={14} className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Type here..."
                        className="ml-2 w-full appearance-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3 text-gray-500">
                    <form action={signOutAction}>
                        <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                            Logout
                        </button>
                    </form>
                    <button className="hover:text-teal-300 transition-colors">
                        <Settings size={18} />
                    </button>
                    <button className="hover:text-teal-300 transition-colors relative">
                        <Bell size={18} />
                    </button>
                </div>
            </div>
        </nav>
    )
}

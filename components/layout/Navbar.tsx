"use client"

import { Search, Bell } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeSwitch } from "@/components/common/ThemeSwitch"

export function Navbar() {
    const pathname = usePathname()
    // Convert /dashboard -> Dashboard
    const pageName = pathname.split("/").filter(Boolean).pop()
    const formattedName = pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : "Dashboard"

    return (
        <nav className="sticky top-4 z-40 mx-4 mt-4 flex flex-col gap-4 rounded-2xl border-none backdrop-blur-xl bg-white/30 dark:bg-gray-800/30 p-2 md:flex-row md:items-center md:justify-between px-4 py-3 shadow-none transition-all">
            <div className="flex flex-col gap-1">
                {/* Breadcrumbs removed as requested */}
                <h6 className="text-base font-bold text-foreground capitalize">
                    {formattedName}
                </h6>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex items-center rounded-2xl bg-white dark:bg-card px-3 py-2 shadow-sm border border-gray-100 dark:border-gray-700">
                    <Search size={14} className="text-gray-500 dark:text-gray-400" />
                    <input
                        type="text"
                        placeholder="Type here..."
                        className="ml-2 w-full appearance-none bg-transparent text-sm text-foreground outline-none placeholder:text-gray-400"
                    />
                </div>

                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                    <ThemeSwitch />
                    <button className="hover:text-teal-300 transition-colors relative">
                        <Bell size={18} />
                    </button>
                </div>
            </div>
        </nav>
    )
}


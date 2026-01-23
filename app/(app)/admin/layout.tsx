
"use client"

import AdminGuard from "@/components/admin/AdminGuard"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AdminGuard>
            <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {children}
            </div>
        </AdminGuard>
    )
}

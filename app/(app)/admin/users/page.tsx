
"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/common/UIComponents"
import { useEffect, useState } from "react"
import { User } from "@/lib/types"
import { Search, Crown, User as UserIcon, Shield } from "lucide-react"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            if (Array.isArray(data)) setUsers(data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'EMPLOYEE') => {
        try {
            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId, role: newRole })
            })

            if (!res.ok) {
                // Revert on failure
                fetchUsers()
                alert("Failed to update role")
            }
        } catch (error) {
            console.error(error)
            fetchUsers()
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-card focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">Loading users...</td>
                                    </tr>
                                )}
                                {!loading && filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 font-bold overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role === 'ADMIN' ? (
                                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-transparent gap-1 pl-1 pr-2">
                                                    <Crown size={12} fill="currentColor" /> Admin
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-transparent gap-1 pl-1 pr-2">
                                                    <UserIcon size={12} /> Employee
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRoleChange(user.id, user.role === 'ADMIN' ? 'EMPLOYEE' : 'ADMIN')}
                                                className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                {user.role === 'ADMIN' ? 'Demote to Employee' : 'Promote to Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

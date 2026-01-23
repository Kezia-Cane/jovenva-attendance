
"use client"

import { Card, CardContent } from "@/components/common/UIComponents"
import { useEffect, useState } from "react"
import { MessageSquare, Calendar } from "lucide-react"

export default function AdminFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch('/api/admin/feedback')
                const data = await res.json()
                if (Array.isArray(data)) setFeedbacks(data)
            } catch (error) {
                console.error("Failed to fetch feedback", error)
            } finally {
                setLoading(false)
            }
        }
        fetchFeedback()
    }, [])

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">User Feedback</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading && (
                    <div className="col-span-full h-32 flex items-center justify-center text-gray-500 text-sm">
                        Loading feedback...
                    </div>
                )}

                {!loading && feedbacks.length === 0 && (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <MessageSquare className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No feedback received yet.</p>
                    </div>
                )}

                {!loading && feedbacks.map((item) => (
                    <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 border-neutral-200/60 dark:border-gray-700">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                                        {item.users?.avatar_url ? (
                                            <img src={item.users.avatar_url} alt={item.users.name} className="h-full w-full object-cover" />
                                        ) : (
                                            item.users?.name?.charAt(0).toUpperCase() || "U"
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900 dark:text-gray-100">
                                            {item.users?.name || "Anonymous"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {item.users?.email}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                        item.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                                {item.message}
                            </p>

                            <div className="flex items-center text-gray-400 text-xs font-medium pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Calendar size={12} className="mr-1.5" />
                                {new Date(item.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

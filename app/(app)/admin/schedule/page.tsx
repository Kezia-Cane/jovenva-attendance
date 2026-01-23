
"use client"

import { Card, CardContent } from "@/components/common/UIComponents"
import { useEffect, useState } from "react"
import { Calendar, Clock, User, CheckCircle2, Circle } from "lucide-react"
import { format } from "date-fns"

export default function AdminSchedulePage() {
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/admin/schedule')
                const data = await res.json()
                if (Array.isArray(data)) setTasks(data)
            } catch (error) {
                console.error("Failed to fetch schedule", error)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Team Schedule Overview</h1>
            </div>

            <div className="space-y-4">
                {loading && (
                    <div className="h-32 flex items-center justify-center text-gray-500">
                        Loading schedule...
                    </div>
                )}

                {!loading && tasks.length === 0 && (
                    <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Calendar className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-gray-500 font-medium">No tasks scheduled.</p>
                    </div>
                )}

                {!loading && tasks.map((task) => (
                    <Card key={task.id} className="group hover:shadow-md transition-all duration-300 border-l-4 border-l-teal-400">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    {task.title}
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {task.priority}
                                    </span>
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {format(new Date(task.date), 'MMM d, yyyy')}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {task.start_time.slice(0, 5)} - {task.end_time.slice(0, 5)}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {task.assignee?.avatar_url ? (
                                            <img src={task.assignee.avatar_url} alt={task.assignee.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <User size={16} className="text-gray-500" />
                                        )}
                                    </div>
                                    <div className="text-sm">
                                        <div className="font-bold text-gray-700 dark:text-gray-300">{task.assignee?.name || "Unassigned"}</div>
                                        <div className="text-[10px] text-gray-400">Assignee</div>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-600'
                                    }`}>
                                    {task.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                    {task.status}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

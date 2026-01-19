"use client";

import { Card, CardContent } from "@/components/common/UIComponents";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ScheduleTask } from "@/lib/types";
import { format, parse } from "date-fns"; // parse for handling time string if needed, but time from DB is HH:MM:SS
import { Clock, User, Pencil, Trash2, CheckCircle, Circle, Timer } from "lucide-react";

interface TaskCardProps {
    task: ScheduleTask;
    onEdit: (task: ScheduleTask) => void;
    onDelete: (taskId: string) => void;
    onToggleStatus: (task: ScheduleTask) => void;
    isCurrentUser: boolean; // To control permissions
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus, isCurrentUser }: TaskCardProps) {
    // Format times from "HH:MM:SS" to "HH:MM AM/PM"
    // Since input is string, we might need to parse it relative to a date.
    // Or just simple string manipulation if we trust the format.
    // Better to use date-fns `parse` if we want to be robust.
    const formatTime = (timeStr: string) => {
        try {
            const date = parse(timeStr, 'HH:mm:ss', new Date());
            return format(date, 'hh:mm a');
        } catch (e) {
            return timeStr.slice(0, 5); // Fallback to HH:MM
        }
    };

    const isActive = task.status === 'IN_PROGRESS';

    return (
        <Card className={`mb-4 transition-all hover:shadow-md ${isActive ? 'border-l-4 border-l-teal-400' : ''}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">

                {/* Time and Status Section */}
                <div className="flex-shrink-0 min-w-[140px]">
                    <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                        <Clock className="w-4 h-4 mr-1.5 text-gray-500" />
                        {formatTime(task.start_time)} – {formatTime(task.end_time)}
                    </div>
                    <TaskStatusBadge status={task.status} />
                </div>

                {/* content Section */}
                <div className="flex-grow flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                            {task.assignee?.avatar_url ? (
                                <img src={task.assignee.avatar_url} alt={task.assignee.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
                                    {(task.assignee?.name?.charAt(0) || "U").toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow">
                        <h4 className={`text-base font-semibold ${task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                        </h4>
                        {task.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <button
                        onClick={() => onToggleStatus(task)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600 ring-2 ring-green-200' :
                            task.status === 'IN_PROGRESS' ? 'bg-teal-100 text-teal-600 ring-2 ring-teal-200' :
                                'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                        title="Toggle Status"
                    >
                        {task.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : task.status === 'IN_PROGRESS' ? (
                            <Timer className="w-5 h-5" />
                        ) : (
                            <Circle className="w-5 h-5" />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors hover:scale-105"
                        title="Edit Task"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors hover:scale-105"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}

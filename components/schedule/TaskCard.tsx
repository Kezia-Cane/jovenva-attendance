"use client";

import { Card, CardContent } from "@/components/common/UIComponents";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { ScheduleTask } from "@/lib/types";
import { format, parse } from "date-fns"; // parse for handling time string if needed, but time from DB is HH:MM:SS
import { Clock, User, Pencil, Trash2, CheckCircle } from "lucide-react";

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
        <Card className={`mb-4 transition-all hover:shadow-md ${isActive ? 'border-l-4 border-l-blue-500' : ''}`}>
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
                <div className="flex-grow">
                    <h4 className={`text-base font-semibold ${task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                    </h4>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {task.description}
                        </p>
                    )}
                    {/* Assignee - Placeholder if we don't have user details joined yet. 
             Ideally we'd have joined user data. For now, we might just show an icon or ID if no name available.
             Let's assume we might need to fetch or props pass assignee name. 
             If sticking to MVP, maybe just "Assigned" label or ignore if only viewing own.
          */}
                </div>

                {/* Actions Section */}
                <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                    <button
                        onClick={() => onToggleStatus(task)}
                        className={`p-2 rounded-full transition-colors ${task.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                        title="Toggle Completion"
                    >
                        <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        title="Edit Task"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

            </CardContent>
        </Card>
    );
}

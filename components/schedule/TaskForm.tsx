"use client";

import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { CreateTaskDTO, ScheduleTask } from "@/lib/types";
import { TypingIndicator } from "@/components/common/TypingIndicator";

interface TaskFormProps {
    initialData?: ScheduleTask; // If editing
    selectedDate: string; // YYYY-MM-DD
    userId: string;
    onSave: (data: CreateTaskDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

// Helper to detect if the task spans overnight (end time is earlier than start time)
function isOvernightShift(startTime: string, endTime: string): boolean {
    // Compare HH:MM format - if endTime is less than startTime, it's overnight
    return endTime < startTime;
}

// Helper to get the end date (next day if overnight)
function getEndDate(selectedDate: string, startTime: string, endTime: string): string {
    if (isOvernightShift(startTime, endTime)) {
        const nextDay = addDays(new Date(selectedDate), 1);
        return format(nextDay, 'yyyy-MM-dd');
    }
    return selectedDate;
}

export function TaskForm({ initialData, selectedDate, userId, onSave, onCancel, isLoading }: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [startTime, setStartTime] = useState(initialData?.start_time?.slice(0, 5) || "21:00");
    const [endTime, setEndTime] = useState(initialData?.end_time?.slice(0, 5) || "22:00");
    const [status, setStatus] = useState<ScheduleTask['status']>(initialData?.status || "PENDING");
    const [priority, setPriority] = useState<ScheduleTask['priority']>(initialData?.priority || "MEDIUM");
    const [error, setError] = useState("");

    // Detect overnight shift for UI feedback
    const isOvernight = isOvernightShift(startTime, endTime);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        // Calculate the correct end date for overnight tasks
        const endDate = getEndDate(selectedDate, startTime, endTime);

        try {
            await onSave({
                date: selectedDate,
                end_date: endDate, // New field for overnight support
                start_time: startTime + ":00", // Ensure HH:MM:SS format
                end_time: endTime + ":00",
                title,
                description,
                status,
                priority,
                assigned_to_user_id: userId // defaulting to current user for now
            });
        } catch (err) {
            // Parent should handle global errors, simplistic local error set here
            console.error(err);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        placeholder="Task title"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)} // inputs produce HH:MM
                            step="900" // 15 min steps
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            step="900"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                            required
                        />
                    </div>
                </div>

                {/* Overnight shift indicator */}
                {isOvernight && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span className="text-sm text-blue-700">
                            <strong>Overnight shift:</strong> This task ends the next day ({getEndDate(selectedDate, startTime, endTime)})
                        </span>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        placeholder="Optional description"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="BLOCKED">Blocked</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-md bg-teal-400 px-4 py-2 text-sm font-bold text-white hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 min-w-[100px] justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? <TypingIndicator /> : "Save Task"}
                </button>
            </div>
        </div>
    );
}

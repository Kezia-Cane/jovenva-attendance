"use client";

import { useState, useEffect } from "react";
// Assuming we might not have a UI Library dialog, I will build a simple modal overlay here or rely on the parent to wrap it in a Modal.
// Ideally, the "TaskForm" is just the form content, and the Page handles the Modal wrapper.
import { CreateTaskDTO, ScheduleTask } from "@/lib/types";

interface TaskFormProps {
    initialData?: ScheduleTask; // If editing
    selectedDate: string; // YYYY-MM-DD
    userId: string;
    onSave: (data: CreateTaskDTO) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function TaskForm({ initialData, selectedDate, userId, onSave, onCancel, isLoading }: TaskFormProps) {
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [startTime, setStartTime] = useState(initialData?.start_time || "09:00:00");
    const [endTime, setEndTime] = useState(initialData?.end_time || "10:00:00");
    const [status, setStatus] = useState<ScheduleTask['status']>(initialData?.status || "PENDING");
    const [priority, setPriority] = useState<ScheduleTask['priority']>(initialData?.priority || "MEDIUM");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (startTime >= endTime) {
            setError("Start time must be before end time");
            return;
        }

        try {
            await onSave({
                date: selectedDate,
                start_time: startTime, // potentially need to format or ensure HH:MM:SS
                end_time: endTime,
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Optional description"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as any)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Save Task"}
                </button>
            </div>
        </div>
    );
}

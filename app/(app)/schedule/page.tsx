"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase";
import { ScheduleTask, CreateTaskDTO, UpdateTaskDTO } from "@/lib/types";
import { DateSelector } from "@/components/schedule/DateSelector";
import { TaskCard } from "@/components/schedule/TaskCard";
import { TaskForm } from "@/components/schedule/TaskForm";
import { EmptyState } from "@/components/schedule/EmptyState";
import { Modal, ConfirmModal } from "@/components/common/Modal";
import { Plus } from "lucide-react";
// Import layout/sidebar/header if available or assume this is a page content.
// `app/schedule/page.tsx` will be rendered inside `app/layout.tsx`.
// But user requested "Daily Schedule sidebar widget on Dashboard", 
// and "Link to full schedule view from dashboard". 
// I am building the full schedule view now.
// I assume there is a Sidebar layout component I might need to wrap this in, 
// OR `app/layout.tsx` handles it.
// Looking at `app/layout.tsx` it only wraps children.
// Most likely there is a separate layout for authenticated pages or I need to import Sidebar here?
// But existing pages like `app/dashboard/...` probably have a layout.
// Let's assume standard page structure and just build the content.
// The user has `components/layout/Sidebar.tsx` potentially (I saw `components/layout` dir).
// I will not add Sidebar here explicitly unless I see it's required for every page individually.
// Usually `app/dashboard/layout.tsx` handles sidebar for dashboard routes.
// If `/schedule` is a new top level route, it might need a layout.
// I'll create `app/schedule/layout.tsx` effectively later if needed.
// For now, let's focus on the page logic.

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Modal States
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ScheduleTask | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const supabase = createClient();

    // Fetch User
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    // Fetch Tasks
    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                const dateStr = format(selectedDate, "yyyy-MM-dd");
                const res = await fetch(`/api/schedule/daily?date=${dateStr}&userId=${user.id}`);
                if (!res.ok) throw new Error("Failed to fetch tasks");
                const data = await res.json();
                setTasks(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, [selectedDate, user]);

    const handleCreateTask = () => {
        setEditingTask(undefined);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task: ScheduleTask) => {
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
        setIsDeleteModalOpen(true);
    };

    const saveTask = async (data: CreateTaskDTO | UpdateTaskDTO) => {
        setIsSaving(true);
        try {
            let res;
            if (editingTask) {
                res = await fetch(`/api/schedule/task/${editingTask.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } else {
                res = await fetch(`/api/schedule/task`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            }

            if (!res.ok) throw new Error("Failed to save task");

            // Refresh tasks
            const dateStr = format(selectedDate, "yyyy-MM-dd");
            const refreshRes = await fetch(`/api/schedule/daily?date=${dateStr}&userId=${user.id}`);
            const refreshedData = await refreshRes.json();
            setTasks(refreshedData);

            setIsTaskModalOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save task");
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            const res = await fetch(`/api/schedule/task/${taskToDelete}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error("Failed to delete task");

            // Optimistic update or refresh
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete task");
        }
    };

    const toggleStatus = async (task: ScheduleTask) => {
        // PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
        const nextStatus =
            task.status === 'PENDING' ? 'IN_PROGRESS' :
                task.status === 'IN_PROGRESS' ? 'COMPLETED' :
                    'PENDING';

        try {
            const res = await fetch(`/api/schedule/task/${task.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (!res.ok) throw new Error("Failed to update status");

            // Update local state
            setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus as any } : t));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Daily Schedule</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your daily tasks and time blocks.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    <button
                        onClick={handleCreateTask}
                        className="btn-3d btn-3d-teal w-fit"
                    >
                        <span className="btn-3d-shadow"></span>
                        <span className="btn-3d-edge"></span>
                        <span className="btn-3d-front gap-2 px-4 py-2">
                            <Plus className="h-4 w-4" />
                            <span className="text-sm font-bold">Create Task</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Task List */}
            <div className="w-full">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white rounded-2xl shadow-sm animate-pulse w-full"></div>
                        ))}
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="space-y-6 relative border-l-2 border-gray-200 ml-4 md:ml-6 pl-6 md:pl-8 py-2">
                        {/* Render Tasks */}
                        {tasks.map((task) => (
                            <div key={task.id} className="relative">
                                {/* Timeline dot */}
                                <div className={`absolute -left-[41px] md:-left-[49px] top-6 h-4 w-4 rounded-full border-2 border-white 
                                ${task.status === 'IN_PROGRESS' ? 'bg-teal-400 ring-4 ring-teal-100' : 'bg-gray-300'}
                            `} />
                                <TaskCard
                                    task={task}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteClick}
                                    onToggleStatus={toggleStatus}
                                    isCurrentUser={true}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState onCreateTask={handleCreateTask} />
                )}
            </div>

            {/* Modals */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title={editingTask ? "Edit Task" : "Create New Task"}
            >
                {user && (
                    <TaskForm
                        initialData={editingTask}
                        selectedDate={format(selectedDate, "yyyy-MM-dd")}
                        userId={user.id}
                        onSave={saveTask}
                        onCancel={() => setIsTaskModalOpen(false)}
                        isLoading={isSaving}
                    />
                )}
            </Modal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmLabel="Delete"
                variant="danger"
            />

        </div>
    );
}

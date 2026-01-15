import { ClipboardList } from "lucide-react";

interface EmptyStateProps {
    onCreateTask: () => void;
}

export function EmptyState({ onCreateTask }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <ClipboardList className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks scheduled</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">
                There are no tasks scheduled for this day. Get started by planning your day.
            </p>
            <button
                onClick={onCreateTask}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-9 px-4 py-2"
            >
                Create Task
            </button>
        </div>
    );
}

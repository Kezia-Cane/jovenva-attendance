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
            <p className="text-sm text-gray-500 max-w-sm">
                There are no tasks scheduled for this day. Get started by planning your day.
            </p>
        </div>
    );
}

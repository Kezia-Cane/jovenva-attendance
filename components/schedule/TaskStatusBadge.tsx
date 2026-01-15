import { Badge } from "@/components/common/UIComponents";
import { ScheduleTask } from "@/lib/types";

interface TaskStatusBadgeProps {
    status: ScheduleTask['status'];
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
    let variant: "default" | "success" | "warning" | "error" = "default";
    let label = status;

    switch (status) {
        case 'COMPLETED':
            variant = 'success';
            break;
        case 'IN_PROGRESS':
            variant = 'default'; // Or a specific blue style if I add it to Badge component, but existing Badge has 'default' as gray. 
            // The prompt asked for "Blue background" for IN_PROGRESS.
            // Existing Badge variants: default (gray), success (green), warning (amber), error (red).
            // I might need to add a 'blue' variant or just use 'default' for pending and something else for in_progress.
            // Let's stick to existing variants for now and maybe override styles if strictly needed, 
            // or map as best as possible.
            // PENDING -> Gray (default)
            // IN_PROGRESS -> Blue (Let's use a custom class or add a variant if I could edit UIComponents, but I'll stick to inline override or map to 'default' for now and maybe 'warning' for BLOCKED).
            // Actually, let's look at UIComponents again.
            // default: gray-900 bg-gray-50 (wait, text-gray-50 bg-gray-900? No, bg-gray-900 text-gray-50 is dark).
            // Let's check the code I read earlier.
            // "border-transparent bg-gray-900 text-gray-50": variant === "default"
            // So default is dark gray.
            // The prompt wants:
            // PENDING: Gray background, gray text (default state)
            // IN_PROGRESS: Blue background, blue text
            // COMPLETED: Green background, green text
            // BLOCKED: Orange background, orange text
            // existing Badge doesn't perfectly match "Gray background, gray text" if it's "bg-gray-900 text-gray-50" (that's black bg, white text).
            // I might create a simpler local badge or just style it here.
            break;
        case 'BLOCKED':
            variant = 'warning';
            break;
        case 'PENDING':
        default:
            variant = 'default';
            break;
    }

    // To strictly follow the design requirements (colors), I should probably apply specific classNames
    // instead of relying solely on the shared Badge variants if they don't match.
    // PENDING
    if (status === 'PENDING') {
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                PENDING
            </span>
        )
    }
    // IN_PROGRESS
    if (status === 'IN_PROGRESS') {
        return (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                IN_PROGRESS
            </span>
        )
    }
    // COMPLETED
    if (status === 'COMPLETED') {
        return (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                COMPLETED
            </span>
        )
    }
    // BLOCKED
    if (status === 'BLOCKED') {
        return (
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
                BLOCKED
            </span>
        )
    }

    return (
        <Badge variant={variant}>{label}</Badge>
    );
}

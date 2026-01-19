export interface ScheduleTask {
    id: string;
    user_id: string;
    assigned_to_user_id: string;
    date: string; // YYYY-MM-DD
    start_time: string; // HH:MM:SS
    end_time: string; // HH:MM:SS
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    tags?: string[];
    created_at: string;
    updated_at: string;
    assignee?: {
        name: string;
        avatar_url: string | null;
    };
}

export interface CreateTaskDTO {
    assigned_to_user_id?: string; // Optional, defaults to current user if not provided
    date: string;
    start_time: string;
    end_time: string;
    title: string;
    description?: string;
    status?: ScheduleTask['status'];
    priority?: ScheduleTask['priority'];
    tags?: string[];
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> { }

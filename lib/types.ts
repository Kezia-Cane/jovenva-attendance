export interface ScheduleTask {
    id: string;
    user_id: string;
    assigned_to_user_id: string;
    date: string; // YYYY-MM-DD (start date)
    end_date: string; // YYYY-MM-DD (end date, may be next day for overnight tasks)
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
        role?: 'ADMIN' | 'EMPLOYEE';
    };
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url: string | null;
    role: 'ADMIN' | 'EMPLOYEE';
    created_at: string;
}

export interface CreateTaskDTO {
    assigned_to_user_id?: string; // Optional, defaults to current user if not provided
    date: string;
    end_date?: string; // Optional, defaults to same as date for same-day tasks
    start_time: string;
    end_time: string;
    title: string;
    description?: string;
    status?: ScheduleTask['status'];
    priority?: ScheduleTask['priority'];
    tags?: string[];
}

export interface UpdateTaskDTO extends Partial<CreateTaskDTO> { }

import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CreateTaskDTO } from '@/lib/types';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, end_date, start_time, end_time, title, description, priority, status, assigned_to_user_id } = body as CreateTaskDTO;

        // Basic Validation
        if (!date || !start_time || !end_time || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // For overnight tasks, end_date will be the next day
        // No longer block when end_time < start_time (overnight shifts like 9pm-1am)
        const finalEndDate = end_date || date; // Default to same day if not provided

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Get current user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Prepare task object
        const newTask = {
            user_id: user.id, // Creator
            assigned_to_user_id: assigned_to_user_id || user.id, // Assignee (default to creator)
            date,
            end_date: finalEndDate, // Support overnight tasks
            start_time,
            end_time,
            title,
            description,
            status: status || 'PENDING',
            priority: priority || 'MEDIUM',
            tags: [], // Optional
        };

        const { data, error } = await supabase
            .from('schedule_tasks')
            .insert(newTask)
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

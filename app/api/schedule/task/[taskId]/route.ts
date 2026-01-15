import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { UpdateTaskDTO } from '@/lib/types';

export async function PATCH(request: Request, props: { params: Promise<{ taskId: string }> }) {
    const params = await props.params;
    try {
        const taskId = params.taskId;
        const body = await request.json();
        const updates = body as UpdateTaskDTO;

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only allow updating certain fields for now
        // And relying on RLS to ensure user owns/is assigned to task
        const { data, error } = await supabase
            .from('schedule_tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ taskId: string }> }) {
    const params = await props.params;
    try {
        const taskId = params.taskId;

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RLS should handle permission checks (only creator can delete)
        const { error } = await supabase
            .from('schedule_tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Error deleting task:', error);
            return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

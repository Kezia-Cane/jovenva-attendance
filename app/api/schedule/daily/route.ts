import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const userId = searchParams.get('userId');

        if (!date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        // Get current user for auth check
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let query = supabase
            .from('schedule_tasks')
            .select('*')
            .eq('date', date)
            .order('start_time', { ascending: true });

        // Show all tasks for the date, regardless of assignee
        // const targetUserId = userId || user.id; 
        // query = query.eq('assigned_to_user_id', targetUserId);

        const { data: tasks, error } = await query;

        if (error) {
            console.error('Error fetching tasks:', error);
            return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
        }

        // Manually fetch assignee details to avoid ambiguous foreign key issues with joins
        const userIds = Array.from(new Set(tasks.map((t: any) => t.assigned_to_user_id)));

        if (userIds.length > 0) {
            const { data: users } = await supabase
                .from('users')
                .select('id, name, avatar_url')
                .in('id', userIds);

            const userMap = new Map(users?.map((u: any) => [u.id, u]) || []);

            const tasksWithAssignee = tasks.map((t: any) => ({
                ...t,
                assignee: userMap.get(t.assigned_to_user_id) || { name: 'Unknown', avatar_url: null }
            }));

            return NextResponse.json(tasksWithAssignee);
        }

        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

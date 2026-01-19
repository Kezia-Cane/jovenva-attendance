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
            .select('*, assignee:users(name, avatar_url)')
            .eq('date', date)
            .order('start_time', { ascending: true });

        // If userId is provided, filter by assigned_to_user_id
        // If not, maybe showing all? The prompt implied "View other team members' daily schedules" is a future feature (v2)
        // but also said "Team Member: Views their assigned tasks".
        // Let's default to showing tasks for the qualified user if userId is not specified, 
        // OR if we want to allow viewing others, we just filter by the requested userId.
        // The RLS policy "Users can view their own tasks" (auth.uid() = user_id OR auth.uid() = assigned_to_user_id) 
        // might block viewing others unless we relax it or the user is viewing themselves.
        // For v1, let's assume we filter by the requested userId or the current user.

        const targetUserId = userId || user.id;
        query = query.eq('assigned_to_user_id', targetUserId);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching tasks:', error);
            return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

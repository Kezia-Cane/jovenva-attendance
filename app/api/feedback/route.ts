import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { message } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('feedbacks')
            .insert([
                {
                    user_id: user.id,
                    message: message.trim(),
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error inserting feedback:', error);
            return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error in feedback API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

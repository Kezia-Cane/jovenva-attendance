import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { format } from 'date-fns'

export async function POST() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = format(new Date(), 'yyyy-MM-dd')

    // 1. Check if checked in today
    const { data: record } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

    if (!record) {
        return NextResponse.json({ error: 'Not checked in today' }, { status: 400 })
    }

    if (record.check_out_time) {
        return NextResponse.json({ error: 'Already checked out today' }, { status: 400 })
    }

    // 2. Update Check-out Time
    const { data, error } = await supabase
        .from('attendance')
        .update({
            check_out_time: new Date().toISOString()
        })
        .eq('id', record.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

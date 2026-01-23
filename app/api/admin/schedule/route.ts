
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check Role
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData?.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    let query = supabase
        .from('schedule_tasks')
        .select(`
            *,
            assignee:get_user_profile(assigned_to_user_id)
        `)
        .order('date', { ascending: true })

    // Note: 'assignee' link depends on how the relationship is defined. 
    // If 'assigned_to_user_id' is FK to 'users', we can use select('*, assignee:users!assigned_to_user_id(name, avatar_url)')
    // I'll try the standard foreign key join first.

    // Let's refine the query to be safer
    // Try to join with users on assigned_to_user_id

    const { data, error } = await supabase
        .from('schedule_tasks')
        .select(`
            *,
            assignee:users!assigned_to_user_id(name, email, avatar_url)
        `)
        .order('date', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}


import { createClient } from "@/lib/supabase-server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check Role
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData?.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    // Use Admin client to bypass RLS
    const { data, error } = await getSupabaseAdmin()
        .from('feedbacks')
        .select('*, users(name, email, avatar_url)')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}

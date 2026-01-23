
import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check Auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Check Role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (userData?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch All Users
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(users)
}

export async function PATCH(request: Request) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Check Auth & Role (Admin Only)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userData?.role !== 'ADMIN') return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const { id, role } = body

    if (!id || !role) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}

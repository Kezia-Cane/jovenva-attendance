import { createClient } from '@supabase/supabase-js'

// WARNING: This client bypasses Row Level Security. Use only in server-side admin contexts.
// Do not expose this client or the service role key to the client-side.
export const getSupabaseAdmin = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Supabase Admin Client: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey)
}

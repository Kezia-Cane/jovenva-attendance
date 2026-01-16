import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getShiftDate } from '@/lib/date-utils'

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Authenticate User
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1.5. Ensure User exists in public.users (Self-healing)
  // This fixes the "foreign key violation" if the trigger failed or IDs mismatch
  const { error: upsertError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatar_url: user.user_metadata?.avatar_url || '',
      updated_at: new Date().toISOString(),
    })

  if (upsertError) {
    console.error("Error syncing user profile:", upsertError)
    return NextResponse.json({ error: `User sync failed: ${upsertError.message}` }, { status: 500 })
  }

  // 2. Check if already checked in today (Shift Date)
  const today = getShiftDate()

  const { data: existingAttendance } = await supabase
    .from('attendance')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  if (existingAttendance) {
    return NextResponse.json({ error: 'Already checked in today' }, { status: 400 })
  }

  // 3. Create Check-in Record
  const { data, error } = await supabase
    .from('attendance')
    .insert({
      user_id: user.id,
      date: today,
      check_in_time: new Date().toISOString(),
      status: 'PRESENT'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

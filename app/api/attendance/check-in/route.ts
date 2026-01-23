import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getShiftDate, getManilaTime } from '@/lib/date-utils'

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
  let today = getShiftDate()
  const manilaTime = getManilaTime()
  const day = manilaTime.getDay()
  const hour = manilaTime.getHours()

  // STRICTLY FOR WEEKENDS (Saturday/Sunday)
  // Logic: 
  // - If it's Saturday or Sunday AND time is between 6:00 AM and 11:59 AM.
  // - Normally getShiftDate() considers 00:00-11:59 as "Yesterday's Shift".
  // - BUT for weekends, we want 6 AM onwards to be "Today's Extra Workout".
  // - So we override 'today' to be the current actual date.

  const isWeekendMorning = (day === 0 || day === 6) && (hour >= 6 && hour < 12)

  if (isWeekendMorning) {
    // Override to current date string "YYYY-MM-DD"
    today = manilaTime.toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }) // en-CA gives YYYY-MM-DD
  }

  // Determine if this is a weekend check-in based on the FINAL 'today' date
  const shiftDateObj = new Date(today)
  const dayOfWeek = shiftDateObj.getUTCDay() // "YYYY-MM-DD" parses to UTC midnight
  const isWeekendCheckIn = dayOfWeek === 0 || dayOfWeek === 6

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
      status: isWeekendCheckIn ? 'EXTRA_WORKOUT' : 'PRESENT'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

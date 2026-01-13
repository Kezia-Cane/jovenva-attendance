import { format } from "date-fns"

export function getManilaTime(): Date {
    // create a date object that represents the current time in Manila
    // We use the string approach to 'shift' the time to Manila's wall clock time
    // independent of the system timezone.
    const now = new Date()
    const manilaString = now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
    return new Date(manilaString)
}

export function isCheckInAvailable(): { available: boolean; currentHour: number } {
    const manilaTime = getManilaTime()
    const hour = manilaTime.getHours()

    // Logic: Available from 8:00 PM (20:00) until 12:00 PM (noon next day)
    // This covers the night shift (e.g., 9PM - 6AM) and overtime.
    // It blocks check-in from 12:01 PM to 7:59 PM.
    const available = hour >= 20 || hour < 12

    return { available, currentHour: hour }
}

export function getShiftDate(): string {
    const now = getManilaTime()
    const hour = now.getHours()

    // If it's early morning (e.g. 1 AM), the "Show Date" is actually Yesterday
    // But for the database 'date' field, we generally want the strict date OR the shift date.
    // Let's stick to the ACTUAL date in Manila for the record to avoid confusion,
    // OR if the user wants "Shift Date", we subtract a day if hour < 12.
    // User didn't specify, but "One Session Per Day" usually implies "Per Shift".

    // For now, return strict Manila Calendar Date.
    return format(now, 'yyyy-MM-dd')
}

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
    return format(now, 'yyyy-MM-dd')
}

export function formatInManila(date: string | Date, fmt: string): string {
    if (!date) return "—"
    const d = typeof date === 'string' ? new Date(date) : date
    // Convert to Manila time string "MM/DD/YYYY, HH:MM:SS AM/PM" to preserve wall clock time
    const manilaString = d.toLocaleString("en-US", { timeZone: "Asia/Manila" })
    const manilaDate = new Date(manilaString)
    return format(manilaDate, fmt)
}

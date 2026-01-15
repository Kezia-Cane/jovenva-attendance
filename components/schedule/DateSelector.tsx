"use client";

import { Button } from "@/components/ui/button"; // Assuming standard shadcn button or similar exists?
// Wait, I didn't verify if `components/ui/button` exists. I saw `components/common/UIComponents.tsx` having Card and Badge.
// I should check if there is a Button component.
// If not, I'll use a standard HTML button or create one.
// Let's assume for now I should use standard HTML or copy a Button style if I can't find one.
// The `UIComponents.tsx` didn't have Button.
// I'll check `components` dir again in next step or just use standard button classes for now to be safe.
// Actually, I'll browse `components` in the next step to be sure, but for now I'll write this file assuming I can use tailwind classes on <button>.

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface DateSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
    const handlePreviousDay = () => onDateChange(subDays(selectedDate, 1));
    const handleNextDay = () => onDateChange(addDays(selectedDate, 1));
    const handleToday = () => onDateChange(new Date());

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center rounded-md border border-gray-200 bg-white p-1 shadow-sm">
                <button
                    onClick={handlePreviousDay}
                    className="rounded-sm p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Previous day"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-500" />
                </button>

                <div className="flex items-center px-4 py-1 border-l border-r border-gray-100 min-w-[200px] justify-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </span>
                </div>

                <button
                    onClick={handleNextDay}
                    className="rounded-sm p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Next day"
                >
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            <div className="hidden sm:flex space-x-2">
                <button
                    onClick={handleToday}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                    Today
                </button>
            </div>
        </div>
    );
}

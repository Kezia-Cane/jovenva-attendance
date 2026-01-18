"use client";


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
                    className="text-sm font-medium text-gray-600 hover:text-teal-600 px-3 py-1 rounded-md hover:bg-teal-50 transition-colors"
                >
                    Today
                </button>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Palette, Globe, Moon, Sun, Monitor } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

const TIMEZONES = [
    { value: "Asia/Manila", label: "Manila (GMT+8)" },
    { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
    { value: "Asia/Shanghai", label: "Shanghai (GMT+8)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

export function PreferenceSettings() {
    const [theme, setTheme] = useState<ThemeMode>("light");
    const [timezone, setTimezone] = useState("Asia/Manila");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load saved preferences from localStorage
        const savedTheme = localStorage.getItem("theme") as ThemeMode;
        const savedTimezone = localStorage.getItem("timezone");

        if (savedTheme) setTheme(savedTheme);
        if (savedTimezone) setTimezone(savedTimezone);
    }, []);

    const handleThemeChange = (newTheme: ThemeMode) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        // Apply theme to document
        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else if (newTheme === "light") {
            document.documentElement.classList.remove("dark");
        } else {
            // System preference
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    };

    const handleTimezoneChange = (newTimezone: string) => {
        setTimezone(newTimezone);
        localStorage.setItem("timezone", newTimezone);
    };

    if (!isMounted) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400 text-white shadow-md">
                    <Palette size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Preferences</h2>
            </div>

            <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Appearance
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => handleThemeChange("light")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "light"
                                    ? "border-teal-300 bg-teal-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Sun className={`h-6 w-6 ${theme === "light" ? "text-teal-500" : "text-gray-400"}`} />
                            <span className={`text-sm font-medium ${theme === "light" ? "text-teal-600" : "text-gray-600"}`}>
                                Light
                            </span>
                        </button>

                        <button
                            onClick={() => handleThemeChange("dark")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "dark"
                                    ? "border-teal-300 bg-teal-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Moon className={`h-6 w-6 ${theme === "dark" ? "text-teal-500" : "text-gray-400"}`} />
                            <span className={`text-sm font-medium ${theme === "dark" ? "text-teal-600" : "text-gray-600"}`}>
                                Dark
                            </span>
                        </button>

                        <button
                            onClick={() => handleThemeChange("system")}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === "system"
                                    ? "border-teal-300 bg-teal-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <Monitor className={`h-6 w-6 ${theme === "system" ? "text-teal-500" : "text-gray-400"}`} />
                            <span className={`text-sm font-medium ${theme === "system" ? "text-teal-600" : "text-gray-600"}`}>
                                System
                            </span>
                        </button>
                    </div>
                </div>

                {/* Timezone Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span>Timezone</span>
                        </div>
                    </label>
                    <select
                        value={timezone}
                        onChange={(e) => handleTimezoneChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100 outline-none transition-all bg-white appearance-none cursor-pointer"
                    >
                        {TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                        Used for displaying times in your local timezone
                    </p>
                </div>
            </div>
        </div>
    );
}

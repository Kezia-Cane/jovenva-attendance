
"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import { useTheme } from "next-themes"

interface AttendanceChartData {
    date: string;
    count: number;
}

interface LatenessChartData {
    name: string;
    value: number;
    color: string;
}

export function AttendanceAreaChart({ data }: { data: AttendanceChartData[] }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4FD1C5" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4FD1C5" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#374151" : "#E5E7EB"} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: isDark ? "#9CA3AF" : "#6B7280", fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                        }}
                        itemStyle={{ color: isDark ? "#E5E7EB" : "#111827" }}
                        labelStyle={{ color: isDark ? "#9CA3AF" : "#6B7280", marginBottom: "4px" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#38B2AC"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export function LatenessPieChart({ data }: { data: LatenessChartData[] }) {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

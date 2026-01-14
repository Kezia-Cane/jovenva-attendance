import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../common/UIComponents"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    subtext?: string
    status?: "success" | "warning" | "danger" | "neutral"
}

export function StatCard({ title, value, icon: Icon, subtext, status = "neutral" }: StatCardProps) {
    return (
        <Card className="border-none shadow-md rounded-2xl">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-bold text-gray-800">{value}</h3>
                        {subtext && (
                            <span className={`text-xs font-bold ${status === "success" ? "text-green-500" :
                                status === "warning" ? "text-orange-500" :
                                    status === "danger" ? "text-red-500" : "text-gray-500"
                                }`}>
                                {subtext}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-300 text-white shadow-[0px_3.5px_5.5px_0px_rgba(0,0,0,0.02)]">
                    <Icon size={22} color="white" />
                </div>
            </CardContent>
        </Card>
    )
}

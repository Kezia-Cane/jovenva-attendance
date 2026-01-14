import { Card, CardContent } from "@/components/common/UIComponents"
import { CheckCircle, MoreHorizontal } from "lucide-react"

export function SystemStatus() {
    return (
        <Card className="border-none shadow-md rounded-2xl h-full">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-gray-800">System Status</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="bg-green-50 rounded-xl p-4 flex gap-3 items-start">
                            <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                            <div>
                                <p className="text-sm font-bold text-gray-800">Check-in successful for today at 09:00 AM</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

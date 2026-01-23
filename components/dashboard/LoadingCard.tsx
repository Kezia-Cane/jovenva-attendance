import { Card, CardContent } from "@/components/common/UIComponents"
import { TypingIndicator } from "@/components/common/TypingIndicator"

export function LoadingCard({ height = "h-fit" }: { height?: string }) {
    return (
        <Card className={`border-none shadow-md rounded-2xl bg-card ${height}`}>
            <CardContent className="p-6 flex items-center justify-center h-full min-h-[200px] text-gray-400">
                <TypingIndicator className="scale-100" />
            </CardContent>
        </Card>
    )
}

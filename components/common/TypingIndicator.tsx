interface TypingIndicatorProps {
    className?: string
}

export function TypingIndicator({ className = "scale-50" }: TypingIndicatorProps) {
    return (
        <div className={`typing-indicator ${className}`}>
            {/* Default scale-50 for buttons, override for other uses */}
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
        </div>
    )
}

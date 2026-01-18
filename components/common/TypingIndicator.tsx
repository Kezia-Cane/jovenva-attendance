export function TypingIndicator() {
    return (
        <div className="typing-indicator scale-50">
            {/* scale-50 because original 60px height is too big for a button text line */}
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-circle"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
            <div className="typing-shadow"></div>
        </div>
    )
}

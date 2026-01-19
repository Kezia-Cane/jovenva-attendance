"use client";

import React, { useEffect, useState } from "react";

// Colors from user request
const COLORS = ["#3b5692", "#f9c70b", "#00abed", "#ea6747"];

interface ConfettiItem {
    id: number;
    scale: number;
    angle: number;
    duration: number;
    delay: number;
    color: string;
    left: number; // 0-100vw
}

export function Confetti() {
    const [items, setItems] = useState<ConfettiItem[]>([]);

    useEffect(() => {
        // Generate 100 items
        const newItems: ConfettiItem[] = [];
        for (let i = 0; i < 100; i++) {
            const height = 6.6;
            const width = 6.6;
            const scale = Math.random() * 1.75 + 1;

            newItems.push({
                id: i,
                scale: scale,
                angle: Math.random() * 360,
                duration: Math.random() + 2, // 2 to 3s
                delay: Math.random() * 2, // 0 to 2s
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                left: Math.random() * 100
            });
        }
        setItems(newItems);
    }, []);

    return (
        <div className="confetti-container fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {/* Define the symbol once */}
            <svg className="hidden">
                <defs>
                    <symbol id="svg-confetti" viewBox="0 0 6.6 6.6">
                        <path fill="currentColor" d="M-.017 6.91L4.035.012l2.587 1.52L2.57 8.43z"></path>
                    </symbol>
                </defs>
            </svg>

            {/* Render items */}
            {items.map((item) => {
                const width = 6.6 * item.scale;
                const height = 6.6 * item.scale;

                return (
                    <svg
                        key={item.id}
                        className="confetti-item absolute top-0"
                        width={width}
                        height={height}
                        viewBox={`0 0 ${6.6} ${6.6}`} // Original viewBox of symbol is implicitly small, but symbol has path. 
                        // Wait, user code used `viewbox='0 0 width height'` but `use` href.
                        // The symbol itself has its own shape.
                        // Let's use the style directly.
                        style={{
                            left: `${item.left}vw`,
                            color: item.color,
                            transform: `translate3d(0,0,0)`, // Reset for animation to handle
                            animation: `confetti-fall ${item.duration}s ${item.delay}s ease-in both`,
                        }}
                    >
                        <use
                            href="#svg-confetti"
                            transform={`rotate(${item.angle} ${6.6 / 2} ${6.6 / 2})`} // Rotate around center of the SVG viewbox (approx, or just center)
                        // Actually the user code: `transform='rotate(" + Math.random() * 360 + ", " + width / 2 + ", " + height / 2 + ")'`
                        // But here width/height are scaled. 
                        // Let's keep it simple.
                        />
                    </svg>
                )
            })}

            <style jsx global>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%);
          }
          95% {
            animation-timing-function: ease-in-out;
            transform: translateY(calc(100vh - 55%));
          }
          100% {
            transform: translateY(calc(150vh - 65%));
          }
        }
      `}</style>
        </div>
    );
}

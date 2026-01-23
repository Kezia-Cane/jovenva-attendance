"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/common/Confetti";
import { Modal } from "@/components/common/Modal";

export function AnnouncementModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check session storage
        const hasSeen = sessionStorage.getItem("jovenva_announcement_seen");
        if (!hasSeen) {
            setIsOpen(true);
            sessionStorage.setItem("jovenva_announcement_seen", "true");
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            {isOpen && <Confetti />}
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="📢 Announcement"
                className="max-w-4xl z-[70] relative"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Content */}
                    <div className="flex flex-col justify-between h-full">
                        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p className="font-semibold text-lg text-foreground">
                                Today marks the pre-launch of the JovenVA Internal System.
                            </p>

                            <p>The following modules are now available for testing:</p>

                            <ul className="list-disc pl-5 space-y-1 mb-4">
                                <li><strong>Attendance Module</strong> (Check-in and Check-out)</li>
                                <li><strong>Task Management Module</strong> for daily scheduling</li>
                            </ul>

                            <p className="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                This is an early release, and your feedback is highly appreciated to help us improve and refine the system.
                            </p>

                            <div className="pt-2">
                                <p>Thank you for your support as we continue to enhance JovenVA’s internal tools.</p>
                                <p className="font-bold mt-2 text-teal-600">— JovenVA Dev Team</p>
                            </div>
                        </div>

                        <div className="mt-8 flex md:justify-start justify-center">
                            <button
                                onClick={handleClose}
                                className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-8 rounded-lg shadow-md transition-colors w-full md:w-auto shadow-teal-300/30"
                            >
                                Start Testing
                            </button>
                        </div>
                    </div>

                    {/* Right Column: GIF */}
                    <div className="hidden md:flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-600 h-full min-h-[350px]">
                        <img
                            src="/meldance.gif"
                            alt="JovenVA Celebration"
                            className="w-full h-full object-contain rounded-xl mix-blend-multiply"
                        />
                        {/* mix-blend-multiply helps if gif has white bg and container is gray-50, but usually safe to omit if gif is transparent or full rect. 
                             I'll stick to object-contain. 
                          */}
                    </div>
                </div>
            </Modal>
        </>
    );
}

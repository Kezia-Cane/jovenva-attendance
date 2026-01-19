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
                className="max-w-lg z-[70] relative" // Ensure above confetti if needed, but Modal has fixed z-50. Confetti is z-60. 
            // Actually Modal overlay is z-50.
            // If Confetti is z-60, it will be ON TOP of the modal overlay but maybe behind modal content if modal content is z-??
            // Confetti should probably be BEHIND the modal content?
            // User said "modal announcement with blur in the back ground".
            // My Modal component handles blur.
            // If Confetti is "fixed inset-0 pointer-events-none", it covers everything.
            // I want Confetti to fall "around" or "over" the screen.
            // Let's let it fall over everything like a celebration.
            >
                <div>

                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p className="font-semibold text-lg text-gray-900">
                            Today marks the pre-launch of the JovenVA Internal System.
                        </p>

                        <p>The following modules are now available for testing:</p>

                        <ul className="list-disc pl-5 space-y-1 mb-4">
                            <li><strong>Attendance Module</strong> (Check-in and Check-out)</li>
                            <li><strong>Task Management Module</strong> for daily scheduling</li>
                        </ul>

                        <p className="text-sm italic text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            This is an early release, and your feedback is highly appreciated to help us improve and refine the system.
                        </p>

                        <div className="pt-2">
                            <p>Thank you for your support as we continue to enhance JovenVA’s internal tools.</p>
                            <p className="font-bold mt-2 text-teal-600">— JovenVA Dev Team</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleClose}
                            className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                        >
                            Start Testing
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

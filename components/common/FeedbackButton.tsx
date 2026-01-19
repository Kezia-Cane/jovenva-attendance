"use client";

import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { Modal } from "@/components/common/Modal";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      setIsOpen(false);
      setMessage("");
      alert("Thank you! Your feedback has been submitted.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="w-full clean-feedback-btn group relative flex items-center justify-center gap-2 px-3 py-3 bg-white text-teal-600 border-2 border-teal-100 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:border-teal-200 hover:bg-teal-50 transition-all"
      >
        <span className="icon-wrapper">
          <MessageSquarePlus size={18} className="text-teal-500" />
        </span>
        <span>Feedback</span>

        {/* Shine effect container */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-shine" />
        </div>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Send Feedback"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            We value your feedback! Let us know what you think or report any issues.
            This will open your email client to send the message.
          </p>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your feedback here..."
            className="w-full h-32 p-3 rounded-lg border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none resize-none text-gray-700 placeholder:text-gray-400"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="px-6 py-2 text-sm font-bold text-white bg-teal-400 hover:bg-teal-500 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
            .clean-feedback-btn {
            animation: infinite-float 3s ease-in-out infinite;
            transform-origin: center center;
            }

            .clean-feedback-btn:hover {
            animation: shake 0.5s ease-in-out infinite;
            }

            @keyframes infinite-float {
            0% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(-2px) rotate(1deg);
            }
            100% {
                transform: translateY(0) rotate(0deg);
            }
            }

            @keyframes shake {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-2deg); }
            75% { transform: rotate(2deg); }
            100% { transform: rotate(0deg); }
            }
            
            @keyframes shine {
                0% { left: -100%; }
                20% { left: 200%; }
                100% { left: 200%; }
            }
            
            .animate-shine {
                animation: shine 4s ease-in-out infinite;
            }
            
            .group:hover .icon-wrapper {
                animation: bounce-icon 1s infinite;
            }
            
            @keyframes bounce-icon {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-2px); }
            }
        `}</style>
    </>
  );
}

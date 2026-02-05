"use client";

import { useEffect, useState } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        // Enter animation
        const enterTimeout = setTimeout(() => setIsVisible(true), 10);

        // Exit timer
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(timer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setIsVisible(false);
        setTimeout(onClose, 400); // Wait for animation to finish
    };

    return (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-4 p-5 pr-8 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-500 ease-out transform ${isVisible && !isLeaving
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}>
            {/* Icon Ring */}
            <div className={`relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${type === "success" ? "bg-green-50" : "bg-red-50"
                }`}>
                {/* Ping Animation */}
                {type === "success" && (
                    <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
                )}

                {type === "success" ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col">
                <h4 className={`text-sm font-bold ${type === "success" ? "text-gray-900" : "text-gray-900"}`}>
                    {type === "success" ? "Success" : "Error"}
                </h4>
                <p className="text-sm text-gray-500 font-medium">
                    {message}
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-1 text-gray-300 hover:text-gray-500 transition-colors"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Progress/Border Bottom */}
            <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full overflow-hidden ${type === "success" ? "bg-green-100" : "bg-red-100"
                }`}>
                <div
                    className={`h-full w-full origin-left ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
                    style={{
                        animation: `linear-crash ${duration}ms linear forwards`
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes linear-crash {
                    0% { transform: scaleX(1); }
                    100% { transform: scaleX(0); }
                }
            `}</style>
        </div>
    );
}

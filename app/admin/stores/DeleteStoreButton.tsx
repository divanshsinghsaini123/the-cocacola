"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteStoreButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch("/api/admin/stores", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to delete");
            } else {
                setShowConfirm(false);
                router.refresh(); // Refresh the page to show updated list
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setShowConfirm(true);
                }}
                disabled={isDeleting}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all z-20 outline-none"
                type="button"
                title="Delete Store"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            </button>

            {/* Custom Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl ring-1 ring-black/5 scale-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1 pt-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-none">Delete Store</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete this store? This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowConfirm(false);
                                }}
                                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete It"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

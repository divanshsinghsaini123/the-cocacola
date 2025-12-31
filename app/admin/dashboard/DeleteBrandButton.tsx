"use client";

import { useState } from "react";
import { deleteBrand } from "./actions";

export default function DeleteBrandButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this brand? All associated products will also be deleted.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await deleteBrand(id);
            if (!res.success) {
                alert(res.error || "Failed to delete");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-600 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10 disabled:opacity-50"
            type="button"
            title="Delete Brand"
        >
            {isDeleting ? (
                <span className="block w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
            )}
        </button>
    );
}

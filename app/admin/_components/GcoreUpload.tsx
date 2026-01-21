"use client";

import { useState, useRef } from "react";

interface GcoreUploadProps {
    folder: string;
    onSuccess: (url: string) => void;
    children: (args: { open: () => void; isLoading: boolean }) => React.ReactNode;
    multiple?: boolean;
    className?: string;
    maxSizeMB?: number; // Added optional prop
}

export default function GcoreUpload({
    folder,
    onSuccess,
    children,
    multiple = false,
    maxSizeMB = 5 // Default to 5MB
}: GcoreUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const open = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Check file sizes
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSizeMB * 1024 * 1024) {
                alert(`File "${files[i].name}" exceeds the ${maxSizeMB}MB limit.`);
                if (inputRef.current) inputRef.current.value = "";
                return;
            }
        }

        setIsLoading(true);
        try {
            // Iterate over selected files and upload them
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", folder);

                const res = await fetch("/api/admin/gcore_upload", {
                    method: "PUT",
                    body: formData,
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Upload failed for file: ${file.name}`);
                }

                const data = await res.json();

                if (data.url) {
                    onSuccess(data.url);
                } else {
                    console.error("No URL returned from upload API");
                }
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload image. Please try again.");
        } finally {
            setIsLoading(false);
            if (inputRef.current) {
                inputRef.current.value = ""; // Reset input
            }
        }
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/*" // Restrict to images for now as used in BrandForm
                multiple={multiple}
                onChange={handleFileChange}
            />
            {children({ open, isLoading })}
        </>
    );
}

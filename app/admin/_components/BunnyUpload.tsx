"use client";

import { useState, useRef } from "react";

interface BunnyUploadProps {
    folder: string;
    onSuccess: (url: string) => void;
    children: (args: { open: () => void; isLoading: boolean }) => React.ReactNode;
    multiple?: boolean;
    className?: string;
}

export default function BunnyUpload({
    folder,
    onSuccess,
    children,
    multiple = false
}: BunnyUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const open = () => {
        inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        try {
            // Iterate over selected files and upload them
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", folder);

                const res = await fetch("/api/admin/bunny_upload", {
                    method: "PUT",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Upload failed for file: ${file.name}`);
                }

                const data = await res.json();

                if (data.url) {
                    onSuccess(data.url);
                } else {
                    console.error("No URL returned from upload API");
                }
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image. Please try again.");
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

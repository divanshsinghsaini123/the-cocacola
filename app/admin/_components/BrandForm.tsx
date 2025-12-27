"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface BrandFormProps {
    initialData?: any;
}

export default function BrandForm({ initialData }: BrandFormProps) {
    const router = useRouter();
    const isEditMode = !!initialData;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // Initialize state with all schema fields
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        logo: initialData?.logo || "",
        images: initialData?.images || [], // Array of strings
        descriptions: {
            d1: initialData?.descriptions?.d1 || "",
            d2: initialData?.descriptions?.d2 || "",
            d3: initialData?.descriptions?.d3 || "",
        },
        socialLinks: {
            facebook: initialData?.socialLinks?.facebook || "",
            x: initialData?.socialLinks?.x || "",
            instagram: initialData?.socialLinks?.instagram || "",
            youtube: initialData?.socialLinks?.youtube || "",
        },
        youtubeVideos: initialData?.youtubeVideos || [], // Array of strings
        isActive: initialData?.isActive ?? true,
    });

    // Helper for simple text inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (success) setSuccess("");
    };

    // Helper for nested objects (descriptions, socialLinks)
    const handleNestedChange = (parent: "descriptions" | "socialLinks", key: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [key]: value,
            },
        }));
        if (success) setSuccess("");
    };

    // Helper for array inputs (images, youtubeVideos)
    const handleArrayAdd = (field: "images" | "youtubeVideos") => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ""], // Add empty string
        }));
    };

    const handleArrayChange = (field: "images" | "youtubeVideos", index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData((prev) => ({ ...prev, [field]: newArray }));
    };

    const handleArrayRemove = (field: "images" | "youtubeVideos", index: number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_: string, i: number) => i !== index),
        }));
    };

    const handleToggle = () => {
        setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Filter out empty strings from arrays
            const payload = {
                ...formData,
                images: formData.images.filter((url: string) => url.trim() !== ""),
                youtubeVideos: formData.youtubeVideos.filter((url: string) => url.trim() !== ""),
                // Include ID for update
                ...(isEditMode && { id: initialData._id }),
            };

            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch("/api/admin/brands", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Something went wrong");
            }

            setSuccess("Data saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save brand: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-sm border border-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? "Edit Brand" : "Create New Brand"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below to configure the brand page.</p>
                </div>
                <div className="flex items-center gap-4">
                    {success && (
                        <div className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-lg animate-fade-in">
                            ✓ {success}
                        </div>
                    )}
                    <div className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide ${formData.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {formData.isActive ? "ACTIVE" : "INACTIVE"}
                    </div>
                </div>
            </div>

            {/* Core Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Brand Name <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Coca-Cola Zero"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Slug <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="e.g. coke-zero"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    />
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Logo */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Visual Identity</h3>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Logo URL <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 items-start">
                        <input
                            type="url"
                            name="logo"
                            value={formData.logo}
                            onChange={handleChange}
                            placeholder="https://example.com/logo.png"
                            required
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                        {formData.logo && (
                            <div className="relative w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                <Image src={formData.logo} alt="Preview" fill className="object-contain" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex justify-between">
                        Brand Images (Gallery)
                        <button type="button" onClick={() => handleArrayAdd("images")} className="text-xs text-blue-600 hover:underline">+ Add Image</button>
                    </label>
                    <div className="grid gap-3">
                        {formData.images.map((url: string, index: number) => (
                            <div key={index} className="flex gap-3">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => handleArrayChange("images", index, e.target.value)}
                                    placeholder="https://example.com/banner.jpg"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none"
                                />
                                <button type="button" onClick={() => handleArrayRemove("images", index)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Descriptions */}
            <section className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Content</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description Paragaph {num}</label>
                            <textarea
                                value={(formData.descriptions as any)[`d${num}`]}
                                onChange={(e) => handleNestedChange("descriptions", `d${num}`, e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-sm"
                                placeholder={`Paragraph ${num} content...`}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <hr className="border-gray-100" />

            {/* Social & Videos */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Social Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Social Media</h3>
                    <div className="grid gap-3">
                        {(["facebook", "x", "instagram", "youtube"] as const).map((platform) => (
                            <div key={platform} className="space-y-1">
                                <label className="text-xs uppercase font-bold text-gray-500">{platform}</label>
                                <input
                                    type="text"
                                    value={formData.socialLinks[platform]}
                                    onChange={(e) => handleNestedChange("socialLinks", platform, e.target.value)}
                                    placeholder={`Link to ${platform}`}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Youtube Videos */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                        Video Gallery
                        <button type="button" onClick={() => handleArrayAdd("youtubeVideos")} className="text-xs text-white bg-black px-2 py-1 rounded hover:bg-gray-800">+ Add</button>
                    </h3>
                    <div className="space-y-2">
                        {formData.youtubeVideos.map((url: string, index: number) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => handleArrayChange("youtubeVideos", index, e.target.value)}
                                    placeholder="Youtube Embed URL..."
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                                />
                                <button type="button" onClick={() => handleArrayRemove("youtubeVideos", index)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                            </div>
                        ))}
                        {formData.youtubeVideos.length === 0 && (
                            <p className="text-sm text-gray-400 italic">No videos added.</p>
                        )}
                    </div>
                </div>
            </section>

            <hr className="border-gray-100" />

            <div className="flex items-center justify-between">
                {/* Toggle Active */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${formData.isActive ? "bg-black" : "bg-gray-300"
                            }`}
                    >
                        <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${formData.isActive ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </button>
                    <span className="text-sm font-medium text-gray-700">Publicly Visible</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/dashboard"
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                    >
                        {loading ? "Saving..." : isEditMode ? "Update Brand" : "Create Brand"}
                    </button>
                </div>
            </div>
        </form>
    );
}

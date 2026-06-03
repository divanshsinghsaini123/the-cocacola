"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GcoreUpload from "./GcoreUpload";
import Toast from "./Toast";
import { useUnsavedChanges } from "./useUnsavedChanges";

export interface BrandDescriptions {
    d1: string;
    d2: string;
    d3: string;
}

export interface BrandSocialLinks {
    facebook: string;
    x: string;
    instagram: string;
    youtube: string;
}

export interface Brand {
    _id?: string;
    name: string;
    slug: string;
    logo: string;
    images: string[];
    descriptions: BrandDescriptions;
    socialLinks: BrandSocialLinks;
    youtubeVideos: string[];
    isActive: boolean;
}

interface BrandFormProps {
    initialData?: Brand;
}

export default function BrandForm({ initialData }: BrandFormProps) {
    const router = useRouter();
    const isEditMode = !!initialData;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [isSaved, setIsSaved] = useState(false);

    // Initial form state definition
    const initialFormState = {
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
    };

    const [formData, setFormData] = useState(initialFormState);

    // Determine if form is dirty by comparing JSON representations
    const isDirty = !isSaved && JSON.stringify(formData) !== JSON.stringify(initialFormState);

    // Call the navigation guard hook
    useUnsavedChanges(isDirty);

    // Helper for simple text inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const processedValue = name === "slug" ? value.replace(/\s+/g, "-") : value;
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
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

            setIsSaved(true);
            setSuccess("Data saved successfully!");
            if (!isEditMode) {
                setTimeout(() => {
                    router.push("/admin/brands");
                }, 1500);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save brand: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-sm border border-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? "Edit Brand" : "Create New Brand"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below to configure the brand page.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Success message moved to Toast */}
                    <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-red-500 font-bold text-lg leading-none align-middle mr-1">*</span>
                        <span className="align-middle">fields are mandatory</span>
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
                        placeholder="e.g. Cloud9 Zero"
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

            {/* Section 1: Visual Identity */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section 1</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <section className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-red-500 pl-4">Visual Identity</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Logo (Single Image) <span className="text-red-500">*</span></label>
                        <div className="flex gap-4 items-center">
                            {formData.logo ? (
                                <div className="flex items-center gap-4">
                                    <div className="relative w-24 h-24 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm p-2">
                                        <Image src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + formData.logo} alt="Logo" fill className="object-contain" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <GcoreUpload
                                            folder="brands"
                                            maxSizeMB={2}
                                            onSuccess={(url) => {
                                                const eventLine = { target: { name: 'logo', value: url } } as React.ChangeEvent<HTMLInputElement>;
                                                handleChange(eventLine);
                                            }}
                                        >
                                            {({ open, isLoading }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => open()}
                                                    disabled={isLoading}
                                                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                                >
                                                    {isLoading ? "Uploading..." : "Change Logo"}
                                                </button>
                                            )}
                                        </GcoreUpload>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const eventLine = { target: { name: 'logo', value: "" } } as React.ChangeEvent<HTMLInputElement>;
                                                handleChange(eventLine);
                                            }}
                                            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 text-left"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <GcoreUpload
                                    folder="brands"
                                    maxSizeMB={2}
                                    onSuccess={(url) => {
                                        const eventLine = { target: { name: 'logo', value: url } } as React.ChangeEvent<HTMLInputElement>;
                                        handleChange(eventLine);
                                    }}
                                >
                                    {({ open, isLoading }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            disabled={isLoading}
                                            className="flex items-center justify-center w-full max-w-xs h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-black hover:text-black transition-colors disabled:opacity-50"
                                        >
                                            <span className="text-sm font-medium flex flex-col items-center">
                                                {isLoading ? "Uploading..." : "+ Upload Logo"}
                                                {!isLoading && <span className="text-xs text-gray-400 mt-1">(500x500)</span>}
                                            </span>
                                        </button>
                                    )}
                                </GcoreUpload>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex justify-between items-center">
                            Brand Images (Gallery)
                            <GcoreUpload
                                folder="brands"
                                multiple={true}
                                maxSizeMB={2}
                                onSuccess={(url) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...prev.images, url]
                                    }));
                                }}
                            >
                                {({ open, isLoading }) => (
                                    <button
                                        type="button"
                                        onClick={() => open()}
                                        disabled={isLoading}
                                        className="text-xs text-blue-600 hover:underline font-semibold disabled:opacity-50"
                                    >
                                        {isLoading ? "Uploading..." : "+ Add New Image (1440*810)"}
                                    </button>
                                )}
                            </GcoreUpload>
                        </label>

                        {formData.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.images.map((url: string, index: number) => (
                                    <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        <Image src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + url} alt={`Gallery ${index}`} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleArrayRemove("images", index)}
                                                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded font-medium hover:bg-red-700 shadow-lg transform scale-95 hover:scale-100 transition-all"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic p-6 border border-dashed border-gray-200 rounded-xl text-center bg-gray-50/50">
                                No images added to gallery yet.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 2: Video Gallery */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section 2</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <section className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-black pl-4 flex justify-between items-center">
                    Video Gallery
                    <button type="button" onClick={() => handleArrayAdd("youtubeVideos")} className="text-xs font-bold text-white bg-black px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors">+ Add Video</button>
                </h3>
                <div className="space-y-3">
                    {formData.youtubeVideos.map((url: string, index: number) => (
                        <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <span className="text-xs font-bold text-gray-400 w-6 text-center">{index + 1}</span>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => handleArrayChange("youtubeVideos", index, e.target.value)}
                                placeholder="Youtube Embed URL..."
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                            />
                            <button type="button" onClick={() => handleArrayRemove("youtubeVideos", index)} className="text-gray-400 hover:text-red-500 p-2 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>
                    ))}
                    {formData.youtubeVideos.length === 0 && (
                        <p className="text-sm text-gray-400 italic pl-3">No videos added yet.</p>
                    )}
                </div>
            </section>

            {/* Section 3: Social Media */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section 3</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <section className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-4">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(["facebook", "x", "instagram", "youtube"] as const).map((platform) => (
                        <div key={platform} className="space-y-2">
                            <label className="text-xs uppercase font-bold text-gray-500 flex items-center gap-2">
                                {platform}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 text-xs">https://</span>
                                </div>
                                <input
                                    type="text"
                                    value={formData.socialLinks[platform]}
                                    onChange={(e) => handleNestedChange("socialLinks", platform, e.target.value)}
                                    placeholder={`...`}
                                    className="w-full pl-16 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none transition-shadow"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4: Summary Content */}
            <div className="flex items-center gap-4 py-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Section 4</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            <section className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-l-4 border-green-500 pl-4">Summary Content</h3>
                <div className="space-y-6">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Paragraph {num} <span className="text-gray-400 font-normal text-xs ml-2">(1-2 Lines)</span></label>
                            <textarea
                                value={formData.descriptions[`d${num}` as keyof BrandDescriptions]}
                                onChange={(e) => handleNestedChange("descriptions", `d${num}`, e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none text-sm leading-relaxed"
                                placeholder={`Enter detailed description for paragraph ${num}...`}
                                maxLength={300}
                            />
                        </div>
                    ))}
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
                        href="/admin/brands"
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-sm  font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
                    >
                        {loading ? "Saving..." : isEditMode ? "Update Brand" : "Create Brand"}
                    </button>
                    <Link
                        href={`/brands/${formData.slug}`}
                        target="_blank"
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Preview
                    </Link>
                </div>
            </div>
            {success && (
                <Toast
                    message={success}
                    onClose={() => setSuccess("")}
                />
            )}
        </form>
    );
}

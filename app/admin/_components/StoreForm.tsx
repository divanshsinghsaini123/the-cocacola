"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BunnyUpload from "./BunnyUpload";

export default function StoreForm({ store }: any) {
    const isEditmode = !!store;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // User task: Implement logic for these states if needed
    const [formData, setFormData] = useState(
        {
            name: store?.name || "",
            image: store?.image || "",
            link: store?.link || "",
            address: store?.address || "",
            phone: store?.phone || "",
            modeofstore: store?.modeofstore || "",
            isActive: store?.isActive ?? true,
        }
    );

    // User task: Implement handle change function
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: (type === "checkbox") ? (e.target as HTMLInputElement).checked : e.target.value
        }))
    }
    // User task: Implement submit function
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        try {
            //yaha se hogi api call ,jo submit kregi response ,
            //but ek confusion hain , konsi api call krni hai ,
            const payload = {
                ...formData,
                ...(isEditmode && { id: store._id }),
            }

            const RequestType = isEditmode ? "PUT" : "POST";
            const response = await fetch("/api/admin/stores",
                {
                    method: RequestType,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            )
            if (response.ok) {
                setSuccess("Store details submitted successfully.");
                router.push(`/admin/stores`);
            }
        }
        catch (error) {
            console.log(error);
            setSuccess("Failed to submit store details. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{isEditmode ? "Edit Store" : "New Store"}</h2>
                    <p className="text-sm text-gray-500">Manage store details, location, and contact info.</p>
                </div>
                <div className="flex items-center gap-4">
                    {success && (
                        <div className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 rounded-lg animate-fade-in">
                            ✓ {success}
                        </div>
                    )}
                    <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-red-500 font-bold text-lg leading-none align-middle mr-1">*</span>
                        <span className="align-middle">fields are mandatory</span>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Coca-Cola Downtown"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Store Link (URL) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://..."
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+1 234..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Mode of Store <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="modeofstore"
                        value={formData.modeofstore}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Retail, Popup, Flagship"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Address</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field h-24 resize-none"
                    placeholder="Enter full store address..."
                />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
                <label className="text-sm font-semibold">Store Image<span className="text-red-500">*</span></label>
                <div className="flex gap-4 items-center">
                    {formData.image ? (
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 bg-gray-50 border rounded overflow-hidden">
                                <Image src={formData.image} alt="prev" fill className="object-contain" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <BunnyUpload
                                    folder="stores"
                                    onSuccess={(url) => {
                                        handleChange({ target: { name: 'image', value: url } } as any);
                                    }}
                                >
                                    {({ open, isLoading }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            disabled={isLoading}
                                            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                        >
                                            {isLoading ? "Uploading..." : "Change Image"}
                                        </button>
                                    )}
                                </BunnyUpload>
                                <button
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'image', value: "" } } as any)}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 text-left"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <BunnyUpload
                            folder="stores"
                            onSuccess={(url) => {
                                handleChange({ target: { name: 'image', value: url } } as any);
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
                                        {isLoading ? "Uploading..." : "+ Upload Image"}
                                        {!isLoading && <span className="text-xs text-gray-400 mt-1">(800x800)</span>}
                                    </span>
                                </button>
                            )}
                        </BunnyUpload>
                    )}
                </div>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Store Status</label>
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                        <span className="ms-3 text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                            {formData.isActive ? "Active (Visible to public)" : "Inactive (Hidden)"}
                        </span>
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 bg-gray-100 rounded-lg font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Saving..." : (isEditmode ? "Update Store" : "Create Store")}
                </button>
            </div>

            {/* Styles */}
            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.625rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    outline: none;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                    background-color: white;
                }
                .input-field:focus {
                    border-color: black;
                    box-shadow: 0 0 0 1px black;
                }
                .input-field::placeholder {
                    color: #9ca3af;
                }
            `}</style>
        </form>
    );
}
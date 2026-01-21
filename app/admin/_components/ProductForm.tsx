"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GcoreUpload from "./GcoreUpload";

interface ProductFormProps {
    initialData?: any;
    brandId?: string; // required valid ID
    stores?: any[];
}

export default function ProductForm({ initialData, brandId, stores = [] }: ProductFormProps) {
    const router = useRouter();
    const isEditMode = !!initialData;
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // If editing, brandId might be in initialData.brand
    const finalBrandId = brandId || initialData?.brand;

    const [formData, setFormData] = useState({
        brand: finalBrandId || "",
        stores: initialData?.stores || [],
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        image: initialData?.image || "",
        description: initialData?.description || "",
        summary: initialData?.summary || "",
        sizesAvailable: initialData?.sizesAvailable || [],
        nutrition: {
            quantity: initialData?.nutrition?.quantity || "",
            diet: initialData?.nutrition?.diet || "",
            ingredients: initialData?.nutrition?.ingredients || "",
            nutritionfacts: initialData?.nutrition?.nutritionfacts || [],
        },
        isActive: initialData?.isActive ?? true,
    });

    const handleStoreToggle = (storeId: string) => {
        setFormData((prev) => ({
            ...prev,
            stores: prev.stores.includes(storeId)
                ? prev.stores.filter((id: string) => id !== storeId)
                : [...prev.stores, storeId],
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const processedValue = name === "slug" ? value.replace(/\s+/g, "-") : value;
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
        if (success) setSuccess("");
    };

    const handleNutritionChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            nutrition: { ...prev.nutrition, [name]: value },
        }));
        if (success) setSuccess("");
    };

    // Handling Extra Nutrition items
    const handleAddExtra = () => {
        setFormData((prev) => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                nutritionfacts: [...(prev.nutrition.nutritionfacts || []), { key: { name: "", amount: "" } }],
            },
        }));
    };

    const handleExtraChange = (index: number, field: string, value: string) => {
        const newExtras = [...formData.nutrition.nutritionfacts];
        newExtras[index] = {
            ...newExtras[index],
            key: { ...newExtras[index].key, [field]: value },
        };
        setFormData((prev) => ({
            ...prev,
            nutrition: { ...prev.nutrition, nutritionfacts: newExtras },
        }));
    };

    const handleRemoveExtra = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                nutritionfacts: prev.nutrition.nutritionfacts.filter((_: any, i: number) => i !== index),
            },
        }));
    };

    // Sizes
    const handleAddSize = () => {
        setFormData((prev) => ({
            ...prev,
            sizesAvailable: [...prev.sizesAvailable, ""],
        }));
    };

    const handleSizeChange = (index: number, value: string) => {
        const newSizes = [...formData.sizesAvailable];
        newSizes[index] = value;
        setFormData((prev) => ({ ...prev, sizesAvailable: newSizes }));
    };

    const handleRemoveSize = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            sizesAvailable: prev.sizesAvailable.filter((_: any, i: number) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");

        try {
            const payload = {
                ...formData,
                sizesAvailable: formData.sizesAvailable.filter((s: string) => s.trim() !== ""),
                ...(isEditMode && { id: initialData._id }),
            };

            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch("/api/admin/products", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Something went wrong");
            }

            setSuccess("Product saved successfully!");

            router.push(`/admin/brands/edit/${finalBrandId}`);

        } catch (error) {
            console.error(error);
            alert("Failed to save product: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? "Edit Product" : "New Product"}</h2>
                    <p className="text-sm text-gray-500">Managing product details including nutrition and sizes.</p>
                </div>
                <div className="flex items-center gap-4">
                    {success && <div className="text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-lg">✓ {success}</div>}
                    <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-red-500 font-bold text-lg leading-none align-middle mr-1">*</span>
                        <span className="align-middle">fields are mandatory</span>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Product Name <span className="text-red-500">*</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} className="input-field" required placeholder="e.g. Diet Coke" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold">Slug <span className="text-red-500">*</span></label>
                    <input name="slug" value={formData.slug} onChange={handleChange} className="input-field" required placeholder="e.g. diet-coke" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold">Detailed Description ( 25 - 30 words ) <span className="text-red-500">*</span></label>
                <textarea maxLength={170} name="description" value={formData.description} onChange={handleChange} className="input-field h-24" required placeholder="Product description..." />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold">Summary (20 - 30 words ) <span className="text-red-500">*</span></label>
                <textarea maxLength={190} name="summary" value={formData.summary} onChange={handleChange} className="input-field h-24" required placeholder="Product summary..." />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold">Product Image URL <span className="text-red-500">*</span></label>
                <div className="flex gap-4 items-center">
                    {formData.image ? (
                        <div className="flex items-center gap-4">
                            <div className="relative w-20 h-20 bg-gray-50 border rounded overflow-hidden">
                                <Image src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + formData.image} alt="prev" fill className="object-contain" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <GcoreUpload
                                    folder="products"
                                    maxSizeMB={0.5}
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
                                </GcoreUpload>
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
                        <GcoreUpload
                            folder="products"
                            maxSizeMB={0.5}
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
                        </GcoreUpload>
                    )}
                </div>
            </div>

            <hr />

            {/* Store Availability */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">Available in Stores</h3>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            Select stores where this product is available
                        </span>
                    </div>
                </div>

                {stores && stores.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {stores.map((store: any) => (
                            <label key={store._id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-black transition-colors shadow-sm">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-black checked:bg-black"
                                        checked={formData.stores.includes(store._id)}
                                        onChange={() => handleStoreToggle(store._id)}
                                    />
                                    <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col select-none">
                                    <span className="text-sm font-semibold text-gray-900 line-clamp-1" title={store.name}>{store.name}</span>
                                    <span className="text-xs text-gray-500 line-clamp-1">{store.address || "No address"}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 italic">
                        No stores found. Please create stores first.
                    </div>
                )}
            </div>

            <hr />

            {/* Sizes */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">Available Sizes</h3>
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                            ⚠️ Note: Include units with quantity (e.g. ml, L , g , Kg)
                        </span>
                    </div>
                    <button type="button" onClick={handleAddSize} className="text-xs text-blue-600 font-bold hover:underline">+ Add Size</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.sizesAvailable.map((size: string, idx: number) => (
                        <div key={idx} className="flex gap-1">
                            <input value={size} onChange={(e) => handleSizeChange(idx, e.target.value)} className="input-field text-sm" placeholder="e.g. 250ml" />
                            <button type="button" onClick={() => handleRemoveSize(idx)} className="text-red-500 px-2">✕</button>
                        </div>
                    ))}
                </div>
            </div>

            <hr />

            {/* Nutrition */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-3">
                    Nutrition Information
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                        ⚠️ Note: Include units with quantity (e.g. ml, g , Kcal)
                    </span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Base Quantity</label>
                        <input value={formData.nutrition.quantity} onChange={(e) => handleNutritionChange("quantity", e.target.value)} className="input-field" placeholder="e.g. 100ml" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Based on __ KiloCalories (Diet)</label>
                        <input value={formData.nutrition.diet} onChange={(e) => handleNutritionChange("diet", e.target.value)} className="input-field" placeholder="e.g. 42kcal" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Ingredients</label>
                    <textarea value={formData.nutrition.ingredients} onChange={(e) => handleNutritionChange("ingredients", e.target.value)} className="input-field h-20" placeholder="Carbonated water..." />
                </div>

                {/* Extras */}
                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                    <div className="flex justify-between mb-3">
                        <label className="text-sm font-bold text-gray-700">Extra Nutrients (Fat, Sugars, etc)</label>
                        <button type="button" onClick={handleAddExtra} className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800">+ Add Nutrient</button>
                    </div>
                    <div className="space-y-3">
                        {formData.nutrition.nutritionfacts.map((extra: any, i: number) => (
                            <div key={i} className="flex gap-2 items-center">
                                {/* <input placeholder="Type (e.g. Fat)" value={extra.key.type} onChange={(e) => handleExtraChange(i, "type", e.target.value)} className="input-field text-sm flex-1" /> */}
                                <input placeholder="Nutrient Name(e.g. Fat)" value={extra.key.name} onChange={(e) => handleExtraChange(i, "name", e.target.value)} className="input-field text-sm w-20" />
                                <input placeholder="Amount (e.g. 0g)" value={extra.key.amount} onChange={(e) => handleExtraChange(i, "amount", e.target.value)} className="input-field text-sm w-24" />
                                <button type="button" onClick={() => handleRemoveExtra(i)} className="text-red-500 hover:text-red-700 px-2 font-bold">✕</button>
                            </div>
                        ))}
                        {formData.nutrition.nutritionfacts.length === 0 && <p className="text-xs text-gray-400 italic">No extra nutrients added.</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => router.back()} className="px-5 py-2.5 bg-gray-100 rounded-lg font-semibold text-gray-600 hover:bg-gray-200">Go Back</button>
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50">
                    {loading ? "Saving..." : "Save Product"}
                </button>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.5rem 1rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-field:focus {
                    ring: 2px solid black;
                    border-color: transparent;
                }
            `}</style>
        </form>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteBrandButton from "../DeleteBrandButton";
import { updateBrandOrder, toggleBrandActive } from "../actions";

interface Brand {
    _id: string;
    name: string;
    logo: string;
    slug: string;
    isActive: boolean;
}

interface BrandsListProps {
    initialBrands: Brand[];
}

export default function BrandsList({ initialBrands }: BrandsListProps) {
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [rearrangeMode, setReararrangeMode] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        setBrands(initialBrands);
        setHasChanged(false);
    }, [initialBrands]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // Native HTML5 Drag and Drop
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // Create an transparent ghost image/custom class styling
        e.currentTarget.classList.add("opacity-50", "scale-95");
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newBrands = [...brands];
        const draggedItem = newBrands[draggedIndex];
        newBrands.splice(draggedIndex, 1);
        newBrands.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setBrands(newBrands);
        setHasChanged(true);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedIndex(null);
        e.currentTarget.classList.remove("opacity-50", "scale-95");
    };

    // Accessible arrow button reordering
    const moveBrand = (index: number, direction: "left" | "right") => {
        const targetIndex = direction === "left" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= brands.length) return;

        const newBrands = [...brands];
        const temp = newBrands[index];
        newBrands[index] = newBrands[targetIndex];
        newBrands[targetIndex] = temp;

        setBrands(newBrands);
        setHasChanged(true);
        showToast(`Moved ${temp.name} ${direction === "left" ? "left" : "right"}`, "success");
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const brandIds = brands.map((b) => b._id);
            const res = await updateBrandOrder(brandIds);
            if (res.success) {
                setHasChanged(false);
                setReararrangeMode(false);
                showToast("Brand layout order saved successfully!", "success");
            } else {
                showToast(res.error || "Failed to save brand layout order", "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Something went wrong saving brand layout order", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setBrands(initialBrands);
        setHasChanged(false);
        setReararrangeMode(false);
        showToast("Rearrangements discarded", "success");
    };

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 border border-gray-200 p-4 rounded-2xl shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Layout Arrangement</h2>
                    <p className="text-xs text-gray-500">
                        {rearrangeMode
                            ? "Drag & drop cards or use the ← → buttons to rearrange. Click Save to persist."
                            : "Rearrange the display order of brands on the home page and brands listing."}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {rearrangeMode ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !hasChanged}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Layout Order"
                                )}
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setReararrangeMode(true)}
                            disabled={brands.length <= 1}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 text-sm font-bold text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:text-black transition-all shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4-4 4 4"/><path d="m8 21 4 4 4-4"/><path d="M12 1v22"/><path d="m19 16 4-4-4-4"/><path d="m5 16-4-4 4-4"/><path d="M23 12H1"/></svg>
                            Rearrange Layout Order
                        </button>
                    )}
                </div>
            </div>

            {/* Grid Area */}
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${rearrangeMode ? "select-none" : ""}`}>
                {brands.map((brand: Brand, index: number) => {
                    const isDragged = index === draggedIndex;
                    return (
                        <div
                            key={brand._id}
                            draggable={rearrangeMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`group relative flex flex-col overflow-hidden bg-white border rounded-2xl shadow-sm transition-all duration-300 ${
                                rearrangeMode
                                    ? isDragged
                                        ? "border-red-500 ring-2 ring-red-500/20 opacity-40 scale-95 shadow-inner"
                                        : "border-dashed border-gray-400 hover:border-red-500 hover:ring-2 hover:ring-red-500/10 cursor-grab active:cursor-grabbing hover:translate-y-[-2px]"
                                    : "border-gray-200 hover:shadow-lg hover:border-gray-300"
                            }`}
                        >
                            {/* Drag Indicator Overlay */}
                            {rearrangeMode && (
                                <div className="absolute top-2 left-2 z-30 flex items-center justify-center p-1.5 bg-black/80 text-white rounded-lg shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                                </div>
                            )}

                            {/* Toggle active status button */}
                            {!rearrangeMode && (
                                <button
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        const newStatus = !brand.isActive;
                                        setBrands(prev => prev.map(b => b._id === brand._id ? { ...b, isActive: newStatus } : b));
                                        try {
                                            const res = await toggleBrandActive(brand._id, newStatus);
                                            if (res.success) {
                                                showToast(`${brand.name} is now ${newStatus ? 'Active' : 'Inactive'}`, "success");
                                            } else {
                                                setBrands(prev => prev.map(b => b._id === brand._id ? { ...b, isActive: !newStatus } : b));
                                                showToast(res.error || "Failed to update brand status", "error");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            setBrands(prev => prev.map(b => b._id === brand._id ? { ...b, isActive: !newStatus } : b));
                                            showToast("Something went wrong", "error");
                                        }
                                    }}
                                    className="absolute top-2 left-2 z-20 flex items-center justify-center p-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md border border-gray-200 transition-all outline-none"
                                    title={brand.isActive ? "Click to Deactivate" : "Click to Activate"}
                                >
                                    <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${brand.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                                        <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${brand.isActive ? "translate-x-4" : "translate-x-0"}`} />
                                    </div>
                                </button>
                            )}

                            {/* Delete Button (disabled in rearrange mode) */}
                            {!rearrangeMode && <DeleteBrandButton id={brand._id} />}

                            {/* Image Area */}
                            <div className="relative flex items-center justify-center w-full h-48 p-6 bg-gray-50 group-hover:bg-gray-100/80 transition-colors">
                                <div className={`relative w-full h-full ${!brand.isActive ? "opacity-45 grayscale" : ""}`}>
                                    <Image
                                        src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + brand.logo}
                                        alt={brand.name}
                                        fill
                                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                                        draggable={false}
                                    />
                                </div>
                                {!brand.isActive && (
                                    <span className="absolute bottom-2 left-2 z-10 px-2.5 py-0.5 text-[10px] font-bold text-gray-500 bg-gray-200 border border-gray-300 rounded-md uppercase tracking-wider">
                                        Inactive
                                    </span>
                                )}
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col flex-1 p-5">
                                <h3 className="text-xl font-bold text-gray-900 truncate pb-5" title={brand.name}>
                                    {brand.name}
                                </h3>

                                {rearrangeMode ? (
                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveBrand(index, "left");
                                            }}
                                            disabled={index === 0}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all"
                                            title="Move Left"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                        </button>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                                            Position {index + 1}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveBrand(index, "right");
                                            }}
                                            disabled={index === brands.length - 1}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all"
                                            title="Move Right"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mt-auto flex gap-3">
                                        <Link
                                            href={`/admin/brands/edit/${brand._id}`}
                                            className="flex-1 px-4 py-2 text-sm font-semibold text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                                        >
                                            Edit/Products
                                        </Link>
                                        <Link
                                            href={`/brands/${brand.slug}`}
                                            target="_blank"
                                            className="flex-1 px-4 py-2 text-sm font-semibold text-center text-[#F40009] bg-red-50 border border-transparent rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Preview
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {brands.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
                        <p className="text-lg font-medium text-gray-900">No brands found</p>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first brand.</p>
                        <Link
                            href="/admin/brands/add"
                            className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Create Brand &rarr;
                        </Link>
                    </div>
                )}
            </div>

            {/* Custom Premium Toast Alert */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-300">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
                        toast.type === "success"
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        {toast.type === "success" ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        )}
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

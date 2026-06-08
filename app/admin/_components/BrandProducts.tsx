"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProductOrder, toggleProductActive } from "../brands/actions";

interface BrandProductsProps {
    brandId: string;
    brandName: string;
}

export default function BrandProducts({ brandId, brandName }: BrandProductsProps) {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [originalProducts, setOriginalProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Rearrange Mode States
    const [rearrangeMode, setRearrangeMode] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        fetchProducts();
    }, [brandId]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`/api/admin/products?brand=${brandId}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
                setOriginalProducts(data.products);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (productId: string) => {
        setDeletingId(productId);
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            const res = await fetch("/api/admin/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deletingId }),
            });

            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p._id !== deletingId));
                setOriginalProducts((prev) => prev.filter((p) => p._id !== deletingId));
                setDeletingId(null);
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Native HTML5 Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add("opacity-50", "scale-[0.98]");
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newProducts = [...products];
        const draggedItem = newProducts[draggedIndex];
        newProducts.splice(draggedIndex, 1);
        newProducts.splice(index, 0, draggedItem);
        
        setDraggedIndex(index);
        setProducts(newProducts);
        setHasChanged(true);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedIndex(null);
        e.currentTarget.classList.remove("opacity-50", "scale-[0.98]");
    };

    const moveProduct = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= products.length) return;

        const newProducts = [...products];
        const temp = newProducts[index];
        newProducts[index] = newProducts[targetIndex];
        newProducts[targetIndex] = temp;

        setProducts(newProducts);
        setHasChanged(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const productIds = products.map((p) => p._id);
            const res = await updateProductOrder(productIds, brandId);
            if (res.success) {
                setOriginalProducts(products);
                setHasChanged(false);
                setRearrangeMode(false);
            } else {
                alert(res.error || "Failed to save product order");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setProducts(originalProducts);
        setHasChanged(false);
        setRearrangeMode(false);
    };

    if (loading) return (
        <div className="mt-12 pt-8 text-center text-gray-500 animate-pulse">
            Loading products...
        </div>
    );

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Products ({products.length})</h3>
                    <p className="text-sm text-gray-500">Manage products belonging to {brandName}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    {products.length > 1 && (
                        rearrangeMode ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !hasChanged}
                                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                                >
                                    {saving ? "Saving..." : "Save Products Order"}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setRearrangeMode(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors shadow-sm hover:shadow-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4-4 4 4"/><path d="m8 21 4 4 4-4"/><path d="M12 1v22"/></svg>
                                Rearrange Products
                            </button>
                        )
                    )}

                    {!rearrangeMode && (
                        <Link
                            href={`/admin/Products/add?brandId=${brandId}`}
                            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                            Add Product
                        </Link>
                    )}
                </div>
            </div>

            {/* Product List */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <p className="text-gray-900 font-medium">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">Add products to populate this brand's page.</p>
                </div>
            ) : (
                <div className={`grid gap-4 ${rearrangeMode ? "select-none" : ""}`}>
                    {products.map((product, index) => {
                        const isDragged = index === draggedIndex;
                        return (
                            <div
                                key={product._id}
                                draggable={rearrangeMode}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border rounded-xl shadow-sm transition-all duration-200 ${
                                    rearrangeMode
                                        ? isDragged
                                            ? "border-red-500 ring-2 ring-red-500/20 opacity-40 scale-[0.98]"
                                            : "border-dashed border-gray-400 hover:border-red-500 hover:ring-2 hover:ring-red-500/10 cursor-grab active:cursor-grabbing hover:translate-y-[-1px]"
                                        : "border-gray-200 hover:shadow-md hover:border-gray-300"
                                }`}
                            >
                                {/* Drag handle indicator */}
                                {rearrangeMode && (
                                    <div className="flex-shrink-0 flex items-center justify-center p-1.5 bg-gray-100 text-gray-500 rounded-lg shadow-sm border border-gray-200/50">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                                    </div>
                                )}

                                {/* Toggle active status button */}
                                {!rearrangeMode && (
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            const newStatus = !product.isActive;
                                            setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: newStatus } : p));
                                            try {
                                                const res = await toggleProductActive(product._id, newStatus);
                                                if (res.success) {
                                                    showToast(`${product.name} is now ${newStatus ? 'Active' : 'Inactive'}`, "success");
                                                } else {
                                                    setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !newStatus } : p));
                                                    showToast(res.error || "Failed to update product status", "error");
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !newStatus } : p));
                                                showToast("Something went wrong", "error");
                                            }
                                        }}
                                        className="absolute top-2 left-2 z-20 flex items-center justify-center p-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md border border-gray-200 transition-all outline-none"
                                        title={product.isActive ? "Click to Deactivate" : "Click to Activate"}
                                    >
                                        <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${product.isActive ? "bg-green-500" : "bg-gray-300"}`}>
                                            <div className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${product.isActive ? "translate-x-4" : "translate-x-0"}`} />
                                        </div>
                                    </button>
                                )}

                                {/* Image */}
                                <div className="relative w-full sm:w-20 h-32 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                    {product.images && product.images.length > 0 ? (
                                        <Image src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + product.images[0]} alt={product.name} fill className={`object-contain p-2 hover:scale-110 transition-transform duration-300 ${!product.isActive ? "opacity-45 grayscale" : ""}`} draggable={false} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-gray-900 truncate text-lg">{product.name}</h4>
                                        {rearrangeMode && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                                Position {index + 1}
                                            </span>
                                        )}
                                        {!product.isActive && (
                                            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-red-50 text-red-600 rounded-full border border-red-100 uppercase tracking-wider">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-mono text-gray-500 truncate mb-2">{product.slug}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizesAvailable?.map((size: string) => (
                                            <span key={size} className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                                {size}
                                            </span>
                                        ))}
                                        {(!product.sizesAvailable || product.sizesAvailable.length === 0) && (
                                            <span className="text-[10px] text-gray-400 italic">No sizes specified</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions / Reorder Buttons */}
                                <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                    {rearrangeMode ? (
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <button
                                                onClick={() => moveProduct(index, "up")}
                                                disabled={index === 0}
                                                className="flex-1 sm:flex-none justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all border border-gray-200/50"
                                                title="Move Up"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                                            </button>
                                            <button
                                                onClick={() => moveProduct(index, "down")}
                                                disabled={index === products.length - 1}
                                                className="flex-1 sm:flex-none justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:bg-transparent transition-all border border-gray-200/50"
                                                title="Move Down"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 9-6 6-6-6"/></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/admin/Products/edit/${product._id}`}
                                                className="flex-1 sm:flex-none justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-black transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(product._id)}
                                                className="flex-1 sm:flex-none justify-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-transparent rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-sm text-center text-gray-500 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingId(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Deleting...
                                    </>
                                ) : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

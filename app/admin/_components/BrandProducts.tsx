"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BrandProductsProps {
    brandId: string;
    brandName: string;
}

export default function BrandProducts({ brandId, brandName }: BrandProductsProps) {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [brandId]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`/api/admin/products?brand=${brandId}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
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

    if (loading) return (
        <div className="mt-12 pt-8 text-center text-gray-500 animate-pulse">
            Loading products...
        </div>
    );

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Products ({products.length})</h3>
                    <p className="text-sm text-gray-500">Manage products belonging to {brandName}</p>
                </div>
                <Link
                    href={`/admin/Products/add?brandId=${brandId}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    </div>
                    <p className="text-gray-900 font-medium">No products found</p>
                    <p className="text-sm text-gray-500 mt-1">Add products to populate this brand's page.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-gray-300"
                        >
                            <div className="relative w-full sm:w-20 h-32 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                {product.image ? (
                                    <Image src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + product.image} alt={product.name} fill className="object-contain p-2 hover:scale-110 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0 w-full">
                                <h4 className="font-bold text-gray-900 truncate text-lg">{product.name}</h4>
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

                            <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
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
                            </div>
                        </div>
                    ))}
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
        </div>
    );
}

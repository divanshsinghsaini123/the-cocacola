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

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch("/api/admin/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: productId }),
            });

            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p._id !== productId));
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-gray-500">Loading products...</div>;

    return (
        <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Products ({products.length})</h3>
                    <p className="text-sm text-gray-500">Manage products belonging to {brandName}</p>
                </div>
                <Link
                    href={`/admin/products/add?brandId=${brandId}`}
                    className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
                >
                    + Add Product
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="div p-8 text-center bg-gray-50 border border-gray-200 border-dashed rounded-xl">
                    <p className="text-gray-500">No products found for this brand.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                {product.image ? (
                                    <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Img</div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                                <p className="text-xs text-gray-500 truncate">{product.slug}</p>
                                <div className="flex gap-2 mt-1">
                                    {product.sizesAvailable?.map((size: string) => (
                                        <span key={size} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/products/edit/${product._id}`}
                                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

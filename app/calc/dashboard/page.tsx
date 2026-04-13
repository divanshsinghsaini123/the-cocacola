"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Package, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Product {
    _id: string;
    productname: string;
    states: string[];
    createdAt?: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch products from backend (Currently mocked for UI preview)
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/admin/calc/dashboard');
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const hangleLogout = async () => {
        const res = await fetch('/api/admin/calc', { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to logout");
        router.push("/calc");
    }
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            // TODO: Delete API Request here
            // await fetch(`/api/calc/products?id=${id}`, { method: 'DELETE' });
            const res = await fetch(`/api/admin/calc/dashboard?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("Failed to delete");
            const data = await res.json();
            setProducts(products.filter(p => p._id !== id));
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/calc/dashboard/addProduct?id=${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="text-blue-600" />
                            Products Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your calculator products, prices, and sizes.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 mt-4 sm:mt-0">
                        <Link
                            href="/calc/dashboard/addProduct"
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto justify-center px-6 py-3 sm:py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add New Product
                        </Link>
                        <button
                            onClick={hangleLogout}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 w-full sm:w-auto justify-center px-6 py-3 sm:py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                            <Package size={48} className="text-gray-300 mb-4" />
                            <p>No products found. Add a new product to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Available States</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider">Date Added</th>
                                        <th className="px-6 py-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {product.productname}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.states.slice(0, 3).map(state => (
                                                        <span key={state} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
                                                            {state}
                                                        </span>
                                                    ))}
                                                    {product.states.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                                            +{product.states.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {product.createdAt || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 flex justify-end gap-3">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit Product"
                                                    onClick={() => handleEdit(product._id)}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Product"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

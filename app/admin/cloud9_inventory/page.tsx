"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";

interface InventoryItem {
    pincode: string;
    parent_product_name: string;
    variant_product_name: string;
    sku_id: string;
    size: string;
    mrp: string | number;
    offer_price: string | number;
    in_stock: string;
    max_allowed_cart_qty: number;
}

interface ApiResponse {
    cloud9_inventory: InventoryItem[];
}

interface GroupedPincode {
    pincode: string;
    items: InventoryItem[];
    totalItems: number;
    inStockCount: number;
    outOfStockCount: number;
}

export default function Cloud9InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [stockFilter, setStockFilter] = useState<string>("all");
    const [expandedPincodes, setExpandedPincodes] = useState<Record<string, boolean>>({});

    const API_ENDPOINT = "/api/admin/cloud9_inventory";

    const fetchInventory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_ENDPOINT, {
                cache: "no-store",
            });
            if (!res.ok) {
                throw new Error(`Failed to fetch inventory (Status ${res.status})`);
            }
            const data: ApiResponse = await res.json();

            let items: InventoryItem[] = [];
            if (data && Array.isArray(data.cloud9_inventory)) {
                items = data.cloud9_inventory;
            } else if (Array.isArray(data)) {
                const first = data[0] as any;
                if (first && Array.isArray(first.cloud9_inventory)) {
                    items = data.flatMap((d: any) => d.cloud9_inventory || []);
                } else {
                    items = data as any;
                }
            }

            setInventory(items);

            // Default expand first pincode accordion
            if (items.length > 0) {
                const firstPincode = String(items[0].pincode || "Unknown");
                setExpandedPincodes({ [firstPincode]: true });
            }
        } catch (err: any) {
            console.error("Error fetching Cloud9 Inventory:", err);
            setError(err.message || "An unexpected error occurred while fetching inventory data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Filter items first by search query & stock availability
    const filteredItems = useMemo(() => {
        return inventory.filter((item) => {
            const query = searchQuery.toLowerCase().trim();
            const parentName = (item.parent_product_name || "").toLowerCase();
            const variantName = (item.variant_product_name || "").toLowerCase();
            const sku = (item.sku_id || "").toLowerCase();
            const pincode = String(item.pincode || "").toLowerCase();

            const matchesSearch =
                !query ||
                parentName.includes(query) ||
                variantName.includes(query) ||
                sku.includes(query) ||
                pincode.includes(query);

            const isItemInStock =
                String(item.in_stock).toLowerCase() === "yes" ||
                String(item.in_stock).toLowerCase() === "true" ||
                Number(item.in_stock) > 0;

            const matchesStock =
                stockFilter === "all" ||
                (stockFilter === "in_stock" && isItemInStock) ||
                (stockFilter === "out_of_stock" && !isItemInStock);

            return matchesSearch && matchesStock;
        });
    }, [inventory, searchQuery, stockFilter]);

    // Group items by Pincode
    const groupedByPincode = useMemo(() => {
        const groups: Record<string, InventoryItem[]> = {};

        filteredItems.forEach((item) => {
            const pin = item.pincode ? String(item.pincode) : "Unknown Area";
            if (!groups[pin]) {
                groups[pin] = [];
            }
            groups[pin].push(item);
        });

        const result: GroupedPincode[] = Object.keys(groups).map((pin) => {
            const items = groups[pin];
            const inStockCount = items.filter((item) => {
                const s = String(item.in_stock).toLowerCase();
                return s === "yes" || s === "true" || Number(item.in_stock) > 0;
            }).length;

            return {
                pincode: pin,
                items,
                totalItems: items.length,
                inStockCount,
                outOfStockCount: items.length - inStockCount,
            };
        });

        return result;
    }, [filteredItems]);

    // Toggle single accordion
    const togglePincode = (pincode: string) => {
        setExpandedPincodes((prev) => ({
            ...prev,
            [pincode]: !prev[pincode],
        }));
    };

    // Expand / Collapse all
    const expandAll = () => {
        const allExpanded: Record<string, boolean> = {};
        groupedByPincode.forEach((group) => {
            allExpanded[group.pincode] = true;
        });
        setExpandedPincodes(allExpanded);
    };

    const collapseAll = () => {
        setExpandedPincodes({});
    };

    // Overall metrics
    const totalPincodes = groupedByPincode.length;
    const totalItems = inventory.length;
    const inStockCount = useMemo(() => {
        return inventory.filter((item) => {
            const s = String(item.in_stock).toLowerCase();
            return s === "yes" || s === "true" || Number(item.in_stock) > 0;
        }).length;
    }, [inventory]);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-12">
            {/* Top Navigation & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-3"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                                Cloud9 Pincode Inventory
                            </h1>
                            <p className="text-sm text-gray-500">
                                Inventory catalog organized by area pincodes. Click any pincode accordion to view product details.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchInventory}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                    >
                        <svg
                            className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                        {loading ? "Refreshing..." : "Refresh Webhook Data"}
                    </button>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Area Pincodes</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? "..." : totalPincodes}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Products</p>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? "..." : totalItems}</p>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-xl text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total In-Stock Items</p>
                        <p className="text-2xl font-extrabold text-emerald-600 mt-1">{loading ? "..." : inStockCount}</p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filter & Accordion Controls */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search product name, pincode, SKU ID..."
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all cursor-pointer"
                    >
                        <option value="all">All Availability</option>
                        <option value="in_stock">In Stock Only ('Yes')</option>
                        <option value="out_of_stock">Out of Stock Only</option>
                    </select>

                    <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                        <button
                            onClick={expandAll}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                        >
                            Expand All
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                        >
                            Collapse All
                        </button>
                    </div>
                </div>
            </div>

            {/* Accordion List View */}
            {loading ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">Fetching Live Inventory</h3>
                    <p className="text-xs text-gray-500 mt-1">Connecting to Inventory API...</p>
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-rose-900">Failed to load Inventory Data</h3>
                    <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
                    <button
                        onClick={fetchInventory}
                        className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            ) : groupedByPincode.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-base font-bold text-gray-800">No inventory found</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                        {searchQuery ? "No products or pincodes match your active search terms." : "The API returned no inventory items."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedByPincode.map((group) => {
                        const isExpanded = !!expandedPincodes[group.pincode];

                        return (
                            <div
                                key={group.pincode}
                                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-amber-200"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => togglePincode(group.pincode)}
                                    className="w-full p-4 md:p-5 flex items-center justify-between bg-white hover:bg-gray-50/70 transition-colors text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            <span className="text-sm md:text-base tracking-wide font-mono">
                                                {group.pincode}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-base md:text-lg font-bold text-gray-900">
                                                    Area Pincode: {group.pincode}
                                                </h3>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {group.totalItems} product{group.totalItems > 1 ? "s" : ""} listed in this area
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Status badges summary */}
                                        <div className="hidden sm:flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                                                {group.inStockCount} In Stock
                                            </span>
                                            {group.outOfStockCount > 0 && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-lg border border-rose-100">
                                                    {group.outOfStockCount} Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Arrow Icon */}
                                        <div className="p-2 bg-gray-100 rounded-xl text-gray-500 group-hover:bg-gray-200 transition-colors">
                                            <svg
                                                className={`w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>

                                {/* Accordion Content: Products Table */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50/50">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse text-sm">
                                                <thead>
                                                    <tr className="bg-gray-100/80 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                                        <th className="py-3 px-4 md:px-6">Product Details</th>
                                                        <th className="py-3 px-4 md:px-6">SKU ID</th>
                                                        <th className="py-3 px-4 md:px-6">Size</th>
                                                        <th className="py-3 px-4 md:px-6">Price (MRP / Offer)</th>
                                                        <th className="py-3 px-4 md:px-6">Max Qty</th>
                                                        <th className="py-3 px-4 md:px-6 text-right">Stock Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200/60 bg-white">
                                                    {group.items.map((item, idx) => {
                                                        const isInStock =
                                                            String(item.in_stock).toLowerCase() === "yes" ||
                                                            String(item.in_stock).toLowerCase() === "true" ||
                                                            Number(item.in_stock) > 0;

                                                        return (
                                                            <tr
                                                                key={item.sku_id ? `${item.sku_id}-${idx}` : idx}
                                                                className="hover:bg-amber-50/30 transition-colors"
                                                            >
                                                                {/* Product Details */}
                                                                <td className="py-3.5 px-4 md:px-6">
                                                                    <div className="font-bold text-gray-900">
                                                                        {item.variant_product_name || item.parent_product_name || "Unnamed Product"}
                                                                    </div>
                                                                    {item.parent_product_name &&
                                                                        item.variant_product_name &&
                                                                        item.parent_product_name !== item.variant_product_name && (
                                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                                Parent: {item.parent_product_name}
                                                                            </div>
                                                                        )}
                                                                </td>

                                                                {/* SKU ID */}
                                                                <td className="py-3.5 px-4 md:px-6">
                                                                    <span className="font-mono text-xs bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-medium border border-gray-200">
                                                                        {item.sku_id || "N/A"}
                                                                    </span>
                                                                </td>

                                                                {/* Size */}
                                                                <td className="py-3.5 px-4 md:px-6 font-medium text-gray-700">
                                                                    {item.size || "-"}
                                                                </td>

                                                                {/* Pricing */}
                                                                <td className="py-3.5 px-4 md:px-6">
                                                                    <div className="flex items-baseline gap-2">
                                                                        <span className="font-bold text-gray-900">
                                                                            {item.offer_price ? `₹${item.offer_price}` : "-"}
                                                                        </span>
                                                                        {item.mrp && String(item.mrp) !== String(item.offer_price) && (
                                                                            <span className="text-xs text-gray-400 line-through">
                                                                                ₹{item.mrp}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* Max Cart Qty */}
                                                                <td className="py-3.5 px-4 md:px-6 font-semibold text-gray-700">
                                                                    {item.max_allowed_cart_qty ?? "-"}
                                                                </td>

                                                                {/* Stock Status Badge */}
                                                                <td className="py-3.5 px-4 md:px-6 text-right whitespace-nowrap">
                                                                    {isInStock ? (
                                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 whitespace-nowrap">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                                            In Stock
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200 whitespace-nowrap">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                                                            Out of Stock
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

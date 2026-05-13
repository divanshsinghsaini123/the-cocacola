"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Shop {
    _id: string;
    name: string;
    pincode: number;
    area: string;
    visicooler: string[];
    isActive: boolean;
}

export default function VisicoolerPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch("/api/visicooler");
                const data = await res.json();
                if (data.success) {
                    setShops(data.data);
                } else {
                    toast.error("Failed to fetch shops");
                }
            } catch (error) {
                toast.error("Error fetching shops");
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    const filteredShops = shops.filter((shop) => {
        const query = searchQuery.toLowerCase();
        const visicoolerString = shop.visicooler?.join(", ").toLowerCase() || "";

        return (
            shop.name.toLowerCase().includes(query) ||
            shop.pincode.toString().includes(query) ||
            shop.area.toLowerCase().includes(query) ||
            visicoolerString.includes(query)
        );
    });

    const handleExport = (shop: Shop) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shop, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${shop.name.replace(/\s+/g, '_')}_data.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success(`${shop.name} data exported!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Visicooler Shops</h1>
                    <Link
                        href="/visicooler/createshop"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        Add New Shop
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8 shadow-sm max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all shadow-sm"
                        placeholder="Search by name, area, pincode, or visicooler capacity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Shop List - Horizontal layout */}
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredShops.length > 0 ? (
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x pt-2">
                        {filteredShops.map((shop) => (
                            <div
                                key={shop._id}
                                className="snap-start min-w-[320px] max-w-[320px] md:min-w-[360px] md:max-w-[360px] flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
                            >
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-4 gap-2">
                                        <h2 className="text-xl font-bold text-gray-900 truncate" title={shop.name}>{shop.name}</h2>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${shop.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {shop.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-600 mb-6 flex-grow">
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="font-medium text-gray-500">Area</span>
                                            <span className="text-gray-900 font-medium">{shop.area}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="font-medium text-gray-500">Pincode</span>
                                            <span className="text-gray-900 font-medium">{shop.pincode}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-2">
                                            <span className="font-medium text-gray-500">Visicoolers</span>
                                            <span className="text-gray-900 text-right max-w-[150px] truncate" title={shop.visicooler?.join(', ')}>
                                                {shop.visicooler && shop.visicooler.length > 0
                                                    ? shop.visicooler.join(', ')
                                                    : <span className="text-gray-400 italic">None</span>}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-auto pt-2">
                                        <Link
                                            href={`/visicooler/${shop._id}`}
                                            className="flex-1 flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold"
                                        >
                                            <Eye size={18} />
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleExport(shop)}
                                            className="flex-1 flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg border border-blue-200 transition-colors text-sm font-semibold"
                                        >
                                            <Download size={18} />
                                            Export
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No shops found</h3>
                        <p className="text-gray-500 max-w-sm">We couldn't find any shops matching "{searchQuery}". Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

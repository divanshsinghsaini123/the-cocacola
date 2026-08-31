"use client";

import React from "react";
import Link from "next/link";

interface InventoryPlatform {
    id: string;
    name: string;
    description: string;
    href: string;
    active: boolean;
    badge?: string;
    iconBg: string;
    accentColor: string;
}

const platforms: InventoryPlatform[] = [
    {
        id: "instamart",
        name: "Swiggy Instamart",
        description: "View and manage area pincode inventory, stock availability, and SKUs for Swiggy Instamart.",
        href: "/admin/cloud9_inventory/Instamart_inventory",
        active: true,
        badge: "Active",
        iconBg: "bg-orange-50 text-orange-600 border-orange-100",
        accentColor: "hover:border-orange-300",
    },
    {
        id: "blinkit",
        name: "Blinkit",
        description: "Dark store & quick commerce inventory catalog integration across target pincodes.",
        href: "/admin/cloud9_inventory/Blinkit_inventory",
        active: false,
        badge: "Coming Soon",
        iconBg: "bg-yellow-50 text-yellow-600 border-yellow-100",
        accentColor: "hover:border-yellow-300",
    },
    {
        id: "zepto",
        name: "Zepto",
        description: "10-minute quick delivery inventory levels, stock updates, and pricing controls.",
        href: "/admin/cloud9_inventory/Zepto_inventory",
        active: false,
        badge: "Coming Soon",
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        accentColor: "hover:border-purple-300",
    },
    {
        id: "bigbasket",
        name: "BB Now / BigBasket",
        description: "BigBasket inventory tracking, warehouse fulfillment stock, and SKU listings.",
        href: "/admin/cloud9_inventory/Bigbasket_inventory",
        active: false,
        badge: "Coming Soon",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        accentColor: "hover:border-emerald-300",
    },
    {
        id: "amazon_fresh",
        name: "Amazon Fresh",
        description: "Amazon Fresh quick grocery inventory, ASIN mappings, and regional stock status.",
        href: "/admin/cloud9_inventory/AmazonFresh_inventory",
        active: false,
        badge: "Coming Soon",
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        accentColor: "hover:border-blue-300",
    },
];

export default function Cloud9InventoryPortalPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header Section */}
            <div>
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors mb-4"
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

                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-amber-100 rounded-2xl text-amber-800 shadow-sm">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
                            Cloud9 Inventory Hub
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Select a Quick Commerce platform to view and monitor real-time pincode inventory.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Commerce Platforms Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                    const content = (
                        <div
                            className={`relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-200 flex flex-col justify-between h-full ${platform.active
                                    ? `hover:shadow-md cursor-pointer ${platform.accentColor}`
                                    : "opacity-75 cursor-not-allowed bg-gray-50/50"
                                }`}
                        >
                            <div>
                                {/* Top Badge & Icon */}
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg ${platform.iconBg}`}
                                    >
                                        {platform.name.charAt(0)}
                                    </div>
                                    <span
                                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${platform.active
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-gray-100 text-gray-500 border-gray-200"
                                            }`}
                                    >
                                        {platform.badge}
                                    </span>
                                </div>

                                {/* Platform Title & Description */}
                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                                    {platform.name}
                                </h2>
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                    {platform.description}
                                </p>
                            </div>

                            {/* Action Link Footer */}
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span
                                    className={`text-xs font-bold flex items-center gap-1.5 ${platform.active ? "text-amber-600" : "text-gray-400"
                                        }`}
                                >
                                    {platform.active ? "View Inventory" : "Integration Pending"}
                                    {platform.active && (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    )}
                                </span>
                            </div>
                        </div>
                    );

                    return platform.active ? (
                        <Link key={platform.id} href={platform.href} className="group block">
                            {content}
                        </Link>
                    ) : (
                        <div key={platform.id}>{content}</div>
                    );
                })}
            </div>
        </div>
    );
}

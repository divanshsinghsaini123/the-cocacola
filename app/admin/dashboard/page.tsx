"use client";

import Link from "next/link";

export default function DashboardPortalPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-left space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-lg text-gray-500">Manage your brands, products, and store locations.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Brands Option */}
                <Link
                    href="/admin/brands"
                    className="group relative flex flex-col p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full gap-6">
                        <div className="p-4 bg-red-50 rounded-2xl w-fit group-hover:bg-red-100 transition-colors shadow-sm">
                            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Brands & Products</h3>
                            <p className="text-gray-500 text-base leading-relaxed">
                                Create and manage your brand portfolio. Each brand contains its own set of products and details.
                            </p>
                        </div>

                        <div className="mt-auto pt-4 flex items-center text-sm font-bold text-red-600 tracking-wide uppercase">
                            <span>Manage Brands</span>
                            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* Stores Option */}
                <div className="group relative flex flex-col p-8 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full gap-6">
                        <div className="flex justify-between items-start">
                            <div className="p-4 bg-blue-50 rounded-2xl w-fit group-hover:bg-blue-100 transition-colors shadow-sm">
                                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Stores</h3>
                            </div>
                            <p className="text-gray-500 text-base leading-relaxed">
                                Manage your global network of physical retailers and online partners. Ensure your products are accessible to customers across all distribution channels.
                            </p>
                        </div>

                        <div className="mt-auto pt-4 flex gap-4">
                            <Link
                                href="/admin/stores"
                                className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:text-black transition-all text-center text-sm shadow-sm"
                            >
                                View Stores
                            </Link>
                            <Link
                                href="/admin/stores/add"
                                className="flex-1 px-4 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all text-center text-sm shadow-md"
                            >
                                + New Store
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/src/config/site";

export default function AdminPortalPage() {
    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col justify-between items-center relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-600 rounded-full blur-[150px] opacity-20" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-800 rounded-full blur-[150px] opacity-20" />
            </div>

            <main className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center gap-4 my-auto py-2">
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="h-42 w-64 relative mx-auto mb-1">
                        {/* Assuming this asset exists as it was used in login page */}
                        <Image
                            src="/assets/Home/logo-white-large.svg"
                            alt={SITE_CONFIG.companyName}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Welcome to the <span className="text-red-500">Command Center</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Select your destination to proceed. Manage the application or access the content management system.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    {/* Dashboard Option */}
                    <Link
                        href="/admin/dashboard"
                        className="group relative flex flex-col p-8 rounded-[24px] bg-neutral-900/50 border border-neutral-800 hover:border-red-500/50 transition-all duration-300 hover:bg-neutral-900/80 hover:shadow-2xl hover:shadow-red-900/20 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div className="p-4 bg-neutral-800 rounded-xl w-fit group-hover:bg-red-600 transition-colors duration-300 shadow-lg">
                                {/* Dashboard Icon */}
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">App Dashboard</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-base">
                                    Manage brands, products, stores, and inventory.
                                </p>
                            </div>

                            <div className="flex items-center text-sm font-bold text-red-500 group-hover:text-white transition-colors tracking-widest uppercase">
                                <span>Enter Dashboard</span>
                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Strapi Option */}
                    <a

                        href={process.env.NEXT_PUBLIC_STRAPI_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col p-8 rounded-[24px] bg-neutral-900/50 border border-neutral-800 hover:border-violet-500/50 transition-all duration-300 hover:bg-neutral-900/80 hover:shadow-2xl hover:shadow-violet-900/20 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div className="p-4 bg-neutral-800 rounded-xl w-fit group-hover:bg-violet-600 transition-colors duration-300 shadow-lg">
                                {/* CMS Icon (Layout/UI) */}
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">Strapi CMS</h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors text-base">
                                    Access the content management system to edit pages and UI elements.
                                </p>
                            </div>

                            <div className="flex items-center text-sm font-bold text-violet-500 group-hover:text-white transition-colors tracking-widest uppercase">
                                <span>Login to Strapi</span>
                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </div>
                        </div>
                    </a>
                </div>
            </main>

            {/* Portal Footer */}
            <footer className="relative z-10 w-full py-6 border-t border-neutral-900/50 text-center text-xs text-neutral-500 font-medium tracking-wide">
                <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        {SITE_CONFIG.copyrightText}
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="hover:text-white transition-colors">
                            Back to Website
                        </Link>
                        <span className="text-neutral-800">•</span>
                        <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                            Admin Dashboard
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

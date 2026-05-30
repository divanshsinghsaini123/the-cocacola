"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/src/config/site";

export default function AdminPortalPage() {
    const [dbLoading, setDbLoading] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);
    const [dbStatus, setDbStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [fileStatus, setFileStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleDbBackup = async () => {
        setDbLoading(true);
        setDbStatus(null);
        try {
            const res = await fetch("/api/admin/cron/database_backup", {
                method: "POST",
            });
            const data = await res.json();
            setDbStatus({
                success: res.ok,
                message: data.message || (res.ok ? "Backup triggered successfully!" : "Backup trigger failed."),
            });
        } catch (error) {
            setDbStatus({
                success: false,
                message: "An unexpected error occurred while starting backup.",
            });
        } finally {
            setDbLoading(false);
        }
    };

    const handleFileBackup = async () => {
        setFileLoading(true);
        setFileStatus(null);
        try {
            const res = await fetch("/api/admin/cron/file_backup", {
                method: "POST",
            });
            const data = await res.json();
            setFileStatus({
                success: res.ok,
                message: data.message || (res.ok ? "File backup triggered successfully!" : "File backup trigger failed."),
            });
        } catch (error) {
            setFileStatus({
                success: false,
                message: "An unexpected error occurred while starting file backup.",
            });
        } finally {
            setFileLoading(false);
        }
    };
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

                {/* Backup Command Center Box */}
                <div className="w-full max-w-4xl p-6 md:p-8 rounded-[24px] bg-neutral-900/40 border border-neutral-800/80 hover:border-red-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                On-Demand System Backups
                            </h3>
                            <p className="text-gray-400 text-sm max-w-xl">
                                Dispatch automated workflows to archive system databases or back up media content directly to safe storage targets.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            {/* Database Backup Button */}
                            <button
                                onClick={handleDbBackup}
                                disabled={dbLoading}
                                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800/80 disabled:text-gray-500 rounded-xl text-white font-semibold transition-all duration-300 text-sm shadow-lg shadow-red-900/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                            >
                                {dbLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Backing up DB...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                        </svg>
                                        Strapi DB Backup
                                    </>
                                )}
                            </button>

                            {/* Media Files Backup Button */}
                            <button
                                onClick={handleFileBackup}
                                disabled={fileLoading}
                                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-800/80 disabled:text-gray-500 border border-neutral-700 hover:border-neutral-600 rounded-xl text-white font-semibold transition-all duration-300 text-sm shadow-lg active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                            >
                                {fileLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Backing up files...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Media Files Backup
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Status Logs */}
                    {(dbStatus || fileStatus) && (
                        <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-col gap-2">
                            {dbStatus && (
                                <div className={`text-sm flex items-center gap-2 ${dbStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${dbStatus.success ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                                    <strong>DB Backup:</strong> {dbStatus.message}
                                </div>
                            )}
                            {fileStatus && (
                                <div className={`text-sm flex items-center gap-2 ${fileStatus.success ? 'text-green-400' : 'text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${fileStatus.success ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                                    <strong>Media Backup:</strong> {fileStatus.message}
                                </div>
                            )}
                        </div>
                    )}
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

"use client";

import React from "react";
import AdminNavbar from "./_components/AdminNavbar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE_CONFIG } from "@/src/config/site";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login" || pathname === "/admin/portal";

    return (
        <section className="min-h-screen bg-gray-50 flex flex-col justify-between">
            <div className="flex-grow flex flex-col">
                {!isLoginPage && <AdminNavbar />}
                <main className={!isLoginPage ? "p-4 md:p-8 flex-grow" : "flex-grow"}>
                    {children}
                </main>
            </div>
            {!isLoginPage && (
                <footer className="w-full py-5 border-t border-gray-200 bg-white text-center text-xs text-gray-500 font-medium tracking-wide">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            {SITE_CONFIG.copyrightText}
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/" className="hover:text-black transition-colors">
                                Back to Website
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link href="/admin/portal" className="hover:text-black transition-colors">
                                Command Center
                            </Link>
                        </div>
                    </div>
                </footer>
            )}
        </section>
    );
}

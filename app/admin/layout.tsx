"use client";

import React from "react";
import AdminNavbar from "./_components/AdminNavbar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    return (
        <section className="min-h-screen bg-gray-50">
            {!isLoginPage && <AdminNavbar />}
            <main className={!isLoginPage ? "p-8" : ""}>
                {children}
            </main>
        </section>
    );
}

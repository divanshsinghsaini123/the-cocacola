"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/auth", {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/admin/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-white border-b shadow-sm">
            <Link href="/admin/dashboard" className="text-xl md:text-2xl font-bold text-[#F40009] tracking-tight">
                Coca-Cola Admin
            </Link>
            <div>
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-semibold text-white transition-colors bg-black rounded-full hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "..." : "Logout"}
                </button>
            </div>
        </nav>
    );
}

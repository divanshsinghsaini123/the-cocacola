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
                method: "POST",
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
        <nav className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
            <Link href="/admin/dashboard" className="text-2xl font-bold text-[#F40009] tracking-tight">
                Coca-Cola Admin
            </Link>
            <div>
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="px-5 py-2 text-sm font-semibold text-white transition-colors bg-black rounded-full hover:bg-gray-800 disabled:opacity-50"
                >
                    {loading ? "..." : "Logout"}
                </button>
            </div>
        </nav>
    );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import React from "react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    // 1️⃣ No token → redirect
    if (!token) {
        redirect("/admin/login");
    }

    // 2️⃣ Invalid token → redirect
    try {
        jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        redirect("/admin/login");
    }

    // 3️⃣ Token valid → render admin UI
    return (
        <section>
            {children}
        </section>
    );
}

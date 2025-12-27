import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!token) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};

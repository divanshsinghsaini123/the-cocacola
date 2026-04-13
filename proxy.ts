import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    const calc_token = req.cookies.get("calc_token")?.value;
    //protect calculator routes 
    if (req.nextUrl.pathname.startsWith("/calc")) {
        // If user is accessing login page
        if (req.nextUrl.pathname === "/calc") {
            if (calc_token) {
                try {
                    jwt.verify(calc_token, process.env.JWT_SECRET!);
                    return NextResponse.redirect(new URL("/calc/dashboard", req.url));
                } catch (err) {
                    // Invalid token, just show login page
                    return NextResponse.next();
                }
            }
            return NextResponse.next();
        }

        if (!calc_token) {
            return NextResponse.redirect(new URL("/calc", req.url));
        }

        try {
            jwt.verify(calc_token, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL("/calc", req.url));
        }
    }
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
        // If user is accessing login page
        if (req.nextUrl.pathname === "/admin/login") {
            if (token) {
                try {
                    jwt.verify(token, process.env.JWT_SECRET!);
                    return NextResponse.redirect(new URL("/admin/portal", req.url));
                } catch (err) {
                    // Invalid token, just show login page
                    return NextResponse.next();
                }
            }
            return NextResponse.next();
        }

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
    matcher: ["/admin/:path*", "/calc/:path*"],
};


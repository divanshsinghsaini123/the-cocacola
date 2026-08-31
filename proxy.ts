import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("admin_token")?.value;
    const calc_token = req.cookies.get("calc_token")?.value;
    const { pathname } = req.nextUrl;
    if (pathname == "/mirzapur") {
        return NextResponse.redirect(new URL("/Campaigns/mirzapur", req.url));
    }
    // ---- Protect /api/admin/* (cookie-based, JSON 401 responses) ----
    if (pathname.startsWith("/api/admin")) {
        // Endpoints that MUST stay public (login / password recovery):
        const isPublic =
            pathname === "/api/admin/auth" ||            // login + logout
            pathname === "/api/admin/calc" ||            // calc login
            pathname === "/api/admin/verify" ||          // admin credential verification
            // pathname === "/api/admin/cloud9_inventory" || // cloud9 inventory proxy
            pathname.startsWith("/api/admin/forgot-password");

        if (isPublic) {
            return NextResponse.next();
        }

        // calc sub-routes are used by calc users -> verify calc_token,
        // everything else -> verify admin_token
        const isCalcApi = pathname.startsWith("/api/admin/calc/");
        const authCookie = isCalcApi ? calc_token : token;

        if (!authCookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        try {
            jwt.verify(authCookie, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    //protect calculator routes 
    if (pathname.startsWith("/calc")) {
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
        //here i am decoding the token to verify the role 
        let decodedToken: any = null;
        if (token) {
            try {
                decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
            } catch (err) {
                return NextResponse.redirect(new URL("/admin/login", req.url));
            }
        }

        // 1. If accessing login page
        if (req.nextUrl.pathname === "/admin/login") {
            if (decodedToken) {
                if (decodedToken.role === "ecom") {
                    return NextResponse.redirect(new URL("/admin/cloud9_inventory", req.url));
                }
                return NextResponse.redirect(new URL("/admin/portal", req.url));
            }
            return NextResponse.next();
        }

        // 2. If no valid token, redirect to login page
        if (!decodedToken) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }

        // 3. Strict Role-Based Route Protection for 'ecom' role
        if (decodedToken.role === "ecom") {
            // Allow ONLY /admin/cloud9_inventory and its sub-routes
            const isAllowedEcomRoute = req.nextUrl.pathname.startsWith("/admin/cloud9_inventory");
            if (!isAllowedEcomRoute) {
                return NextResponse.redirect(new URL("/admin/cloud9_inventory", req.url));
            }
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/calc/:path*", "/api/admin/:path*", "/mirzapur/:path*"],
};


import { NextResponse } from "next/server";

export async function GET() {
    try {
        const n8nUrl = "https://n8.thecoreteam.in/webhook/d10e5784-4333-4da5-9382-e7f78dce3401";
        const res = await fetch(n8nUrl, {
            cache: "no-store",
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => null);
            const errorMessage = errData?.message || res.statusText || "Upstream webhook error";
            return NextResponse.json(
                { error: `n8n Webhook Error (${res.status}): ${errorMessage}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("API proxy error fetching Cloud9 inventory:", error);
        return NextResponse.json(
            { error: error.message || "Failed to connect to n8n webhook API" },
            { status: 500 }
        );
    }
}

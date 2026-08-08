import { NextResponse } from "next/server";

export async function GET() {
    try {
        const n8nUrl = "https://n8.thecoreteam.in/webhook/a7e4799d-1a16-4c16-aa8d-467cec3e5479";
        const res = await fetch(n8nUrl, {
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: `Webhook upstream error: ${res.statusText}` },
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

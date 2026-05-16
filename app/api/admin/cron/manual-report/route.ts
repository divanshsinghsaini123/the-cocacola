import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const shopId = searchParams.get("shopId");

        if (!shopId) {
            return NextResponse.json({ error: "shopId is required" }, { status: 400 });
        }

        const shopData = await shop.findById(shopId);

        if (!shopData) {
            return NextResponse.json({ error: "Shop not found" }, { status: 404 });
        }

        const cdnUrl = process.env.NEXT_PUBLIC_GCORE_CDN_URL || "";
        
        let csvContent = "Shop Name,Area,Pincode,Mobile,Email,Image URL,Upload Date,Upload Time\n";
        
        const shopName = `"${shopData.name.replace(/"/g, '""')}"`;
        const area = `"${shopData.area.replace(/"/g, '""')}"`;
        const pincode = shopData.pincode;
        const mobile = shopData.mobileNumber || "N/A";
        const email = shopData.email ? `"${shopData.email}"` : "N/A";

        if (shopData.images && shopData.images.length > 0) {
            shopData.images.forEach((img: any) => {
                const dateObj = new Date(img.uploadedAt);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();
                const fullUrl = `${cdnUrl}/${img.url}`;
                csvContent += `${shopName},${area},${pincode},${mobile},${email},"${fullUrl}",${date},${time}\n`;
            });
        } else {
            csvContent += `${shopName},${area},${pincode},${mobile},${email},No Images,N/A,N/A\n`;
        }

        const headers = new Headers();
        headers.set('Content-Type', 'text/csv');
        // Force browser to download the file instead of displaying it
        headers.set('Content-Disposition', `attachment; filename="${shopData.name.replace(/\s+/g, '_')}_Report.csv"`);

        return new NextResponse(csvContent, { status: 200, headers });

    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

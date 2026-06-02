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
        
        let csvContent = "Shop Name,Area,Pincode,Mobile,Email,ASM Name,SE Name,Image URL,Upload Date,Upload Time\n";
        
        const nameStr = shopData.outletDetails?.shopName || "N/A";
        const areaStr = shopData.outletDetails?.area || "N/A";
        const emailStr = shopData.outletDetails?.email || "N/A";
        const mobileStr = shopData.outletDetails?.mobileNumber || "N/A";

        const shopName = `"${nameStr.replace(/"/g, '""')}"`;
        const area = `"${areaStr.replace(/"/g, '""')}"`;
        const pincode = shopData.outletDetails?.pincode || "N/A";
        const mobile = mobileStr || "N/A";
        const email = emailStr ? `"${emailStr}"` : "N/A";
        const asm = shopData.asm ? `"${shopData.asm.replace(/"/g, '""')}"` : "N/A";
        const se = shopData.se ? `"${shopData.se.replace(/"/g, '""')}"` : "N/A";

        if (shopData.images && shopData.images.length > 0) {
            shopData.images.forEach((img: any) => {
                const dateObj = new Date(img.uploadedAt);
                const date = dateObj.toLocaleDateString();
                const time = dateObj.toLocaleTimeString();
                const fullUrl = `${cdnUrl}/${img.url}`;
                csvContent += `${shopName},${area},${pincode},${mobile},${email},${asm},${se},"${fullUrl}",${date},${time}\n`;
            });
        } else {
            csvContent += `${shopName},${area},${pincode},${mobile},${email},${asm},${se},No Images,N/A,N/A\n`;
        }

        const headers = new Headers();
        headers.set('Content-Type', 'text/csv');
        // Force browser to download the file instead of displaying it
        headers.set('Content-Disposition', `attachment; filename="${nameStr.replace(/\s+/g, '_')}_Report.csv"`);

        return new NextResponse(csvContent, { status: 200, headers });

    } catch (error: any) {
        console.error("Export Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

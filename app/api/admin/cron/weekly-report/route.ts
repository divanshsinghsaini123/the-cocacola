import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";
import nodemailer from "nodemailer";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

export async function POST(request: Request) {
    try {
        // 1. Verify the Secret Key

        //request hit hui , 
        // console.log("request hit hui");
        const authHeader = request.headers.get("Authorization");
        if (authHeader !== "MY_SUPER_SECRET_CRON_KEY_WEEKLY") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // 2. Find shops with NO images uploaded in the last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const shopsPendingPhotos = await shop.find({
            "images.uploadedAt": { $not: { $gte: oneWeekAgo } },
            isActive: true
        });

        // 3. Generate CSV
        let csvContent = "Shop ID,Shop Name,Area,Pincode,Mobile,Email,ASM Name,SE Name\n";

        shopsPendingPhotos.forEach(s => {
            // Escape commas in names/areas/ASMs/SEs
            const name = `"${s.name.replace(/"/g, '""')}"`;
            const area = `"${s.area.replace(/"/g, '""')}"`;
            const mobile = s.mobileNumber || "N/A";
            const email = s.email ? `"${s.email}"` : "N/A";
            const asm = s.asm ? `"${s.asm.replace(/"/g, '""')}"` : "N/A";
            const se = s.se ? `"${s.se.replace(/"/g, '""')}"` : "N/A";
            csvContent += `${s._id},${name},${area},${s.pincode},${mobile},${email},${asm},${se}\n`;
        });


        // 4. Find shops WITH images uploaded in the last 7 days
        const shopsWithRecentPhotos = await shop.find({
            "images.uploadedAt": { $gte: oneWeekAgo },
            isActive: true
        });

        // 5. Generate CSV for shops WITH recent photos
        let csvContentSuccess = "Shop ID,Shop Name,Area,Pincode,Mobile,Email,ASM Name,SE Name,Recent Image Links\n";

        const cdnUrl = process.env.NEXT_PUBLIC_GCORE_CDN_URL || "";

        shopsWithRecentPhotos.forEach(s => {
            const name = `"${s.name.replace(/"/g, '""')}"`;
            const area = `"${s.area.replace(/"/g, '""')}"`;
            const mobile = s.mobileNumber || "N/A";
            const email = s.email ? `"${s.email}"` : "N/A";
            const asm = s.asm ? `"${s.asm.replace(/"/g, '""')}"` : "N/A";
            const se = s.se ? `"${s.se.replace(/"/g, '""')}"` : "N/A";

            // Get only the images uploaded this week
            const recentImages = s.images.filter((img: any) => new Date(img.uploadedAt) >= oneWeekAgo);

            // Create a pipe-separated string of full image URLs
            const imageUrls = recentImages.map((img: any) => `${cdnUrl}/${img.url}`).join(" | ");

            csvContentSuccess += `${s._id},${name},${area},${s.pincode},${mobile},${email},${asm},${se},"${imageUrls}"\n`;
        });

        // 6. Send Email using Nodemailer
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
        } else {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS, // NOTE: Use a Google App Password, not your real password
                },
            });

            // Generate detailed lists for email body
            let pendingDetails = "Shops Pending Photos:\n";
            if (shopsPendingPhotos.length > 0) {
                shopsPendingPhotos.forEach((s, idx) => {
                    pendingDetails += `${idx + 1}. ${s.name} (Area: ${s.area}, ASM: ${s.asm || 'N/A'})\n`;
                });
            } else {
                pendingDetails += "None. All active shops have uploaded photos this week!\n";
            }

            let successDetails = "Shops with Recent Photos:\n";
            if (shopsWithRecentPhotos.length > 0) {
                shopsWithRecentPhotos.forEach((s, idx) => {
                    successDetails += `${idx + 1}. ${s.name} (Area: ${s.area}, ASM: ${s.asm || 'N/A'})\n`;
                });
            } else {
                successDetails += "None. No shops have uploaded photos this week.\n";
            }

            const emailTextBody = `Hello,\n\nPlease find the weekly Visicooler reports attached.\n\nSummary:\n- ${shopsPendingPhotos.length} shops have NOT uploaded photos this week.\n- ${shopsWithRecentPhotos.length} shops HAVE uploaded photos this week.\n\n============================================\n\n${pendingDetails}\n\n============================================\n\n${successDetails}\n\nBest,\nSystem Administrator`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.REPORT_EMAIL_TO || process.env.EMAIL_USER, // Set multiple emails separated by commas in .env
                subject: `Visicooler Weekly Report - ${new Date().toLocaleDateString()}`,
                text: emailTextBody,
                attachments: [
                    {
                        filename: "Pending_Photos_Report.csv",
                        content: Buffer.from(csvContent, "utf-8"),
                    },
                    {
                        filename: "Successful_Photos_Report.csv",
                        content: Buffer.from(csvContentSuccess, "utf-8"),
                    }
                ]
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
        }

        return NextResponse.json({
            success: true,
            message: `Found ${shopsPendingPhotos.length} shops without photos and ${shopsWithRecentPhotos.length} shops with photos.`,
            csvPreviewPending: csvContent, // Just for testing
            csvPreviewSuccess: csvContentSuccess // Just for testing
        });

    } catch (error: any) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}




import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { shop } from "@/src/models/visicooler/shop";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        // 1. Verify the Secret Key
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
        let csvContent = "Shop ID,Shop Name,Area,Pincode,Mobile,Email\n";

        shopsPendingPhotos.forEach(s => {
            // Escape commas in names/areas
            const name = `"${s.name.replace(/"/g, '""')}"`;
            const area = `"${s.area.replace(/"/g, '""')}"`;
            const mobile = s.mobileNumber || "N/A";
            const email = s.email ? `"${s.email}"` : "N/A";
            csvContent += `${s._id},${name},${area},${s.pincode},${mobile},${email}\n`;
        });


        // 4. Find shops WITH images uploaded in the last 7 days
        const shopsWithRecentPhotos = await shop.find({
            "images.uploadedAt": { $gte: oneWeekAgo },
            isActive: true
        });

        // 5. Generate CSV for shops WITH recent photos
        let csvContentSuccess = "Shop ID,Shop Name,Area,Pincode,Mobile,Email,Recent Image Links\n";

        const cdnUrl = process.env.NEXT_PUBLIC_GCORE_CDN_URL || "";

        shopsWithRecentPhotos.forEach(s => {
            const name = `"${s.name.replace(/"/g, '""')}"`;
            const area = `"${s.area.replace(/"/g, '""')}"`;
            const mobile = s.mobileNumber || "N/A";
            const email = s.email ? `"${s.email}"` : "N/A";

            // Get only the images uploaded this week
            const recentImages = s.images.filter((img: any) => new Date(img.uploadedAt) >= oneWeekAgo);

            // Create a pipe-separated string of full image URLs
            const imageUrls = recentImages.map((img: any) => `${cdnUrl}/${img.url}`).join(" | ");

            csvContentSuccess += `${s._id},${name},${area},${s.pincode},${mobile},${email},"${imageUrls}"\n`;
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

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.REPORT_EMAIL_TO || process.env.EMAIL_USER, // Who receives the report
                subject: `Visicooler Weekly Report - ${new Date().toLocaleDateString()}`,
                text: `Hello,\n\nPlease find the weekly Visicooler reports attached.\n\nSummary:\n- ${shopsPendingPhotos.length} shops have NOT uploaded photos this week.\n- ${shopsWithRecentPhotos.length} shops HAVE uploaded photos this week.\n\nBest,\nSystem Administrator`,
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

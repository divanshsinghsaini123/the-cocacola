import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { s3 } from "@/src/lib/gcore";
import { connectDB } from "@/src/lib/mongoose";
import { Mirzapur } from "@/src/models/Mirzapur";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const specialCode = formData.get("specialCode") as string;
        const bottleImage = formData.get("bottleImage") as File;

        if (!name || !phone || !specialCode || !bottleImage) {
            return NextResponse.json(
                { error: "All fields (Name, Phone, Special Code, Bottle Image) are required." },
                { status: 400 }
            );
        }

        // Validate image size (max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (bottleImage.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "Image file size exceeds 5MB limit." },
                { status: 400 }
            );
        }

        // 1. Process & Upload Image to Gcore S3
        const buffer = Buffer.from(await bottleImage.arrayBuffer());
        let uploadBuffer: Buffer = buffer;
        let fileContentType = bottleImage.type || "image/jpeg";
        let fileName = bottleImage.name
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "");

        // Convert image to WebP format using Sharp for optimization
        try {
            uploadBuffer = await sharp(buffer)
                .webp({ quality: 80 })
                .toBuffer();
            fileContentType = "image/webp";
            fileName = fileName.replace(/\.[^.]+$/, "") + ".webp";
        } catch (sharpErr) {
            console.error("Failed to convert image to webp, uploading raw buffer:", sharpErr);
        }

        const gcoreKey = `mirzapur/${Date.now()}-${fileName}`;

        const uploadParams = {
            Bucket: process.env.GCORE_BUCKET_NAME,
            Key: gcoreKey,
            Body: uploadBuffer,
            ContentType: fileContentType,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        const cdnBase = process.env.NEXT_PUBLIC_GCORE_CDN_URL || "";
        const fullImageUrl = cdnBase ? `${cdnBase.replace(/\/$/, "")}/${gcoreKey}` : gcoreKey;

        // 2. Save submission to MongoDB in 'mirzapur' collection
        await connectDB();
        const entry = await Mirzapur.create({
            name,
            phone,
            specialCode,
            bottleImageUrl: fullImageUrl,
        });

        // 3. Sync submission to Google Sheet via Webhook (if configured)
        const sheetWebhookUrl = process.env.GOOGLE_SHEET_MIRZAPUR_WEBHOOK_URL;
        if (sheetWebhookUrl) {
            try {
                await fetch(sheetWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        phone,
                        specialCode,
                        bottleImageUrl: fullImageUrl,
                        submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                    }),
                });
            } catch (sheetErr) {
                console.error("Failed to sync entry to Google Sheet:", sheetErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Your entry has been accepted! We will let you know within 10 days.",
            data: entry,
        });

    } catch (err: any) {
        console.error("Mirzapur API Submission Error:", err);
        return NextResponse.json(
            { error: "Failed to submit entry: " + err.message },
            { status: 500 }
        );
    }
}

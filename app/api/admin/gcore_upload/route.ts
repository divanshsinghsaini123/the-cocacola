import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { s3, deleteFromGcore } from "@/src/lib/gcore";

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string;

        if (!file || !folder) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        // 5MB limit (original file)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        // Validate folder
        if (!["brands", "products", "stores", "visicooler", "visicooler_docs", "visicooler_monthly"].includes(folder)) {
            return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
        }

        // Original buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        const isImage = file.type && file.type.startsWith("image/");
        let uploadBuffer: any = buffer;
        let fileContentType = file.type || "application/octet-stream";
        let baseName = file.name
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "");

        if (isImage) {
            try {
                uploadBuffer = await sharp(buffer)
                    .webp({ quality: 80 })
                    .toBuffer();
                fileContentType = "image/webp";
                baseName = baseName.replace(/\.[^.]+$/, "") + ".webp";
            } catch (sharpErr) {
                console.error("Failed to convert image to webp, uploading raw:", sharpErr);
            }
        }

        const filePath = `${folder}/${Date.now()}-${baseName}`;

        const uploadParams = {
            Bucket: process.env.GCORE_BUCKET_NAME,
            Key: filePath,
            Body: uploadBuffer,
            ContentType: fileContentType,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        return NextResponse.json({
            success: true,
            url: filePath,
        });

    } catch (err: any) {
        console.error("Gcore Upload Error:", err);

        let errorMessage = err.message;
        if (err.$response && err.$response.statusCode) {
            errorMessage += ` (Gcore returned HTTP ${err.$response.statusCode})`;
        }

        return NextResponse.json(
            { error: "Upload failed: " + errorMessage },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ error: "Missing file URL or key" }, { status: 400 });
        }

        await deleteFromGcore(url);

        return NextResponse.json({ success: true, message: "File deleted successfully" });
    } catch (err: any) {
        console.error("Gcore Delete Error:", err);
        return NextResponse.json({ error: "Delete failed: " + err.message }, { status: 500 });
    }
}



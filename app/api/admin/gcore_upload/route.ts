import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
// Initialize S3 Client for Gcore
const s3 = new S3Client({
    region: process.env.GCORE_REGION, // Default region if not specified
    endpoint: process.env.GCORE_ENDPOINT, // e.g. https://s3.gcore.com
    credentials: {
        accessKeyId: process.env.GCORE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.GCORE_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true // Gcore often requires path style
});

/**
 * Deletes a file from Gcore S3 bucket.
 * @param fileKey The key (path) of the file to delete (e.g., "brands/image.png")
 */
export async function deleteFromGcore(fileKey: string | undefined | null) {
    if (!fileKey) return;

    try {
        // Handle full URLs if passed by mistake, though DB should store relative paths
        const cdnUrl = process.env.NEXT_PUBLIC_GCORE_CDN_URL;
        let key = fileKey;

        if (cdnUrl && key.startsWith(cdnUrl)) {
            key = key.replace(cdnUrl, "");
        }

        // Remove leading slash if present
        if (key.startsWith("/")) {
            key = key.substring(1);
        }

        const params = {
            Bucket: process.env.GCORE_BUCKET_NAME,
            Key: key,
        };

        await s3.send(new DeleteObjectCommand(params));
        console.log(`Deleted file from Gcore: ${key}`);
    } catch (error) {
        console.error(`Failed to delete file from Gcore: ${fileKey}`, error);
    }
}

/**
 * Deletes multiple files from Gcore S3 bucket.
 * @param fileKeys Array of keys to delete
 */
export async function deleteFilesFromGcore(fileKeys: string[]) {
    if (!fileKeys || fileKeys.length === 0) return;
    await Promise.all(fileKeys.map(key => deleteFromGcore(key)));
}

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
        if (!["brands", "products", "stores"].includes(folder)) {
            return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
        }

        // Original buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 🔥 CONVERT TO WEBP HERE
        const webpBuffer = await sharp(buffer)
            .webp({ quality: 80 })
            .toBuffer();

        // Clean filename & force .webp
        const baseName = file.name
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9.-]/g, "")
            .replace(/\.[^.]+$/, "");

        const filePath = `${folder}/${Date.now()}-${baseName}.webp`;

        const uploadParams = {
            Bucket: process.env.GCORE_BUCKET_NAME,
            Key: filePath,
            Body: webpBuffer,
            ContentType: "image/webp",
        };

        await s3.send(new PutObjectCommand(uploadParams));

        return NextResponse.json({
            success: true,
            url: filePath,
        });

    } catch (err: any) {
        console.error("Gcore Upload Error:", err);
        return NextResponse.json(
            { error: "Upload failed: " + err.message },
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

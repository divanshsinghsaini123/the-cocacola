import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client for Gcore
export const s3 = new S3Client({
    region: process.env.GCORE_REGION, // Default region if not specified
    endpoint: process.env.GCORE_ENDPOINT, // e.g. https://s3.gcore.com
    credentials: {
        accessKeyId: process.env.GCORE_ACCESS_KEY_ID!,
        secretAccessKey: process.env.GCORE_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: false // Changed to false: Gcore often prefers virtual-hosted style (bucket.endpoint.com)
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

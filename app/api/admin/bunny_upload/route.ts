// app/api/upload/route.ts
import { NextResponse } from "next/server";
import https from "https";

export async function PUT(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string;

        if (!file || !folder) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        if (!["brands", "products", "stores"].includes(folder)) {
            return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = `${folder}/${Date.now()}-${file.name}`;

        const options = {
            method: "PUT",
            host: "sg.storage.bunnycdn.com", // Updated to SG region based on your config
            path: `/${process.env.BUNNY_STORAGE_ZONE}/${filePath}`,
            headers: {
                AccessKey: process.env.BUNNY_STORAGE_API_KEY!,
                "Content-Type": "application/octet-stream",
                "Content-Length": buffer.length,
            },
        };

        await new Promise<void>((resolve, reject) => {
            const reqUpload = https.request(options, (res) => {
                let colResponse = "";
                res.on("data", (chunk) => { colResponse += chunk; });
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 300) {
                        reject(new Error(`Bunny Error ${res.statusCode}: ${colResponse}`));
                    } else {
                        resolve();
                    }
                });
            });

            reqUpload.on("error", reject);
            reqUpload.write(buffer);
            reqUpload.end();
        });

        const url = `${process.env.BUNNY_PULL_ZONE}/${filePath}`;
        console.log(url);
        return NextResponse.json({ success: true, url });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

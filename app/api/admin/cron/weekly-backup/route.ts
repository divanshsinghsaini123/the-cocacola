import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { spawn } from "child_process";
import { promisify } from "util";
import { pipeline as pipelineCb } from "stream";
import { createGzip } from "zlib";
import os from "os";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

const pipeline = promisify(pipelineCb as any);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== "MY_SUPER_SECRET_CRON_KEY_WEEKLY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUrl = process.env.DATABASE_URL || process.env.PG_CONN || "";
    if (!dbUrl) {
      console.error("Missing DATABASE_URL / PG_CONN environment variable");
      return NextResponse.json({ error: "Missing database connection string" }, { status: 500 });
    }

    const tmpDir = os.tmpdir();
    const timestamp = Date.now();
    const dumpFile = path.join(tmpDir, `pg_dump_${timestamp}.sql`);
    const gzFile = `${dumpFile}.gz`;

    // Run pg_dump. Requires `pg_dump` to be available on the server.
    await new Promise<void>((resolve, reject) => {
      const args = ["-d", dbUrl, "-f", dumpFile, "--format=plain", "--no-owner", "--no-privileges"];
      const proc = spawn("pg_dump", args, { stdio: ["ignore", "pipe", "pipe"] });

      let stderr = "";
      proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));

      proc.on("error", (err) => reject(err));
      proc.on("close", (code) => {
        if (code === 0) return resolve();
        const err = new Error(`pg_dump exited with code ${code}: ${stderr}`);
        return reject(err);
      });
    }).catch((err: any) => {
      console.error("pg_dump failed:", err?.message || err);
      throw new Error("pg_dump failed. Ensure `pg_dump` is installed and DATABASE_URL is correct.");
    });

    // Gzip the dump
    await pipeline(fs.createReadStream(dumpFile), createGzip(), fs.createWriteStream(gzFile));

    const dumpBuffer = await fsPromises.readFile(gzFile);

    // Send email with attachment
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.REPORT_EMAIL_TO || process.env.EMAIL_USER,
        subject: `Postgres Weekly Backup - ${new Date().toLocaleDateString()}`,
        text: `Attached is the Postgres backup (gzipped SQL) for ${new Date().toLocaleDateString()}`,
        attachments: [
          {
            filename: `postgres_backup_${timestamp}.sql.gz`,
            content: dumpBuffer,
          },
        ],
      } as any;

      await transporter.sendMail(mailOptions);
      console.log("Backup email sent successfully");
    }

    // Cleanup
    try {
      await fsPromises.unlink(dumpFile).catch(() => null);
      await fsPromises.unlink(gzFile).catch(() => null);
    } catch {}

    return NextResponse.json({ success: true, message: "Backup created and emailed (if email configured)" });
  } catch (error: any) {
    console.error("Weekly backup error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

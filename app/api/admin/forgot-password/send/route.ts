import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { Admin } from "@/src/models/Admin";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        await connectDB();

        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Find admin by username or email
        const admin = await Admin.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });

        if (!admin) {
            return NextResponse.json({ error: "No account found with that username" }, { status: 404 });
        }

        // Determine recipient list
        let emailList: string[] = [];

        // 1. Prioritize/Include emails from REPORT_EMAIL_TO
        if (process.env.REPORT_EMAIL_TO) {
            const envEmails = process.env.REPORT_EMAIL_TO.split(",")
                .map(e => e.trim())
                .filter(Boolean);
            emailList.push(...envEmails);
        }

        // 2. Include admin's database email if configured
        if (admin.email) {
            const adminEmailClean = admin.email.trim();
            if (adminEmailClean && !emailList.some(e => e.toLowerCase() === adminEmailClean.toLowerCase())) {
                emailList.push(adminEmailClean);
            }
        }

        // 3. Fallback to EMAIL_USER if no other emails configured
        if (emailList.length === 0 && process.env.EMAIL_USER) {
            emailList.push(process.env.EMAIL_USER.trim());
        }

        if (emailList.length === 0) {
            return NextResponse.json({
                error: "No email address is configured for password recovery. Please contact the administrator."
            }, { status: 400 });
        }

        const recipientString = emailList.join(", ");

        // Generate 6-digit numeric verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Code expiration: 10 minutes from now
        admin.resetCode = code;
        admin.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
        await admin.save();

        // Configure Nodemailer transporter
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
            return NextResponse.json({
                error: "SMTP server is misconfigured. Please check environment variables."
            }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content with premium Coca-Cola aesthetic styling
        const emailHtmlBody = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #F40009; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Cloud9</h2>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">Security Verification Portal</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 25px;" />
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                    Hello <strong>${admin.username}</strong>,
                </p>
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 25px;">
                    We received a request to reset your administrator portal password. Use the verification code below to authorize this request:
                </p>
                <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 10px; border: 1px dashed #cccccc;">
                    <span style="font-size: 36px; font-weight: 800; color: #111111; letter-spacing: 6px; font-family: monospace;">${code}</span>
                </div>
                <p style="font-size: 13px; color: #888888; text-align: center; line-height: 1.4; margin-bottom: 30px;">
                    This code is highly sensitive and will expire in <strong>10 minutes</strong>. 
                    <br />If you did not initiate this request, you can safely ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;" />
                <div style="text-align: center; font-size: 11px; color: #999999;">
                    This is an automated security message. Please do not reply directly to this email.
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Cloud9 Security" <${process.env.EMAIL_USER}>`,
            to: recipientString,
            subject: `[Verification Code: ${code}] Cloud9 Portal Password Reset`,
            html: emailHtmlBody,
        });

        // Mask recipient emails for privacy
        const maskedEmails = emailList.map(email => {
            const parts = email.split("@");
            if (parts.length !== 2) return email;
            const name = parts[0];
            const domain = parts[1];
            if (name.length <= 2) {
                return `${name[0]}*@${domain}`;
            }
            return `${name.substring(0, 2)}***${name.substring(name.length - 1)}@${domain}`;
        }).join(", ");

        return NextResponse.json({
            message: "Verification code sent successfully",
            email: maskedEmails,
            username: admin.username, // return standard username if email matched
        });

    } catch (error: any) {
        console.error("Forgot password send code error:", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

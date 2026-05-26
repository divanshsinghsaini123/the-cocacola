import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongoose";
import { VisicoolerOtp } from "@/src/models/visicooler/otp";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();
        const { action, name, pincode, area, mobileNumber, email, visicooler, asm, se } = body;

        // 1. Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Set expiry to 20 minutes from now
        const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

        // 3. Register OTP inside database
        await VisicoolerOtp.create({
            otp,
            expiresAt
        });

        // 4. Resolve recipient emails
        let emailList: string[] = [];
        if (process.env.REPORT_EMAIL_TO) {
            emailList = process.env.REPORT_EMAIL_TO.split(",")
                .map(e => e.trim())
                .filter(Boolean);
        }
        if (emailList.length === 0 && process.env.EMAIL_USER) {
            emailList.push(process.env.EMAIL_USER.trim());
        }

        if (emailList.length === 0) {
            return NextResponse.json({ 
                success: false, 
                error: "No administrator emails are configured for OTP delivery. Please check environment variables." 
            }, { status: 400 });
        }

        const recipientString = emailList.join(", ");

        // 5. Configure SMTP transporter
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
            return NextResponse.json({ 
                success: false, 
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

        // 6. Build highly styled email notification layout with complete shop details context
        const emailHtmlBody = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #2563EB; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Cloud9</h2>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">Visicooler Administration Portal</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 25px;" />
                <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 15px;">
                    Hello Administrator,
                </p>
                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 20px;">
                    A request to <strong>${action === "UPDATE" ? "Modify an Existing Shop" : "Register a New Shop"}</strong> has been initiated in the Visicooler CMS. Below are the details submitted for review:
                </p>

                <!-- Shop Details Review Card -->
                <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 30px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <tbody>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; width: 38%; background-color: #fafafa;">Shop Name</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937; font-weight: 600;">${name || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Pincode</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${pincode || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Area / Location</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${area || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Mobile Number</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${mobileNumber || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Email Address</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${email || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Area Manager (ASM)</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${asm || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Sales Exec (SE)</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${se || 'N/A'}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 12px 14px; font-size: 13px; font-weight: 700; color: #4b5563; background-color: #fafafa;">Visicooler Brands</td>
                                <td style="padding: 12px 14px; font-size: 13px; color: #1f2937;">${visicooler || 'None'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <p style="font-size: 15px; color: #555555; line-height: 1.6; margin-bottom: 25px; text-align: center;">
                    If these details are correct, use the transaction authorization code below to approve:
                </p>
                <div style="text-align: center; margin: 25px 0; padding: 20px; background-color: #f0f4ff; border-radius: 10px; border: 1px dashed #2563EB;">
                    <span style="font-size: 38px; font-weight: 800; color: #1e40af; letter-spacing: 6px; font-family: monospace;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #ef4444; text-align: center; line-height: 1.4; margin-bottom: 30px; font-weight: 600;">
                    This authorization code is valid for exactly <strong>20 minutes</strong>. 
                    <br /><span style="color: #888888; font-weight: normal;">If you did not initiate this change, you can safely ignore this alert.</span>
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 20px;" />
                <div style="text-align: center; font-size: 11px; color: #999999;">
                    This is an automated security transmission. Please do not reply directly to this email.
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"Cloud9 Security" <${process.env.EMAIL_USER}>`,
            to: recipientString,
            subject: `[OTP: ${otp}] Visicooler CMS Transaction Authorization`,
            html: emailHtmlBody,
        });

        // Mask emails for secure UI feedback
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
            success: true,
            message: "OTP sent successfully",
            email: maskedEmails
        });

    } catch (error: any) {
        console.error("Failed to generate/send Visicooler OTP:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}

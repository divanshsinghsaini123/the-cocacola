import nodemailer from "nodemailer";

interface ContactUsEmailPayload {
    title: string;
    themeColor: string;
    fields: Record<string, string | number | boolean | null | undefined>;
    messageBody?: string;
}

export async function sendContactUsEmail({ title, themeColor, fields, messageBody }: ContactUsEmailPayload) {
    try {
        // 1. Resolve recipients
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
            console.error("No recipient emails configured in REPORT_EMAIL_TO or EMAIL_USER");
            return { success: false, error: "No recipients configured" };
        }

        const recipientString = emailList.join(", ");

        // 2. Configure transporter
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS environment variables");
            return { success: false, error: "SMTP credentials missing" };
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 3. Build HTML Rows for key-value grid
        let fieldsHtml = "";
        for (const [key, value] of Object.entries(fields)) {
            if (value === undefined || value === null) continue;

            let displayValue = String(value);
            if (typeof value === "boolean") {
                displayValue = value
                    ? `<span style="background-color: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">Yes</span>`
                    : `<span style="background-color: #fee2e2; color: #b91c1c; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700;">No</span>`;
            }

            // Convert camelCase or uppercase field names into nicely spaced, capitalized labels
            const displayLabel = key
                .replace(/([A-Z])/g, ' $1')
                .trim()
                .replace(/^./, str => str.toUpperCase());

            fieldsHtml += `
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 14px 16px; font-size: 14px; font-weight: 700; color: #4b5563; width: 38%; vertical-align: top; background-color: #fafafa;">
                        ${displayLabel}
                    </td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1f2937; vertical-align: top; font-family: inherit;">
                        ${displayValue}
                    </td>
                </tr>
            `;
        }

        // 4. Build message quote HTML
        let messageBlockHtml = "";
        if (messageBody && messageBody.trim()) {
            messageBlockHtml = `
                <div style="margin-top: 30px; padding: 25px; border-radius: 12px; background-color: #fcfcfc; border-left: 5px solid ${themeColor}; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                    <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800;">Message / Details</h4>
                    <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1f2937; white-space: pre-wrap; font-style: italic;">
                        "${messageBody.trim()}"
                    </p>
                </div>
            `;
        }

        // 5. Build full HTML document
        const htmlBody = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f3f4f6;">
                <div style="border-radius: 16px; overflow: hidden; background-color: #ffffff; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
                    
                    <!-- Header Banner -->
                    <div style="background-color: ${themeColor}; padding: 35px 25px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Cloud9</h2>
                        <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 8px 0 0 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                            ${title}
                        </p>
                    </div>

                    <!-- Main Content Panel -->
                    <div style="padding: 30px 25px;">
                        <p style="margin: 0 0 25px 0; font-size: 15px; color: #4b5563; line-height: 1.5;">
                            Hello, <br />A new form entry has been submitted on the website. Below are the full validation details:
                        </p>

                        <!-- Fields Grid Card -->
                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);">
                            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                                <tbody>
                                    ${fieldsHtml}
                                </tbody>
                            </table>
                        </div>

                        <!-- Message Block -->
                        ${messageBlockHtml}

                        <!-- Metadata Callout -->
                        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #9ca3af; line-height: 1.4;">
                            Submitted at: <strong>${new Date().toLocaleString()}</strong><br />
                            This is an automated system notification from the Cloud9 Contact Administration.
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 6. Dispatch Email
        const mailOptions = {
            from: `"Cloud9 Notification" <${process.env.EMAIL_USER}>`,
            to: recipientString,
            subject: `[New Submission] ${title} - ${fields.name || fields.fullName || fields.FirstName || 'Contact Form'}`,
            html: htmlBody,
        };

        await transporter.sendMail(mailOptions);
        return { success: true };

    } catch (error: any) {
        console.error("sendContactUsEmail helper error:", error);
        return { success: false, error: error.message };
    }
}

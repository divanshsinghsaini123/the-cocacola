import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, instagram, characterName, characterId } = body;

        if (!name || !phone || !characterName) {
            return NextResponse.json(
                { error: "Name, Phone number, and Selected Character are required." },
                { status: 400 }
            );
        }

        const trimmedName = String(name).trim();
        const trimmedPhone = String(phone).trim();
        const trimmedInstagram = instagram ? String(instagram).trim() : "";
        const trimmedCharacterName = String(characterName).trim();



        // 2. Sync vote to Google Sheet via Webhook (if configured)
        const sheetWebhookUrl =
            process.env.GOOGLE_SHEET_MIRZAPUR_VOTES_WEBHOOK_URL ||
            process.env.GOOGLE_SHEET_MIRZAPUR_WEBHOOK_URL;

        if (sheetWebhookUrl) {
            try {
                await fetch(sheetWebhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sheetName: "votes",
                        name: trimmedName,
                        phone: trimmedPhone,
                        instagram: trimmedInstagram,
                        characterName: trimmedCharacterName,
                        submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                    }),
                });
            } catch (sheetErr) {
                console.error("Failed to sync vote to Google Sheet:", sheetErr);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Your vote has been registered successfully!",
        });
    } catch (err: any) {
        console.error("Mirzapur Vote API Error:", err);
        return NextResponse.json(
            { error: "Failed to submit vote: " + (err.message || "Unknown error") },
            { status: 500 }
        );
    }
}

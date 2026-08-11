
import { ContactusCoffilingSchema } from "@/src/lib/validation"
import { connectDB } from "@/src/lib/mongoose";
import { NextResponse } from "next/server";
import ContactusCofilling from "@/src/models/Cofilling/Contactus";
import { sendContactUsEmail } from "@/src/lib/email";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const dataAfterValidation = ContactusCoffilingSchema.safeParse(body);
        if (!dataAfterValidation.success) {
            console.log("idhr tk aaya ");
            return NextResponse.json(
                { error: dataAfterValidation.error.message },
                { status: 400 }
            );
        }

        const finaldata = dataAfterValidation.data;
        if (finaldata.agreedToPrivacy) {
            // Map validation schema properties to the database schema required properties
            const dbPayload = {
                fullName: finaldata.fullName, // Zod fullName -> Mongoose name
                email: finaldata.email,
                companyName: finaldata.companyName,
                companyWebsite: finaldata.companyWebsite,
                officeAddress: finaldata.officeAddress,
                country: finaldata.country,
                hasTrademark: finaldata.hasTrademark,
                productSize: finaldata.productSize,
                yearlyVolume: finaldata.yearlyVolume,
                message: finaldata.message,
                brandName: finaldata.brandName,
                agreedToPrivacy: finaldata.agreedToPrivacy,
                IsActive: finaldata.IsActive ?? true // Set required schema property fallback
            };
            console.log("DEBUG COFILLING DB PAYLOAD:", dbPayload);
            const data = await ContactusCofilling.create(dbPayload);

            // Dispatch dynamic styled email notification to administrators
            await sendContactUsEmail({
                title: "Cofilling Partnership Inquiry",
                themeColor: "#0f2027", // Sleek Dark Slate Blue
                category: "manufacturing",
                fields: {
                    fullName: finaldata.fullName,
                    email: finaldata.email,
                    companyName: finaldata.companyName,
                    brandName: finaldata.brandName,
                    companyWebsite: finaldata.companyWebsite,
                    officeAddress: finaldata.officeAddress,
                    country: finaldata.country,
                    hasTrademark: finaldata.hasTrademark,
                    yearlyVolume: finaldata.yearlyVolume,
                    productSize: finaldata.productSize,
                },
                messageBody: finaldata.message
            });

            return NextResponse.json(
                { message: "Contactus Coffiling data saved successfully", data },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "Please agree to the privacy policy" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Failed to save contactus Coffiling data into database: " + error },
            { status: 500 }
        );
    }
}

import { ContactusCoffilingSchema } from "@/src/lib/validation"
import { connectDB } from "@/src/lib/mongoose";
import { NextResponse } from "next/server";
import ContactusCofilling from "@/src/models/Cofilling/Contactus";


export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const dataAfterValidation = ContactusCoffilingSchema.safeParse(body);
        if (!dataAfterValidation.success) {
            return NextResponse.json(
                { error: dataAfterValidation.error.message },
                { status: 400 }
            );
        }
        const finaldata = dataAfterValidation.data;
        if (finaldata.agreedToPrivacy) {
            const data = await ContactusCofilling.create(finaldata);
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
            { error: "Failed to save contactus Coffiling data into database" + error },
            { status: 500 }
        );
    }
}
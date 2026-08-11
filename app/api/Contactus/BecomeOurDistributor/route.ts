import { ContactUsBecomeOurDistributor } from "@/src/models/BecomeOurDistrubutor/ContactUs";
import { ContactUsBecomeOurDistributorSchema } from "@/src/lib/validation";
import { connectDB } from "@/src/lib/mongoose";
import { sendContactUsEmail } from "@/src/lib/email";

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        // The frontend sends JSON.stringify({ data }), so the actual fields are nested inside body.data
        const payload = body.data || body;

        const validation = ContactUsBecomeOurDistributorSchema.safeParse(payload);

        if (!validation.success) {
            console.error("Validation failed:", validation.error.flatten());
            return Response.json(
                { message: "Invalid data", errors: validation.error.flatten() },
                { status: 400 }
            );
        }

        const data = validation.data;
        const contact = new ContactUsBecomeOurDistributor(data);
        await contact.save();

        // Dispatch dynamic styled email notification to administrators
        await sendContactUsEmail({
            title: "Distributor Partnership Application",
            themeColor: "#E51D29", // Premium Coca-Cola Red
            category: "manufacturing",
            fields: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                pinCode: data.pinCode,
                city: data.city,
                state: data.state,
                businessType: data.businessType,
                investmentPlan: data.investmentPlan,
            }
        });

        return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}
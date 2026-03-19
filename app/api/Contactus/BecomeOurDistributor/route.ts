import { ContactUsBecomeOurDistributor } from "@/src/models/BecomeOurDistrubutor/ContactUs";
import { ContactUsBecomeOurDistributorSchema } from "@/src/lib/validation";


export async function POST(request: Request) {
    try {
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

        return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}
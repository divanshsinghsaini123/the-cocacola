import { connectDB } from "@/src/lib/mongoose";
import { Store } from "@/src/models/store";
import Navbar from "./Navbar";
export const revalidate = 3600;
export default async function NavbarServer() {
    await connectDB();
    // Only fetch necessary fields to keep payload small
    const stores = await Store.find({ isActive: true })
        .select("name link")
        .lean();

    // Convert ObjectId to string to avoid serialization warnings
    const serializedStores = JSON.parse(JSON.stringify(stores));

    return <Navbar stores={serializedStores} />;
}

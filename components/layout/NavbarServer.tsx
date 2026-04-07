import { connectDB } from "@/src/lib/mongoose";
import { Store } from "@/src/models/store";
import Navbar from "./Navbar";
import Loading from "@/app/loading";
export const revalidate = 3600;
interface NavbarServerProps {
    navbarImage: string | undefined;
    navbarColor: string | undefined;
}
export default async function NavbarServer({ navbarImage, navbarColor }: NavbarServerProps) {
    var serializedStores;
    try {
        await connectDB();
        // Only fetch necessary fields to keep payload small
        const stores = await Store.find({ isActive: true })
            .select("name link")
            .lean();
        serializedStores = JSON.parse(JSON.stringify(stores));
    }
    finally {
        // Convert ObjectId to string to avoid serialization warnings
        return <Navbar stores={serializedStores} navbarImage={navbarImage} navbarColor={navbarColor} />;
    }

}

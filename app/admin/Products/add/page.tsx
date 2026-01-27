import ProductForm from "../../_components/ProductForm";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { Store } from "@/src/models/store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AddProductPage({ searchParams }: PageProps) {
    const { brandId } = await searchParams; // Correctly await searchParams

    if (!brandId || typeof brandId !== 'string') {
        return (
            <div className="p-8 text-center">
                <h1 className="text-xl font-bold text-red-600">Error: Missing Brand ID</h1>
                <p>Please navigate here from a specific Brand page.</p>
            </div>
        );
    }

    await connectDB();
    let brand: any;
    let stores: any[] = [];

    try {
        brand = await Brand.findById(brandId);
        stores = await Store.find({}).where({ isActive: true }).lean();
    }
    catch (e) {
        console.log(e);
    }

    if (!brand) return notFound();
    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Adding Product To</span>
                <h1 className="text-4xl font-extrabold text-gray-900 mt-1">{brand.name}</h1>
            </div>
            <ProductForm brandId={brandId} stores={JSON.parse(JSON.stringify(stores))} />
        </div>
    );
}

import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import BrandForm from "../../../_components/BrandForm";
import BrandProducts from "../../../_components/BrandProducts";
import { notFound } from "next/navigation";

interface EditBrandPageProps {
    params: {
        id: string;
    };
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
    const { id } = await params;
    await connectDB();

    // Use try-catch or handling for invalid IDs
    let brand;
    try {
        brand = await Brand.findById(id).lean();
    } catch (e) {
        brand = null;
    }

    if (!brand) {
        notFound();
    }

    // Convert _id to string to pass to client components
    brand._id = brand._id.toString();

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Edit Brand</h1>
                <BrandForm initialData={brand} />
            </div>

            <BrandProducts brandId={brand._id} brandName={brand.name} />
        </div>
    );
}

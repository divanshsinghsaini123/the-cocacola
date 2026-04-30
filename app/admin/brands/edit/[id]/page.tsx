import Link from "next/link";
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
                <Link
                    href="/admin/brands"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Brands
                </Link>
            </div>
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Edit Brand: <span className="text-red-600 underline decoration-red-200 underline-offset-4">{brand.name}</span>
                    </h1>
                    <a
                        href="#products-section"
                        className="px-5 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 hover:translate-y-[-1px]"
                    >
                        <span>↓</span> Go to Products
                    </a>
                </div>
                <BrandForm initialData={brand} />
            </div>

            <div id="products-section" className="scroll-mt-10">
                <BrandProducts brandId={brand._id} brandName={brand.name} />
            </div>
        </div>
    );
}

import ProductForm from "../../../_components/ProductForm";
import { connectDB } from "@/src/lib/mongoose";
import { Product } from "@/src/models/Product";
import { notFound } from "next/navigation";
import { Store } from "@/src/models/store";
interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    await connectDB();

    // Lean allows us to get a POJO, but we need to convert ObjectIds manually for client
    let product: any;
    let stores: any[] = [];
    try {
        product = await Product.findById(id).lean();
        stores = await Store.find({}).where({ isActive: true }).lean();
    } catch (e) {
        return notFound();
    }

    if (!product) return notFound();

    // Serialize IDs
    product._id = product._id.toString();
    product.brand = product.brand.toString();
    if (product.nutrition && product.nutrition.nutritionfacts) {
        product.nutrition.nutritionfacts = product.nutrition.nutritionfacts.map((e: any) => ({
            ...e,
            _id: e._id ? e._id.toString() : undefined // often subdocs have _id
        }));
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900">Edit Product</h1>
                <p className="text-gray-500 mt-2">{product.name}</p>
            </div>
            <ProductForm initialData={JSON.parse(JSON.stringify(product))} stores={JSON.parse(JSON.stringify(stores))} />
        </div>
    );
}

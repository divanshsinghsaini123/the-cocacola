"use server";

import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";
import { Product } from "@/src/models/Product";
import { revalidatePath } from "next/cache";

export async function deleteBrand(id: string) {
    try {
        await connectDB();
        await Brand.deleteOne({ _id: id });
        await Product.deleteMany({ brand: id });
        revalidatePath("/admin/brands");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to delete brand" };
    }
}

export async function updateBrandOrder(brandIds: string[]) {
    try {
        await connectDB();
        const bulkOps = brandIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { order: index },
            }
        }));
        await Brand.bulkWrite(bulkOps);

        // Revalidate layout and public pages
        revalidatePath("/admin/brands");
        revalidatePath("/brands");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Failed to update brand order:", error);
        return { success: false, error: "Failed to update brand order" };
    }
}

export async function updateProductOrder(productIds: string[], brandId: string) {
    try {
        await connectDB();
        const bulkOps = productIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, brand: brandId },
                update: { order: index },
            }
        }));
        await Product.bulkWrite(bulkOps);

        // Revalidate specific pages
        revalidatePath(`/admin/brands/edit/${brandId}`);
        revalidatePath(`/brands/${brandId}`);

        return { success: true };
    } catch (error) {
        console.error("Failed to update product order:", error);
        return { success: false, error: "Failed to update product order" };
    }
}

export async function toggleBrandActive(id: string, isActive: boolean) {
    try {
        await connectDB();
        await Brand.updateOne({ _id: id }, { isActive });
        //iska use kiya cache clear krne ke liye , ye next js ko bolte hain, clear the old cache and reload 
        revalidatePath("/admin/brands");
        revalidatePath("/brands");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle brand status:", error);
        return { success: false, error: "Failed to toggle brand status" };
    }
}

export async function toggleProductActive(id: string, isActive: boolean) {
    try {
        await connectDB();
        const product = await Product.findById(id).populate("brand");
        if (!product) {
            return { success: false, error: "Product not found" };
        }
        await Product.updateOne({ _id: id }, { isActive });

        const brandId = product.brand?._id?.toString() || "";
        const brandSlug = product.brand?.slug || "";
        const productSlug = product.slug || "";

        // Revalidate specific paths
        if (brandId) {
            revalidatePath(`/admin/brands/edit/${brandId}`);
        }
        if (brandSlug) {
            revalidatePath(`/brands/${brandSlug}`);
            if (productSlug) {
                revalidatePath(`/brands/${brandSlug}/${productSlug}`);
            }
        }
        revalidatePath("/brands");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Failed to toggle product status:", error);
        return { success: false, error: "Failed to toggle product status" };
    }
}

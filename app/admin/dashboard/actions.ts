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
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to delete brand" };
    }
}

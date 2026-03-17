import { GetExtensionData } from "@/src/lib/strapi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClientComponent from "./ClientComponent"

export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetExtensionData();
    const seo = strapioutput?.SEO || strapioutput?.seo;

    return {
        title: seo?.metaTitle || "Extension | Cloud9 Beverages",
        description: seo?.metaDescription || "Explore our extensions and additional offerings at Cloud9 Beverages.",
        keywords: seo?.keywords || "extension, Cloud9, beverages, offerings, new products",
    };
}

export default async function ExtensionPage() {
    const data = await GetExtensionData();
    if (data?.DisablePage) return notFound();
    const rows = data?.Row || [];
    return <ClientComponent rows={rows} />
}

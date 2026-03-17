import { GetCobrandingData } from "@/src/lib/strapi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CobrandingComponent from "./CobrandingComponent";

export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetCobrandingData();
    const seo = strapioutput?.SEO || strapioutput?.seo;

    return {
        title: seo?.metaTitle || "Cobranding | Cloud9 Beverages",
        description: seo?.metaDescription || "Partner with Cloud9 Beverages for successful cobranding campaigns and dynamic brand building.",
        keywords: seo?.keywords || "cobranding, Cloud9, beverages, partnerships, branding, design",
    };
}

export default async function CoBrandingPage() {
    const data = await GetCobrandingData();
    if (data?.DisablePage) return notFound();
    return (
        <>
            <CobrandingComponent />
        </>
    );
}
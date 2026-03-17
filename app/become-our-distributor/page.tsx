import { GetBecomeOurDistributorData, GetBecomeOurDistributorContactUsData } from "@/src/lib/strapi";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import DistributorClientView from "./_components/DistributorClientView";

export async function generateMetadata(): Promise<Metadata> {
    const data = await GetBecomeOurDistributorData();
    const seo = data?.SEO;
    return {
        title: seo?.metaTitle || "Become Our Distributor",
        description: seo?.metaDescription || "",
        keywords: seo?.keywords || "",
    };
}

export default async function BecomeOurDistributor() {
    const data = await GetBecomeOurDistributorData();
    if (data?.DisablePage) return notFound();
    const contactData = await GetBecomeOurDistributorContactUsData();
    
    if (!data) {
        return <div className="min-h-screen flex items-center justify-center bg-[#070910] text-white">Loading...</div>;
    }

    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    return (
        <main className="bg-[#0A0D14] min-h-screen text-white font-sans selection:bg-[#3FA2F6] selection:text-white pb-20 relative">
            {/* Simulated global background gradient matching the whole theme */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#0e1628] via-[#070910] to-[#070910] opacity-80 pointer-events-none" />
            
            <div className="relative z-10 w-full">
                <DistributorClientView 
                    homeData={data} 
                    contactData={contactData} 
                    STRAPI_BASE_URL={STRAPI_BASE_URL} 
                />
            </div>
        </main>
    );
}

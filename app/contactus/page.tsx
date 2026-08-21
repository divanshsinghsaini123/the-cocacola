
import { GetContactHubData, GetContactUsPageData } from "../../src/lib/strapi"
import ContactusClient from "./ContactusClient"
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SITE_CONFIG } from "@/src/config/site";

export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetContactHubData();
    const seo = strapioutput?.SEO || strapioutput?.seo;

    return {
        title: seo?.metaTitle || `${SITE_CONFIG.pages.contact.title} | ${SITE_CONFIG.companyName}`,
        description: seo?.metaDescription || SITE_CONFIG.pages.contact.description,
        keywords: seo?.keywords || SITE_CONFIG.defaultKeywords.join(", "),
    };
}
export default async function ContactUs() {
    const data = await GetContactHubData();
    if (data?.DisablePage) return notFound();

    return (
        <ContactusClient data={data} />
    );
}

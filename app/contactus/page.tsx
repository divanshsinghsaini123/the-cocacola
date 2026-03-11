
import { GetContactUsPageData } from "../../src/lib/strapi"
import ContactusClient from "./ContactusClient"
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetContactUsPageData();
    const seo = strapioutput?.SEO || strapioutput?.seo;

    return {
        title: seo?.metaTitle || "Contact Us | Cloud9 Beverages",
        description: seo?.metaDescription || "Get in touch with The Cloud9 Beverages Company. Find our contact information, location, and send us a message.",
        keywords: seo?.keywords || "contact, Cloud9, beverages, inquiry, support",
    };
}
export default async function ContactUs() {
    const data = await GetContactUsPageData();

    return (
        <ContactusClient data={data} />
    );
}

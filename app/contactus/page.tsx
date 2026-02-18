
import { GetContactUsPageData } from "../../src/lib/strapi"
import ContactusClient from "./ContactusClient"
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with The Cloud9 Beverages Company. Find our contact information, location, and send us a message.",
};
export default async function ContactUs() {
    const data = await GetContactUsPageData();

    return (
        <ContactusClient data={data} />
    );
}

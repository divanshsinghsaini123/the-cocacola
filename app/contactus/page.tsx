
import { GetContactUsPageData } from "../../src/lib/strapi"
import ContactusClient from "./ContactusClient"
export default async function ContactUs() {
    const data = await GetContactUsPageData();

    return (
        <ContactusClient data={data} />
    );
}

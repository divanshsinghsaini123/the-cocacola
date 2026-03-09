import { GetExtensionData } from "@/src/lib/strapi";
import ClientComponent from "./ClientComponent"

export default async function ExtensionPage() {
    const data = await GetExtensionData();
    const rows = data?.Row || [];
    return <ClientComponent rows={rows} />
}

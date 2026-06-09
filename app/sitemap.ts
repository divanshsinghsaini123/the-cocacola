import { MetadataRoute } from "next";
import { connectDB } from "@/src/lib/mongoose";
import { Brand } from "@/src/models/Brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cloud9website-x6hfd.ondigitalocean.app/";

    const staticRoutes = [
        "",
        "/aboutus",
        "/brands",
        "/contactus",
        "/events",
        "/extension",
        "/cobranding",
        "/manufacturing",
        "/become-our-distributor",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1.0 : 0.8,
    }));

    try {
        await connectDB();

        // Fetch active brands to render dynamic slugs
        const brands = await Brand.find({ isActive: true }).select("slug").lean();
        const brandRoutes = brands.map((brand: any) => ({
            url: `${baseUrl}/brands/${brand.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...brandRoutes];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return staticRoutes;
    }
}

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thecoco-cola-e7tww.ondigitalocean.app";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/visicooler/",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

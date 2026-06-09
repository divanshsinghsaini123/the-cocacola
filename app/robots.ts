import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cloud9website-x6hfd.ondigitalocean.app/";

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



const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL as string;
if (!STRAPI_URL) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

export async function GetHomePageData() {
    try {
        const response = await fetch(STRAPI_URL
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch home page data");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching home page data:", error);
        return null;
    }
}


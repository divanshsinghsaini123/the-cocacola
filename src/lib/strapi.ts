

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/home-page?populate[hero][populate]=image&populate[promosAndOffers][populate][items][populate]=image&populate[features][populate][items][populate]=image&populate[moreFromCocaCola][populate][items][populate]=image";
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
                next: { revalidate: 120 },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch home page data");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching home page data:", error);
        return null;
    }
}


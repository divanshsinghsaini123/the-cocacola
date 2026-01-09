

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
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URL}`);
            console.error(`Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch home page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching home page data:", error);
        return null;
    }
}


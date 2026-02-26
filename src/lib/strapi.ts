
import { HomePageData } from "@/types/home";
import { ExpressionType } from "@aws-sdk/client-s3";
import { TelemetryPlugin } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";

const STRAPI_URLHomepage = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/home-page?populate[hero][populate]=image&populate[promosAndOffers][populate][items][populate]=image&populate[features][populate][items][populate]=image&populate[moreFromCocaCola][populate][items][populate]=image&populate[socialLinks][populate][Instagram]=*&populate[socialLinks][populate][Youtube]=*&populate[socialLinks][populate][X]=*&populate[socialLinks][populate][Facebook]=*&populate[footer][populate][Section1][populate][links]=*&populate[footer][populate][Section2][populate][links]=*&populate[footer][populate][Section3][populate][links]=*&populate[footer][populate][FooterImage]=true&populate[NavbarImage]=true";

if (!STRAPI_URLHomepage) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLAboutUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/about-page?populate[Hero][populate]=HeroBanner&populate[MainPageCards][populate][items][populate]=image&populate[RelatedSectionCards][populate][items][populate]=image";
if (!STRAPI_URLAboutUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLContactUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/contactus-page?populate[FAQ][populate][question_answer]=*";
if (!STRAPI_URLContactUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLExtra = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/extra";
if (!STRAPI_URLExtra) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLManufacturing = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/manufacturing-list?populate[Section_table][populate][Section_Table_Row]=*";
if (!STRAPI_URLManufacturing) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLEvents = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/event-page?populate[Event][populate][Image][populate]=*";
if (!STRAPI_URLEvents) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}
export async function GetHomePageData(): Promise<HomePageData | null> {
    try {
        const response = await fetch(STRAPI_URLHomepage
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLHomepage}`);
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

export async function GetAboutUsPageData() {
    try {
        const response = await fetch(STRAPI_URLAboutUs
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLAboutUs}`);
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

export async function GetContactUsPageData() {
    try {
        const response = await fetch(STRAPI_URLContactUs
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLContactUs}`);
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

export async function GetExtraData() {
    try {
        const response = await fetch(STRAPI_URLExtra
            , {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLExtra}`);
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

export async function GetManufacturingData() {
    try {
        const response = await fetch(
            STRAPI_URLManufacturing,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLManufacturing}`);
            console.error(`Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch home page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching home page data:", error);
        return null;
    }
}

export async function GetEventsData() {
    try {
        const response = await fetch(
            STRAPI_URLEvents,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLEvents}`);
            console.error(`Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch home page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching home page data:", error);
        return null;
    }
}
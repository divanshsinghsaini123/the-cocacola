
import { HomePageData } from "@/types/home";
import { ExpressionType } from "@aws-sdk/client-s3";
import { TelemetryPlugin } from "next/dist/build/webpack/plugins/telemetry-plugin/telemetry-plugin";

const STRAPI_URLHomepage = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/home-page?populate[hero][populate][0]=imageDesktop&populate[hero][populate][1]=imageMobile&populate[promosAndOffers][populate][items][populate]=image&populate[features][populate][items][populate]=image&populate[moreFromCloud9][populate][items][populate]=image&populate[socialLinks][populate][Instagram]=*&populate[socialLinks][populate][Youtube]=*&populate[socialLinks][populate][X]=*&populate[socialLinks][populate][Facebook]=*&populate[footer][populate][Section1][populate][links]=*&populate[footer][populate][Section2][populate][links]=*&populate[footer][populate][Section3][populate][links]=*&populate[footer][populate][FooterImage]=true&populate[NavbarImage]=true&populate[SEO][populate]=*&populate[PageButton]=*";

if (!STRAPI_URLHomepage) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLAboutUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/about-page?populate[Hero][populate]=HeroBanner&populate[MainPageCards][populate][items][populate]=image&populate[RelatedSectionCards][populate][items][populate]=image&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLAboutUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLContactUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/contactus-page?populate[FAQ][populate][question_answer]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLContactUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLExtra = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/extra";
if (!STRAPI_URLExtra) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLManufacturing = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/manufacturing-list?populate[Section_table][populate][Section_Table_Row]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLManufacturing) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLEvents = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/event-page?populate[Event][populate][Media][populate]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLEvents) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

const STRAPI_URLExtension = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/extension-page?populate[Row]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLExtension) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}
const STRAPI_URLCobranding = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/cobranding?populate[Card1][populate]=*&populate[card2][populate]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLCobranding) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

const STRAPI_URLBecomeOurDistributor = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/become-our-distributor?populate[Hero][populate]=*&populate[Hero2][populate][LeftExpendableSection][populate]=*&populate[SEO][populate]=*&populate[Footer][populate][Footer_Points][populate]=*&populate[Hero2][populate][Service][populate][BulletPoint]=*&populate[PageButton]=*";
if (!STRAPI_URLBecomeOurDistributor) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

const STRAPI_URLBecomeOurDistributorContactUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/become-our-distributor-contact-us?populate[FollowUsOn]=*&populate[PageButton]=*";
if (!STRAPI_URLBecomeOurDistributorContactUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}


const STRAPI_URLStoreLocator = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/store-locator?populate=*";
if (!STRAPI_URLStoreLocator) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

export async function GetHomePageData() {
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
            throw new Error(`Failed to fetch Manufacturing page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Manufacturing page data:", error);
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
            throw new Error(`Failed to fetch Events page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Events page data:", error);
        return null;
    }
}
export async function GetExtensionData() {
    try {
        const response = await fetch(
            STRAPI_URLExtension,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLExtension} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Extension page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Extension page data:", error);
        return null;
    }
}
export async function GetCobrandingData() {
    try {
        const response = await fetch(
            STRAPI_URLCobranding,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLCobranding} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Cobranding page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Cobranding page data:", error);
        return null;
    }
}
export async function GetBecomeOurDistributorData() {
    try {
        const response = await fetch(
            STRAPI_URLBecomeOurDistributor,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLBecomeOurDistributor} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Become Our Distributor page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Become Our Distributor page data:", error);
        return null;
    }
}

export async function GetBecomeOurDistributorContactUsData() {
    try {
        const response = await fetch(
            STRAPI_URLBecomeOurDistributorContactUs,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLBecomeOurDistributorContactUs} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Become Our Distributor Contact Us page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Become Our Distributor Contact Us page data:", error);
        return null;
    }
}

export async function GetStoreLocatorData() {
    try {
        const response = await fetch(
            STRAPI_URLStoreLocator,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLStoreLocator} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Store Locator page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Store Locator page data:", error);
        return null;
    }
}

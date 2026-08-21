
const STRAPI_URLHomepage = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/home-page?populate[hero][populate]=*&populate[promosAndOffers][populate][items][populate]=*&populate[promosAndOffers][populate][endbutton][populate]=*&populate[features][populate][items][populate]=*&populate[moreFromCloud9][populate][items][populate]=*&populate[socialLinks][populate][Instagram]=*&populate[socialLinks][populate][Youtube]=*&populate[socialLinks][populate][X]=*&populate[socialLinks][populate][Facebook]=*&populate[footer][populate][Section1][populate][links]=*&populate[footer][populate][Section2][populate][links]=*&populate[footer][populate][Section3][populate][links]=*&populate[footer][populate][FooterImage]=true&populate[NavbarImage]=true&populate[SEO][populate]=*&populate[PageButton]=*&populate[Favicon]=true";

if (!STRAPI_URLHomepage) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLAboutUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/about-page?populate[Hero][populate]=*&populate[MainPageCards][populate][items][populate]=*&populate[RelatedSectionCards][populate][items][populate]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLAboutUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLContactUs = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/contactus-page?populate[FAQ][populate][question_answer]=*&populate[SEO][populate]=*&populate[PageButton]=*";
if (!STRAPI_URLContactUs) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLContactHub = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/contact-hub?populate[ContactCards]=*&populate[SEO][populate]=*";
if (!STRAPI_URLContactHub) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing");
}

const STRAPI_URLExtra = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/extra?populate[navLinks][populate]=*&populate[globalConfig][populate][customScripts][populate]=*";
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
const STRAPI_URLCobranding = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/cobranding?populate[hero][populate]=*&populate[stages][populate]=*&populate[callToActionCard][populate]=*&populate[Cards][populate]=*&populate[SEO][populate]=*&populate[PageButton]=*";
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

const STRAPI_URLBrand = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/brand";
if (!STRAPI_URLBrand) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

const STRAPI_Coffiling = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/cofilling?populate[0]=hero.logo&populate[1]=hero.backgroundvideo&populate[2]=hero.leftbutton&populate[3]=hero.rightbutton&populate[4]=hero.stats&populate[5]=hero2.backgroundimage&populate[6]=hero2.media.image&populate[7]=hero2.leftbutton&populate[8]=hero2.rightbutton&populate[9]=aboutus.backgroundimage&populate[10]=aboutus.logo&populate[11]=aboutus.button&populate[12]=aboutus.carouselItems&populate[13]=factoryhighlights.button&populate[14]=contactus.location.addressLines&populate[15]=contactus.location.gpsLines&populate[16]=contactus.privacyPolicy&populate[17]=whatwedoSection.product.productFooter&populate[18]=whatwedoSection.product.productFooter.backgroundimage&populate[19]=whatwedoSection.product.productFooter.item&populate[20]=whatwedoSection.product.productcard.productImage&populate[21]=whatwedoSection.product.productcard.features&populate[22]=whatwedoSection.product.productcard.subFeatures&populate[23]=whatwedoSection.product.productcard.flavours.column1.items&populate[24]=whatwedoSection.product.productcard.flavours.column2.items&populate[25]=whatwedoSection.product.productcard.productImage_mobile&populate[26]=whatwedoSection.packaging.card.image&populate[27]=whatwedoSection.logicstics.backgroundImage&populate[28]=whatwedoSection.logicstics.card.image";
if (!STRAPI_Coffiling) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}

const Strapi_Landing = process.env.NEXT_PUBLIC_STRAPI_URL + "/api/landing-page?populate[Card][populate]=*"
if (!Strapi_Landing) {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is missing")
}
let cachedHomePageData: any = null;
export async function GetBrandPageData() {
    try {
        const response = await fetch(STRAPI_URLBrand,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        );
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_URLBrand}`);
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
            if (cachedHomePageData) {
                console.log("Using cached fallback for HomePageData");
                return cachedHomePageData;
            }
            throw new Error(`Failed to fetch home page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        cachedHomePageData = data.data;
        return data.data;
    } catch (error) {
        console.error("Error fetching home page data:", error);
        if (cachedHomePageData) {
            console.log("Using cached fallback for HomePageData inside catch block");
            return cachedHomePageData;
        }
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

export async function GetContactHubData() {
    try {
        const response = await fetch(STRAPI_URLContactHub, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 },
        });

        if (!response.ok) {
            return await GetContactUsPageData();
        }
        const data = await response.json();
        return data.data || (await GetContactUsPageData());
    } catch (error) {
        return await GetContactUsPageData();
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

export async function GetCofillingData() {
    try {
        const response = await fetch(
            STRAPI_Coffiling,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${STRAPI_Coffiling} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Cofilling page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Cofilling page data:", error);
        return null;
    }
}

export async function GetLandingDate() {
    try {
        const response = await fetch(
            Strapi_Landing,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                next: { revalidate: 60 },
            }
        )
        if (!response.ok) {
            console.error(`Failed to fetch from: ${Strapi_Landing} Status: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.error(`Response: ${errorText}`);
            throw new Error(`Failed to fetch Landing page data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error("Error fetching Landing page data:", error);
        return null;
    }
}
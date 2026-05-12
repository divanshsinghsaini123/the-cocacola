import { GetAboutUsPageData } from "@/src/lib/strapi";
import { getStrapiMediaUrl, isStrapiLocal } from "@/src/lib/strapi-media";
import Image from "next/image";
import Link from "next/link";
import Mainpage_aboutus from "./_components/Mainpage_aboutus";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionItem } from "@/types/home";
export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetAboutUsPageData();
    const seo = strapioutput?.seo;

    return {
        title: seo?.metaTitle || "About Us | Cloud9 Beverages",
        description: seo?.metaDescription || "Learn about The Cloud9 Beverages Company, our history, and our mission to refresh the world.",
        keywords: seo?.keywords || "about Cloud9, company history, our vision, corporate values, beverage industry",
    };
}


interface Feature {
    id: number,
    image: string,
    title: string,
    description: string,
    buttonText: string,
    link: string,
    alignment: string
}

export default async function AboutUs() {
    const strapioutput = await GetAboutUsPageData();
    if (strapioutput?.DisablePage) return notFound();

    const heroData = strapioutput?.Hero;
    // console.log(strapioutput)
    const bannerUrl = heroData?.HeroBanner?.formats?.large?.url || heroData?.HeroBanner?.url;
    // console.log(heroData);
    const isLocal = isStrapiLocal();
    const herodata_main = strapioutput.MainPageCards;
    const featuresdata = (herodata_main?.items && herodata_main.items.length > 0) ? herodata_main.items.map((item: SectionItem, index: number) => {
        const imgurl = item.image?.formats?.large?.url || item.image?.url || "";
        return {
            id: item.id,
            image: imgurl,
            title: item.title,
            description: item.description,
            buttonText: item.buttonText,
            link: item.buttonLink || "#",
            alignment: index % 2 === 0 ? "right" : "left"
        }
    }) : ""

    const relatedSection = strapioutput.RelatedSectionCards;
    const relatedItems = (relatedSection?.items && relatedSection.items.length > 0) ? relatedSection.items.slice(0, 3).map((item: SectionItem) => {
        const itemImg = item.image;
        const imgUrlRaw = itemImg?.formats?.medium?.url || itemImg?.formats?.small?.url || itemImg?.url;
        const imgUrl = imgUrlRaw || "";

        return {
            id: item.id,
            image: imgUrl,
            title: item.title,
            link: item.buttonLink || "#"
        }
    }) : [];
    return (
        <main>
            {/* Hero Section */}
            <section className="relative w-full h-[400px] md:h-[400px] lg:h-[500px] overflow-hidden">
                {bannerUrl && (
                    <Image
                        src={getStrapiMediaUrl(bannerUrl)}
                        alt="Our Company Data"
                        fill
                        className="object-cover md:object-fit"
                        priority
                        unoptimized={true}
                    />
                )}
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <h1 className="text-white text-4xl md:text-6xl lg:text-[70px] font-bold uppercase tracking-wider text-center drop-shadow-lg">
                        Our Company
                    </h1>
                </div>
            </section>

            {/* Paragraphs Section */}
            <section className="bg-[#EEEEEE] py-12 md:py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 text-black font-bold text-[18px] md:text-[26px] leading-[1.1] md:leading-[1.2]">
                    {heroData?.paragraph1 && <p>{heroData.paragraph1}</p>}
                    {heroData?.paragraph2 && <p>{heroData.paragraph2}</p>}
                    {heroData?.paragraph3 && <p>{heroData.paragraph3}</p>}
                </div>
            </section>
            {/* Features Section */}
            <section className="bg-[#EEEEEE] py-12 md:py-20 px-6 md:px-12">
                <div className="max-w-6xl mx-auto space-y-16 md:space-y-32 text-black font-bold text-[18px] md:text-[26px] leading-[1.1] md:leading-[1.2]">
                    {featuresdata && featuresdata.map((feature: Feature) => (
                        <Mainpage_aboutus key={feature.id} feature={feature} />
                    ))}
                </div>

            </section>

            {/* Related Content Section */}
            {
                relatedSection && relatedItems.length > 0 && (
                    <section className="bg-[#EEEEEE] py-10 md:py-16 px-6 md:px-12 border-t border-gray-300">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl md:text-[32px] font-bold text-center mb-8 md:mb-12 text-black">
                                {relatedSection.sectionTitle}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                                {relatedItems.map((item: any) => (
                                    <div key={item.id} className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                        <div className="relative h-[200px] w-full bg-gray-100">
                                            <Image
                                                src={getStrapiMediaUrl(item.image)}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                unoptimized={isLocal}
                                            />
                                        </div>
                                        <div className="p-5 md:p-6 flex flex-col flex-grow justify-between min-h-[160px]">
                                            <h3 className="text-[16px] md:text-[20px] font-bold text-black mb-4 leading-tight">
                                                {item.title}
                                            </h3>
                                            <Link
                                                href={item.link}
                                                className="inline-flex items-center text-black font-bold text-[14px] hover:text-gray-600 transition-colors mt-auto"
                                            >
                                                Read More
                                                <span className="ml-2">→</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

        </main >
    );
}


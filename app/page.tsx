import type { Metadata } from "next";
import Hero from "../components/home/Hero";
import PromosAndOffers from "../components/home/Promos&Offers";
import Features from "../components/home/Features";
import MoreFromCloud9 from "../components/home/MoreFromCloud9";
import ExploreBrands from "../components/home/ExploreBrands";
import { GetHomePageData } from "@/src/lib/strapi";
import { notFound } from "next/navigation";

import { SITE_CONFIG } from "@/src/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const strapioutput = await GetHomePageData();
  const seo = strapioutput?.SEO;

  return {
    title: seo?.metaTitle || `${SITE_CONFIG.pages.home.title} | ${SITE_CONFIG.companyName}`,
    description: seo?.metaDescription || SITE_CONFIG.pages.home.description,
    keywords: seo?.keywords || SITE_CONFIG.defaultKeywords.join(", "),
  };
}

export default async function Home() {
  const data = await GetHomePageData();
  if (!data || data?.DisablePage) return notFound();
  return (
    <main>
      <Hero data={data.hero} buttonStyle={data.PageButton} />
      <PromosAndOffers data={data.promosAndOffers} buttonStyle={data.PageButton} />
      <Features data={data.features} />
      <MoreFromCloud9 data={data.moreFromCloud9} />
      <ExploreBrands />
    </main>
  );
}

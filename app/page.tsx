import type { Metadata } from "next";
import Hero from "../components/home/Hero";
import PromosAndOffers from "../components/home/Promos&Offers";
import Features from "../components/home/Features";
import MoreFromCocaCola from "../components/home/MoreFromCloud9";
import ExploreBrands from "../components/home/ExploreBrands";
import { GetHomePageData } from "@/src/lib/strapi";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const strapioutput = await GetHomePageData();
  const seo = strapioutput?.SEO;

  return {
    title: seo?.metaTitle || "Home | Cloud9 Beverages",
    description: seo?.metaDescription || "Experience the refreshing taste of our world-class beverages. Discover our brands, latest products, and our commitment to sustainability.",
    keywords: seo?.keywords || "Cloud9, beverages, refreshing, brands, products, sustainability",
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
      <MoreFromCocaCola data={data.moreFromCocaCola} />
      <ExploreBrands />
    </main>
  );
}

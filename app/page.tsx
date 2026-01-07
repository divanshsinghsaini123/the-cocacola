import Hero from "../components/home/Hero";
import PromosAndOffers from "../components/home/Promos&Offers";
import Features from "../components/home/Features";
import MoreFromCocaCola from "../components/home/MoreFromCocoCola";
import ExploreBrands from "../components/home/ExploreBrands";
import { GetHomePageData } from "@/src/lib/strapi";


export default async function Home() {
  const data = await GetHomePageData();

  return (
    <main>
      <Hero data={data.hero} />
      <PromosAndOffers data={data.promosAndOffers} />
      {/* <Features data={data.features} />
      <MoreFromCocaCola data={data.moreFromCocaCola} /> */}
      <ExploreBrands />
    </main>
  );
}

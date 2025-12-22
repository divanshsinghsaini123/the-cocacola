import Hero from "../components/home/Hero";
import PromosAndOffers from "../components/home/Promos&Offers";
import Features from "../components/home/Features";
import MoreFromCocaCola from "../components/home/MoreFromCocoCola";
import ExploreBrands from "../components/home/ExploreBrands";

export default function Home() {
  return (
    <main>
      <Hero />
      <PromosAndOffers />
      <Features />
      <MoreFromCocaCola />
      <ExploreBrands />
    </main>
  );
}

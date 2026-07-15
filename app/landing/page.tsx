"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, MousePointerClick, Volume2, VolumeX } from "lucide-react";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";
import { GetLandingDate } from "@/src/lib/strapi";
import { useRouter } from "next/navigation";

interface Button {
  buttonLink: string;
  buttonText: string;
  disablebutton: boolean;
}
interface Card {
  id: string | number;
  title: string;
  tagline: string;
  description: string;
  image: string;
  button: Button;
  bgColor: string;         // Primary theme color
  accentColor: string;     // Bright highlighting color (for titles, glow, buttons)
}


// Dynamically import Three.js canvas to avoid SSR errors
const LandingThreeCanvas = dynamic(() => import("./LandingThreeCanvas"), {
  ssr: false,
});

export default function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const router = useRouter();
  useEffect(() => {
    const data = async () => {
      const res = await GetLandingDate();
      if (!res || res.DisablePage === true) {
        router.push('/');
      }
      else if (res && res.Card) {

        const mappedCards: Card[] = res.Card.map((c: any) => ({
          id: c.id,
          title: c.title || "",
          tagline: c.tagline || "",
          description: c.description || "",
          image: getStrapiMediaUrl(c.image?.url),
          button: {
            buttonLink: c.button?.buttonLink || "#",
            buttonText: c.button?.buttonText || "",
            disablebutton: c.button?.disablebutton || false,
          },
          bgColor: c.bgColor || "#000000",
          accentColor: c.accentColor || c.bgColor || "#ffffff",
        }));
        setCards(mappedCards);
      }
      setLoading(false);
    }
    data();
  }, [])
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync display content with fade transition
  useEffect(() => {
    if (!mounted) return;
    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayIndex(activeIndex);
      setTransitioning(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [activeIndex, mounted]);

  if (!mounted || loading) {
    return (
      <div className="w-full h-screen bg-[#0b0b0b] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-red-600 border-gray-800 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold uppercase tracking-widest opacity-60">Initializing Canvas...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return null;
  }

  const activePage = cards[displayIndex];

  return (
    <main className="w-full h-screen relative bg-[#0b0b0b] text-white overflow-hidden select-none">

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] z-[1] pointer-events-none" />



      {/* 3. Three.js 3D Ring Canvas */}
      <div className="absolute inset-0 z-10">
        <LandingThreeCanvas
          activeIndex={activeIndex}
          onChangeActiveIndex={setActiveIndex}
          cards={cards}
        />
      </div>

      {/* 4. Active Card Text Details Overlay */}
      <div className="absolute bottom-48 left-6 right-6 md:bottom-28 md:left-16 md:right-16 flex flex-col md:flex-row md:items-end justify-between z-20 pointer-events-none">
        <div
          className={`max-w-md transition-all duration-300 transform ${transitioning ? "opacity-0 translate-y-6 filter blur-sm" : "opacity-100 translate-y-0 filter blur-none"
            }`}
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.3em] transition-colors duration-500"
            style={{ color: activePage.accentColor }}
          >
            Explore Page
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mt-2 mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            {activePage.title}
          </h1>
          <p className="text-xs md:text-sm opacity-85 leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.3)]">
            {activePage.description}
          </p>
        </div>

        {/* Action Prompt */}
        {!activePage.button?.disablebutton && (
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-2 pointer-events-auto">
            <Link
              href={activePage.button?.buttonLink || "#"}
              className="group flex items-center gap-3 px-6 py-3.5 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span>{activePage.button?.buttonText || "Explore Page"}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-2 mt-1 opacity-50 text-[10px] uppercase tracking-widest font-semibold ml-2 md:ml-0 md:mr-2">
              <MousePointerClick className="w-3.5 h-3.5 animate-pulse" />
              <span>Or click card to enter</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Custom Background Ambient Overlay for Soft glow */}
      <div
        className="absolute w-[600px] h-[600px] -top-[200px] -left-[200px] rounded-full blur-[150px] opacity-15 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: activePage.accentColor }}
      />
      <div
        className="absolute w-[650px] h-[650px] -bottom-[300px] -right-[200px] rounded-full blur-[160px] opacity-10 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: activePage.accentColor }}
      />
    </main>
  );
}

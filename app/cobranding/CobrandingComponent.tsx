"use client";

import React, { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Search, Compass, Palette, Rocket, Wrench, ArrowUpRight } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { GetCobrandingData } from "@/src/lib/strapi";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

// Static mapping of commonly used icons for instant loading (no layout shift)
const staticIcons: Record<string, React.ComponentType<any>> = {
    search: Search,
    compass: Compass,
    palette: Palette,
    rocket: Rocket,
    wrench: Wrench
};

// Reusable component that supports both fast static icons and dynamic lazy loading of any Lucide icon
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const key = name?.toLowerCase() || "search";
    const StaticIcon = staticIcons[key];
    if (StaticIcon) {
        return <StaticIcon className={className} />;
    }
    try {
        const iconKey = key as keyof typeof dynamicIconImports;
        if (dynamicIconImports[iconKey]) {
            const LucideIcon = dynamic(dynamicIconImports[iconKey]);
            return (
                <Suspense fallback={<div className="animate-pulse w-5 h-5 bg-white/20 rounded-full" />}>
                    <LucideIcon className={className} />
                </Suspense>
            );
        }
    } catch (e) {
        console.error("Error loading dynamic icon", e);
    }
    return <Search className={className} />;
};

const stageStyles = [
    { color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/30" },
    { color: "from-purple-500 to-pink-500", shadow: "shadow-purple-500/30" },
    { color: "from-amber-400 to-orange-500", shadow: "shadow-orange-500/30" },
    { color: "from-emerald-400 to-teal-500", shadow: "shadow-emerald-500/30" }
];

function FadeIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode, delay?: number, direction?: "up" | "left" | "right" }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);

    let startClass = "opacity-0 translate-y-12";
    if (direction === "left") startClass = "opacity-0 -translate-x-12 translate-y-4 md:translate-y-0";
    if (direction === "right") startClass = "opacity-0 translate-x-12 translate-y-4 md:translate-y-0";

    return (
        <div
            ref={ref}
            className={`transition-all duration-[1200ms] ease-out w-full ${isVisible ? "opacity-100 translate-y-0 translate-x-0" : startClass}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function CobrandingComponent() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await GetCobrandingData();
                setData(res);
            } catch (error) {
                console.error("Failed to fetch cobranding data", error);
            }
        }
        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-background relative overflow-hidden font-sans">
            {/* Background decorative gradients */}
            <div className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-300/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-40 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-300/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 relative z-10 w-full">

                {/* Header Section */}
                {(() => {
                    const hero = data?.hero || {
                        title: "Process",
                        headline1: "Our process builds successful brands.",
                        headline2: "successful brands.",
                        description: "Transforming ideas into powerful identities through a strategic, proven framework designed for growth and market leadership."
                    };
                    const headline1 = hero.headline1 || "Our process builds successful brands.";
                    const headline2 = hero.headline2 || "successful brands.";
                    const parts = headline1.split(headline2);

                    return (
                        <FadeIn direction="up">
                            <div className="text-center max-w-4xl mx-auto mb-20 md:mb-40 px-4">
                                <div className="inline-block mb-6 md:mb-8">
                                    <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
                                        {hero.title || "Process"}
                                    </span>
                                </div>
                                <h1 className="text-[44px] sm:text-[56px] md:text-[76px] font-extrabold text-foreground tracking-tight leading-[1.1] mb-8">
                                    {parts.length > 1 ? (
                                        <>
                                            {parts[0]}
                                            <br className="hidden md:block" />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                                                {headline2}
                                            </span>
                                            {parts[1]}
                                        </>
                                    ) : (
                                        headline1
                                    )}
                                </h1>
                                <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
                                    {hero.description}
                                </p>
                            </div>
                        </FadeIn>
                    );
                })()}

                {/* Timeline Container */}
                <div className="relative w-full max-w-5xl mx-auto">
                    {/* The vertical broken line spanning the center for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-[5%] bottom-[5%] w-[3px] border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>

                    <div className="space-y-12 md:space-y-24 w-full">
                        {(() => {
                            const stageList = data?.stages && data.stages.length > 0 ? data.stages : [
                                {
                                    id: 1,
                                    title: "Stage 01",
                                    heading: "Audit",
                                    description: "We study your brand, customers, and competition to understand the real problem.",
                                    icon: "search"
                                },
                                {
                                    id: 2,
                                    title: "Stage 02",
                                    heading: "Strategy",
                                    description: "We create a clear brand plan, positioning, and direction.",
                                    icon: "compass"
                                },
                                {
                                    id: 3,
                                    title: "Stage 03",
                                    heading: "Design",
                                    description: "We design your logo, identity, and complete brand look.",
                                    icon: "wrench"
                                },
                                {
                                    id: 4,
                                    title: "Stage 04",
                                    heading: "Manifest",
                                    description: "We apply your brand across all touchpoints — digital, print, and physical.",
                                    icon: "rocket"
                                }
                            ];

                            return stageList.map((stage: any, index: number) => {
                                const isEven = index % 2 === 0;
                                const style = stageStyles[index % stageStyles.length];

                                return (
                                    <div key={stage.id || index} className="relative flex flex-col md:flex-row items-center w-full z-10">

                                        {/* Mobile Vertical Line */}
                                        <div className="md:hidden absolute left-[28px] top-[70px] bottom-[-40px] w-[2px] border-l-2 border-dashed border-gray-300 z-0"></div>

                                        {/* Center Icon (Desktop) */}
                                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[80px] h-[80px] rounded-full bg-background items-center justify-center">
                                            <div className={`w-[60px] h-[60px] rounded-full bg-gradient-to-br ${style.color} flex items-center justify-center text-white shadow-xl ${style.shadow} transition-transform duration-500 hover:scale-110`}>
                                                <DynamicIcon name={stage.icon} className="w-7 h-7" />
                                            </div>
                                        </div>

                                        {/* Left/Right Container */}
                                        <div className={`w-full md:w-1/2 flex relative z-10 pl-6 sm:pl-10 ${isEven ? 'md:justify-end md:pr-16 lg:pr-24' : 'md:justify-start md:pl-16 lg:pl-24 md:order-last'}`}>
                                            <FadeIn direction={isEven ? 'left' : 'right'} delay={100}>
                                                <div className="bg-component/80 backdrop-blur-sm rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:bg-component transition-all duration-500 hover:-translate-y-2 border border-white/50 group w-full relative overflow-hidden">

                                                    {/* Decorative background glow inside card */}
                                                    <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${style.color} opacity-10 rounded-full blur-[40px] transition-all duration-500 group-hover:opacity-20`}></div>

                                                    {/* Mobile Icon & Stage Header Flex */}
                                                    <div className="flex items-center gap-4 sm:gap-6 mb-6">
                                                        <div className={`md:hidden flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[20px] bg-gradient-to-br ${style.color} flex items-center justify-center text-white shadow-lg ${style.shadow}`}>
                                                            <DynamicIcon name={stage.icon} className="w-5 h-5 sm:w-8 sm:h-8" />
                                                        </div>
                                                        <h3 className={`text-[13px] sm:text-[15px] md:text-[18px] font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${style.color} flex items-center gap-3 sm:gap-4`}>
                                                            {stage.title || `Stage 0${index + 1}`}
                                                            <span className="hidden sm:inline-block w-8 md:w-12 h-[2px] bg-gray-200 rounded-full group-hover:w-16 md:group-hover:w-20 transition-all duration-500"></span>
                                                        </h3>
                                                    </div>

                                                    <h2 className="text-[24px] sm:text-[32px] md:text-[42px] font-extrabold text-foreground mb-4 md:mb-5 leading-[1.15] tracking-tight">
                                                        {stage.heading || stage.title}
                                                    </h2>

                                                    <p className="text-gray-600 text-[15px] sm:text-[17px] md:text-[19px] leading-[1.6] md:leading-[1.7] font-medium">
                                                        {stage.description}
                                                    </p>

                                                </div>
                                            </FadeIn>
                                        </div>

                                        {/* Desktop Empty Side for spacing */}
                                        <div className={`hidden md:block w-1/2 ${isEven ? 'order-last' : 'order-first'}`}>
                                        </div>

                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* CTA Bottom Section */}
                {(() => {
                    const cta = data?.callToActionCard || {
                        heading: "Ready to manifest your brand?",
                        description: "Let’s create a powerful identity that stands out in the market and connects with your audience.",
                        button: {
                            buttonText: "Start your project",
                            buttonLink: "/contactus",
                            disablebutton: false
                        }
                    };

                    if (cta.button?.disablebutton) return null;

                    return (
                        <div className="mt-20 md:mt-48 w-full flex justify-center px-4">
                            <FadeIn delay={200} direction="up">
                                <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-[32px] md:rounded-[40px] p-8 sm:p-12 md:p-24 text-center max-w-[1000px] w-full shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/5 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat mix-blend-overlay"></div>

                                    {/* Animated glowing orb behind button */}
                                    <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/30 blur-[60px] sm:blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-1000"></div>

                                    <div className="relative z-10 flex flex-col items-center">
                                        <h2 className="text-white text-[28px] sm:text-[40px] md:text-[64px] font-black mb-4 sm:mb-6 tracking-tight leading-[1.15] sm:leading-[1.1]">
                                            {cta.heading}
                                        </h2>
                                        <p className="text-gray-400 text-[15px] sm:text-lg md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                            {cta.description}
                                        </p>
                                        <button 
                                            onClick={() => router.push(cta.button?.buttonLink || '/contactus')} 
                                            className="bg-white text-black px-6 py-3.5 sm:px-10 sm:py-5 rounded-full font-bold text-[15px] sm:text-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 duration-300 flex items-center gap-2 sm:gap-3 group/btn"
                                        >
                                            {cta.button?.buttonText || "Start your project"}
                                            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    );
                })()}

                {/* Packaging Section */}
                <div className="mt-6 md:mt-10 w-full max-w-[1200px] mx-auto pb-2">
                    <div className="text-center pt-8">
                        <h3 className="mb-4 md:mb-10 text-[24px] sm:text-[32px] md:text-[40px] font-extrabold text-foreground tracking-tight">
                            Our Packaging
                        </h3>
                    </div>
                    <FadeIn direction="up">
                        {data?.Cards && data.Cards.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                                {data.Cards.map((card: any, idx: number) => {
                                    const cardBg = idx % 2 === 0 ? "bg-[#f4f4f4]" : "bg-[#e8e9eb]";
                                    const imageSrc = card?.CardImage?.url ? getStrapiMediaUrl(card.CardImage.url) : "/cola.png";
                                    return (
                                        <div key={card.id || idx} className="flex flex-col items-center group">
                                            <div className={`w-full ${cardBg} rounded-[32px] p-6 sm:p-10 relative overflow-hidden aspect-[4/3] flex items-center justify-center mb-8 border border-gray-100 group-hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all duration-500`}>
                                                {card?.button && !card.button.disablebutton && (
                                                    <div 
                                                        onClick={() => router.push(card.button.buttonLink || "/")}
                                                        className="absolute top-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-[#8c9fcf] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-600 transition-colors shadow-lg z-10 hover:scale-105 duration-300"
                                                    >
                                                        <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-2" />
                                                    </div>
                                                )}
                                                <img 
                                                    src={imageSrc} 
                                                    alt={card.CardName || "Packaging Card"} 
                                                    className="max-h-[80%] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
                                                />
                                            </div>
                                            <h3 className="text-[28px] sm:text-[36px] font-serif tracking-wide text-[#8c9fcf] mb-2 font-medium text-center">
                                                {card.CardName}
                                            </h3>
                                            <p className="text-gray-500 text-[13px] sm:text-[15px] font-medium tracking-wide mb-8 text-center">
                                                {card.SubName}
                                            </p>
                                            {card?.button && !card.button.disablebutton && (
                                                <button 
                                                    onClick={() => router.push(card.button.buttonLink || "/")}
                                                    className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full border border-[#8c9fcf] text-[#8c9fcf] text-[13px] sm:text-sm font-semibold tracking-widest hover:bg-[#8c9fcf] hover:text-white transition-all duration-300 shadow-sm"
                                                >
                                                    {card.button.buttonText || "VIEW"}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-10">No packaging cards available.</div>
                        )}
                    </FadeIn>
                </div>

            </div>
        </main>
    );
}

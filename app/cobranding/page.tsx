"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Compass, Palette, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
const stages = [
    {
        id: 1,
        title: "Audit",
        description: "We study your brand, customers, and competition to understand the real problem.",
        icon: Search,
        color: "from-blue-500 to-cyan-400",
        shadow: "shadow-blue-500/30"
    },
    {
        id: 2,
        title: "Strategy",
        description: "We create a clear brand plan, positioning, and direction.",
        icon: Compass,
        color: "from-purple-500 to-pink-500",
        shadow: "shadow-purple-500/30"
    },
    {
        id: 3,
        title: "Design",
        description: "We design your logo, identity, and complete brand look.",
        icon: Palette,
        color: "from-amber-400 to-orange-500",
        shadow: "shadow-orange-500/30"
    },
    {
        id: 4,
        title: "Manifest",
        description: "We apply your brand across all touchpoints — digital, print, and physical.",
        icon: Rocket,
        color: "from-emerald-400 to-teal-500",
        shadow: "shadow-emerald-500/30"
    }
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

export default function CoBrandingPage() {
    const router = useRouter();
    return (
        <main className="min-h-screen bg-[#FAFAFA] relative overflow-hidden font-sans">
            {/* Background decorative gradients */}
            <div className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-300/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-40 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-purple-300/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-32 relative z-10 w-full">

                {/* Header */}
                <FadeIn direction="up">
                    <div className="text-center max-w-4xl mx-auto mb-20 md:mb-40 px-4">
                        <div className="inline-block mb-6 md:mb-8">
                            <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase">
                                Process
                            </span>
                        </div>
                        <h1 className="text-[44px] sm:text-[56px] md:text-[76px] font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-8">
                            Our process builds <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
                                successful brands.
                            </span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed">
                            Transforming ideas into powerful identities through a strategic, proven framework designed for growth and market leadership.
                        </p>
                    </div>
                </FadeIn>

                {/* Timeline Container */}
                <div className="relative w-full max-w-5xl mx-auto">
                    {/* The vertical broken line spanning the center for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-[5%] bottom-[5%] w-[3px] border-l-2 border-dashed border-gray-300 -translate-x-1/2 z-0"></div>

                    <div className="space-y-12 md:space-y-24 w-full">
                        {stages.map((stage, index) => {
                            const isEven = index % 2 === 0;
                            const Icon = stage.icon;

                            return (
                                <div key={stage.id} className="relative flex flex-col md:flex-row items-center w-full z-10">

                                    {/* Mobile Vertical Line */}
                                    <div className="md:hidden absolute left-[28px] top-[70px] bottom-[-40px] w-[2px] border-l-2 border-dashed border-gray-300 z-0"></div>

                                    {/* Center Icon (Desktop) */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[80px] h-[80px] rounded-full bg-[#FAFAFA] items-center justify-center">
                                        <div className={`w-[60px] h-[60px] rounded-full bg-gradient-to-br ${stage.color} flex items-center justify-center text-white shadow-xl ${stage.shadow} transition-transform duration-500 hover:scale-110`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                    </div>

                                    {/* Left/Right Container */}
                                    <div className={`w-full md:w-1/2 flex relative z-10 pl-6 sm:pl-10 ${isEven ? 'md:justify-end md:pr-16 lg:pr-24' : 'md:justify-start md:pl-16 lg:pl-24 md:order-last'}`}>
                                        <FadeIn direction={isEven ? 'left' : 'right'} delay={100}>
                                            <div className="bg-white/80 backdrop-blur-sm rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] hover:bg-white transition-all duration-500 hover:-translate-y-2 border border-white/50 group w-full relative overflow-hidden">

                                                {/* Decorative background glow inside card */}
                                                <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${stage.color} opacity-10 rounded-full blur-[40px] transition-all duration-500 group-hover:opacity-20`}></div>

                                                {/* Mobile Icon & Stage Header Flex */}
                                                <div className="flex items-center gap-4 sm:gap-6 mb-6">
                                                    <div className={`md:hidden flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-[14px] sm:rounded-[20px] bg-gradient-to-br ${stage.color} flex items-center justify-center text-white shadow-lg ${stage.shadow}`}>
                                                        <Icon className="w-5 h-5 sm:w-8 sm:h-8" />
                                                    </div>
                                                    <h3 className={`text-[13px] sm:text-[15px] md:text-[18px] font-bold tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r ${stage.color} flex items-center gap-3 sm:gap-4`}>
                                                        Stage 0{stage.id}
                                                        <span className="hidden sm:inline-block w-8 md:w-12 h-[2px] bg-gray-200 rounded-full group-hover:w-16 md:group-hover:w-20 transition-all duration-500"></span>
                                                    </h3>
                                                </div>

                                                <h2 className="text-[24px] sm:text-[32px] md:text-[42px] font-extrabold text-[#111] mb-4 md:mb-5 leading-[1.15] tracking-tight">{stage.title}</h2>

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
                        })}
                    </div>
                </div>

                {/* CTA Bottom Section */}
                <div className="mt-20 md:mt-48 w-full flex justify-center px-4">
                    <FadeIn delay={200} direction="up">
                        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-[32px] md:rounded-[40px] p-8 sm:p-12 md:p-24 text-center max-w-[1000px] w-full shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat mix-blend-overlay"></div>

                            {/* Animated glowing orb behind button */}
                            <div className="absolute left-1/2 bottom-10 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/30 blur-[60px] sm:blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-colors duration-1000"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <h2 className="text-white text-[28px] sm:text-[40px] md:text-[64px] font-black mb-4 sm:mb-6 tracking-tight leading-[1.15] sm:leading-[1.1]">Ready to manifest <br className="hidden sm:block" /> your brand?</h2>
                                <p className="text-gray-400 text-[15px] sm:text-lg md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                                    Let’s create a powerful identity that stands out in the market and connects with your audience.
                                </p>
                                <button onClick={() => router.push('/contactus')} className="bg-white text-black px-6 py-3.5 sm:px-10 sm:py-5 rounded-full font-bold text-[15px] sm:text-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 duration-300 flex items-center gap-2 sm:gap-3 group/btn">
                                    Start your project
                                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </FadeIn>
                </div>

            </div>
        </main>
    );
}

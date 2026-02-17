"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const AboutUs = () => {
    // Carousel Items Data based on the screenshot
    const carouselItems = [
        {
            title: "3 WATER-BASED",
            subtitle: "filling factories with 6 production lines in total"
        },
        {
            title: "1 MILK-BASED",
            subtitle: "filling factory with 2 production lines in total"
        },
        {
            title: "TOTAL CAPACITY",
            subtitle: "of 6 billion cans / year"
        },
        {
            title: "1 PET",
            subtitle: "production line"
        },
        {
            title: "HIGH-TECH",
            subtitle: "laboratory for constant quality monitoring"
        },
        {
            title: "3 ALUMINIUM",
            subtitle: "empty can lines"
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll logic: Move to next item every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % carouselItems.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const getVisibleItems = () => {
        // 0 1 2 3 4 5 x
        // We want the active item in the middle (index 1 of the returned array)
        // So we take carouselItems[prev], carouselItems[current], carouselItems[next]
        const prevIndex = (activeIndex - 1 + carouselItems.length) % carouselItems.length;
        const nextIndex = (activeIndex + 1) % carouselItems.length;

        return [
            { ...carouselItems[prevIndex], key: prevIndex },
            { ...carouselItems[activeIndex], key: activeIndex },
            { ...carouselItems[nextIndex], key: nextIndex }
        ];
    };

    return (
        <section className="relative w-full md:h-[923px] h-[700px] overflow-hidden bg-black font-sans flex flex-col justify-between">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="/assets/Coffiling_page/pexels-cottonbro-studio-5532660-1.png"
                    alt="Factory Background"
                    fill
                    className="md:object-fill object-cover opacity-100 grayscale"
                />
            </div>

            {/* Top Red Bar */}
            <div className="relative z-10 w-full h-20 bg-[#E51D29] flex items-center px-8">
                <div className="container mx-auto">
                    <h2 className="text-white text-3xl md:text-4xl font-black italic ">ABOUT US</h2>
                </div>
            </div>

            {/* Main Content Center - Logo */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-grow pt-10">
                <div className="relative md:w-[365px] md:h-[211px] w-[200px] h-[100px] mb-8">
                    <Image
                        src="/assets/Coffiling_page/SmartCofilling_powered_by_HELL_logo_4C_darkbase-e1706280670447.png"
                        alt="Smart Cofilling"
                        fill
                        className="object-contain"
                    />
                </div>
                {/* Red Vertical Line */}
                <div className="w-1 h-25 bg-[#E51D29]"></div>
            </div>

            {/* Bottom Carousel Section */}
            <div className="relative z-10 w-full flex flex-col items-center justify-end pb-18 space-y-16">

                {/* Carousel Window */}
                <div className="w-full max-w-[90%] md:max-w-6xl px-4">
                    <div className="flex w-full justify-center md:justify-between items-center text-center">
                        {getVisibleItems().map((item, index) => (
                            <div key={`${item.key}-${index}`} className={`flex flex-col items-center justify-start transition-all duration-500 ${index === 1 ? 'w-full md:w-2/5 opacity-100 scale-100' : 'w-0 md:w-1/4 opacity-0 md:opacity-60 scale-0 md:scale-90 hidden md:flex'}`}>

                                <div className="flex items-center justify-center gap-4 w-full">
                                    {/* Left Chevron for active item */}
                                    {index === 1 && <ChevronLeft onClick={() => setActiveIndex((current) => (current - 1 + carouselItems.length) % carouselItems.length)} className="w-12 h-12 md:w-16 md:h-16 text-white/40 cursor-pointer" />}

                                    <h3 className="text-white text-2xl md:text-3xl font-black italic tracking-tighter uppercase leading-none md:truncate w-full whitespace-normal md:whitespace-nowrap">
                                        {item.title}
                                    </h3>

                                    {/* Right Chevron for active item */}
                                    {index === 1 && <ChevronRight onClick={() => setActiveIndex((current) => (current + 1) % carouselItems.length)} className="w-12 h-12 md:w-16 md:h-16 text-white/40 cursor-pointer" />}
                                </div>

                                <p className="text-white text-sm md:text-sm font-bold uppercase opacity-90 mt-4 md:mt-2 max-w-[90%] md:max-w-[80%] leading-tight">
                                    {item.subtitle}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-[350px] md:w-[400px] h-3 bg-black/50 relative rounded-lg ">
                    <div className="absolute left-0 top-0 h-full bg-[#E51D29] transition-all duration-500 ease-out" style={{ width: `${((activeIndex + 1) / carouselItems.length) * 100}%` }}></div>
                </div>

                {/* Get In Touch Button */}
                <button className="px-5 py-2 bg-[#E51D29] text-white text-base font-bold uppercase rounded-lg transition-colors hover:bg-red-700">
                    Get In Touch
                </button>

            </div>
        </section>
    );
};

export default AboutUs;


"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LogisticsCard from "./__components/logistics_compnent";
import { useGetExtraDataQuery } from "@/src/store/slices/api";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface LogisticsProps {
    data?: {
        heading?: string;
        backgroundImage?: { url?: string };
        card?: {
            id: number;
            tittle: string;
            image?: { url?: string };
        }[];
    };
}

export default function LogisticsSection({ data: strapiData }: LogisticsProps) {
    const { data, error } = useGetExtraDataQuery();
    const stickyNav = data?.data?.StickyNavbar;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const fallbackLogistics = [
        {
            title: "PRODUCT SIZE: 250 ML",
            imageUrl: "/assets/Coffiling_page/logistics/250ml.png" // placeholder/fallback if any
        }
    ];

    const items = strapiData?.card && strapiData.card.length > 0
        ? strapiData.card.map((card) => ({
            title: card.tittle,
            imageUrl: getStrapiMediaUrl(card.image?.url)
        }))
        : fallbackLogistics;

    // Auto-scroll logic: Move to next item every 5 seconds
    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((current) => current + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [items.length]);

    const handlePrev = () => setCurrentIndex(c => c - 1);
    const handleNext = () => setCurrentIndex(c => c + 1);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEndEvent = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    const actualActiveIndex = items.length > 0 ? (((currentIndex % items.length) + items.length) % items.length) : 0;

    return (
        <div className="w-full flex flex-col items-center justify-center bg-zinc-900 pb-16 overflow-hidden relative min-h-[800px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={getStrapiMediaUrl(strapiData?.backgroundImage?.url) || "/assets/Coffiling_page/DJI_0145_black-white-1.png"}
                    alt="Background"
                    fill
                    className="w-full h-full object-cover"
                />
            </div>

            {/* LOGISTICS Header */}
            <div className="w-full bg-[#8B0000] py-3 text-center mb-8 sticky md:relative top-0 md:top-0 z-30 shadow-md md:shadow-none">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    {strapiData?.heading || "LOGISTICS"}
                </h3>
            </div>

            {/* Carousel Container */}
            <div
                className="w-full max-w-[95%] md:max-w-7xl px-2 relative z-10 h-[600px] flex justify-center items-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndEvent}
            >

                {/* Navigation Buttons (Static) */}
                {items.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-[5px] md:left-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-[5px] md:right-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                    </>
                )}

                <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                    {items.length === 1 ? (
                        <div className="absolute top-1/2 left-1/2 w-full max-w-[600px] transition-all duration-700 ease-in-out transform opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]">
                            <div className="relative w-full">
                                <LogisticsCard title={items[0].title} imageUrl={items[0].imageUrl} />
                            </div>
                        </div>
                    ) : (
                        [-2, -1, 0, 1, 2].map((offset) => {
                            const vIndex = currentIndex + offset;
                            const dataIndex = ((vIndex % items.length) + items.length) % items.length;
                            const item = items[dataIndex];

                            let positionClass = "";
                            if (offset === 0) {
                                positionClass = "opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]";
                            } else if (offset === -1) {
                                positionClass = "opacity-40 scale-75 z-20 -translate-x-[160%] translate-y-[-50%] cursor-pointer";
                            } else if (offset === 1) {
                                positionClass = "opacity-40 scale-75 z-20 translate-x-[60%] translate-y-[-50%] cursor-pointer";
                            } else if (offset < -1) {
                                positionClass = "opacity-0 scale-50 z-10 -translate-x-[250%] translate-y-[-50%] pointer-events-none";
                            } else if (offset > 1) {
                                positionClass = "opacity-0 scale-50 z-10 translate-x-[150%] translate-y-[-50%] pointer-events-none";
                            }

                            return (
                                <div
                                    key={vIndex}
                                    onClick={() => {
                                        if (offset === -1) handlePrev();
                                        if (offset === 1) handleNext();
                                    }}
                                    className={`absolute top-1/2 left-1/2 w-full max-w-[600px] transition-all duration-700 ease-in-out transform ${positionClass}`}
                                >
                                    <div className="relative w-full">
                                        <div className={`pointer-events-none md:pointer-events-auto ${offset === 0 ? '' : 'pointer-events-none'}`}>
                                            <LogisticsCard title={item.title} imageUrl={item.imageUrl} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            {items.length > 0 && (
                <div className="w-[200px] md:w-[400px] h-2 bg-gray-700/50 relative rounded-full mt-12 overflow-hidden z-10">
                    <div
                        className="absolute left-0 top-0 h-full bg-[#E51D29] transition-all duration-500 ease-out"
                        style={{ width: `${((actualActiveIndex + 1) / items.length) * 100}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}
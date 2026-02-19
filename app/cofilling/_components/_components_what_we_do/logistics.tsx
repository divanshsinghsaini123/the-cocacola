
"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LogisticsCard, { ProductLogisticsCardProps } from "./__components/logistics_compnent";
import { useGetExtraDataQuery } from "@/src/store/slices/api";

interface logisticprops {
    logistics: ProductLogisticsCardProps[];
};

export default function LogisticsSection({ logistics }: logisticprops) {
    const { data, error } = useGetExtraDataQuery();
    const stickyNav = data?.data?.StickyNavbar;
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll logic: Move to next item every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % logistics.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [logistics.length, activeIndex]);

    const getVisibleItems = () => {
        if (logistics.length === 0) return [];
        // If only 1 item, just return it as active
        if (logistics.length === 1) return [{ ...logistics[0], key: 0 }];

        const prevIndex = (activeIndex - 1 + logistics.length) % logistics.length;
        const nextIndex = (activeIndex + 1) % logistics.length;

        return [
            { ...logistics[prevIndex], key: prevIndex },
            { ...logistics[activeIndex], key: activeIndex },
            { ...logistics[nextIndex], key: nextIndex }
        ];
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-zinc-900 pb-16 overflow-hidden relative min-h-[800px]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/Coffiling_page/DJI_0145_black-white-1.png"
                    alt="Background"
                    fill
                    className="w-full h-full object-cover"
                />
            </div>

            {/* LOGISTICS Header */}
            <div className={`w-full bg-[#E51D29] py-3 text-center mb-8 sticky md:relative ${stickyNav === true ? 'top-[80px]' : 'top-0'} md:top-0 z-30 shadow-md md:shadow-none`}>
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    LOGISTICS
                </h3>
            </div>

            {/* Carousel Container */}
            <div className="w-full max-w-[95%] md:max-w-7xl px-2 relative z-10 h-[600px] flex justify-center items-center">

                {/* Navigation Buttons (Static) */}
                {logistics.length > 1 && (
                    <>
                        <button
                            onClick={() => setActiveIndex((current) => (current - 1 + logistics.length) % logistics.length)}
                            className="absolute left-[5px] md:left-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                        <button
                            onClick={() => setActiveIndex((current) => (current + 1) % logistics.length)}
                            className="absolute right-[5px] md:right-[40px] top-1/2 -translate-y-1/2 z-50 p-1 md:p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronRight className="w-8 h-8 md:w-16 md:h-16 text-white" />
                        </button>
                    </>
                )}

                <div className="relative w-full h-full flex justify-center items-center">
                    {getVisibleItems().map((item, index) => {
                        const isSingle = logistics.length === 1;
                        const isActive = isSingle ? true : index === 1;
                        const isPrev = !isSingle && index === 0;
                        const isNext = !isSingle && index === 2;

                        let positionClass = "";
                        if (isActive) {
                            positionClass = "opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]";
                        } else if (isPrev) {
                            positionClass = "opacity-40 scale-75 z-20 -translate-x-[160%] translate-y-[-50%] cursor-pointer";
                        } else if (isNext) {
                            positionClass = "opacity-40 scale-75 z-20 translate-x-[60%] translate-y-[-50%] cursor-pointer";
                        }

                        return (
                            <div
                                key={item.key} // Stable key for animation
                                onClick={() => {
                                    if (isPrev) setActiveIndex((current) => (current - 1 + logistics.length) % logistics.length);
                                    if (isNext) setActiveIndex((current) => (current + 1) % logistics.length);
                                }}
                                className={`absolute top-1/2 left-1/2 w-full max-w-[600px] transition-all duration-700 ease-in-out transform ${positionClass}`}
                            >
                                <div className="relative w-full">
                                    {/* Card Content */}
                                    <div className={`pointer-events-none md:pointer-events-auto ${isActive ? '' : 'pointer-events-none'}`}>
                                        <LogisticsCard
                                            title={item.title}
                                            sections={item.sections}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-[200px] md:w-[400px] h-2 bg-gray-700/50 relative rounded-full mt-12 overflow-hidden z-10">
                <div
                    className="absolute left-0 top-0 h-full bg-[#E51D29] transition-all duration-500 ease-out"
                    style={{ width: `${((activeIndex + 1) / logistics.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
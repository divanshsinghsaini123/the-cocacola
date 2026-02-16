
"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LogisticsCard, { ProductLogisticsCardProps } from "./__components/logistics_compnent";

interface logisticprops {
    logistics: ProductLogisticsCardProps[];
};

export default function LogisticsSection({ logistics }: logisticprops) {
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-scroll logic: Move to next item every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % logistics.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [logistics.length]);

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
        <div className="w-full flex flex-col items-center justify-center bg-zinc-900 pb-16 overflow-hidden">
            {/* PRODUCT Header */}
            <div className="w-full bg-[#E51D29] py-3 text-center mb-8">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    LOGISTICS
                </h3>
            </div>

            {/* Carousel Container */}
            <div className="w-full max-w-[95%] md:max-w-7xl px-2 relative">
                <div className="flex w-full justify-center items-center gap-4">
                    {getVisibleItems().map((item, index) => {
                        // Logic assumes 3 items are returned. If 1, handle separately or ensure data has >1.
                        // Based on getVisibleItems, if length > 1 we return 3 items [prev, curr, next]. index 1 is current.
                        // If length === 1, we return 1 item. index 0 is current.

                        const isActive = logistics.length === 1 ? true : index === 1;

                        return (
                            <div
                                key={`${item.key}-${index}`}
                                className={`transition-all duration-500 ease-in-out transform flex flex-col justify-center items-center
                                    ${isActive
                                        ? 'w-full md:w-[70%] opacity-100 scale-100 z-20 order-2'
                                        : 'w-1/6 md:w-[15%] opacity-40 scale-75 z-10 hidden md:flex md:flex-col order-1'
                                    }
                                    ${!isActive && index === 2 ? 'order-3' : ''}
                                `}
                            >
                                <div className="relative w-full">
                                    {/* Arrows for Active Item */}
                                    {isActive && logistics.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setActiveIndex((current) => (current - 1 + logistics.length) % logistics.length)}
                                                className="absolute left-[-20px] md:left-[-60px] top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                                            >
                                                <ChevronLeft className="w-8 h-8 md:w-12 md:h-12 text-white" />
                                            </button>
                                            <button
                                                onClick={() => setActiveIndex((current) => (current + 1) % logistics.length)}
                                                className="absolute right-[-20px] md:right-[-60px] top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                                            >
                                                <ChevronRight className="w-8 h-8 md:w-12 md:h-12 text-white" />
                                            </button>
                                        </>
                                    )}

                                    {/* Card Content */}
                                    {/* We override the margin-top inside LogisticsCard by wrapping it or modifying styles. 
                                        Since LogisticsCard has mt-16 inside it, it might still push down. 
                                        But visual is fine. */}
                                    <div className="pointer-events-none md:pointer-events-auto">
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
            <div className="w-[200px] md:w-[400px] h-2 bg-gray-700/50 relative rounded-full mt-12 overflow-hidden">
                <div
                    className="absolute left-0 top-0 h-full bg-[#E51D29] transition-all duration-500 ease-out"
                    style={{ width: `${((activeIndex + 1) / logistics.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}
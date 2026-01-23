"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface Store {
    _id: string;
    name: string;
    image: string; // This is the logo
    link: string;
}

interface StoreCarouselProps {
    stores: Store[];
}

export default function StoreCarousel({ stores }: StoreCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 0;
        if (cardWidth === 0) return;

        // Add gap to card width (gap-6 = 24px)
        const stride = cardWidth + 24;
        const newIndex = Math.round(container.scrollLeft / stride);
        setActiveIndex(newIndex);
    };

    if (stores.length === 0) return null;

    return (
        <section className="w-full bg-[#EEEEEE] py-1">
            <div className="max-w-[1120px] mx-auto px-4 md:px-0">
                <h2 className="text-[32px] font-bold text-center mb-7 text-black">Buy now</h2>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {stores.map((store, index) => (
                        <div
                            key={`${store._id}-${index}`}
                            className="w-[280px] md:w-[350px] h-[320px] md:h-[400px] flex-shrink-0 snap-start bg-white rounded-[20px] p-8 flex flex-col justify-between shadow-sm group hover:shadow-md transition-shadow"
                        >
                            {/* Logo Area */}
                            <div className="relative w-full h-[120px] md:h-[200px] flex items-center justify-center">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + store.image}
                                        alt={store.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Content Area */}
                            <div>
                                <h3 className="text-[25px] font-bold text-black mb-4">
                                    {store.name}
                                </h3>

                                <Link
                                    href={store.link}
                                    target="_blank"
                                    className="inline-flex items-center text-black font-bold text-[16px] border-b-2 border-black pb-0.5 hover:border-transparent transition-all"
                                >
                                    Buy now
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-2 mt-4">
                    {stores.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-400'
                                }`}
                        ></div>
                    ))}
                </div>
            </div>
        </section>
    );
}

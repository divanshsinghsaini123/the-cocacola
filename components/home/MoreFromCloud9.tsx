"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { MoreFromCloud9Data, SectionItem } from "@/types/home";
import { getStrapiMediaUrl, isStrapiLocal } from "@/src/lib/strapi-media";

interface MoreFromCloud9Item {
    id: number;
    image: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    showButton: boolean;
}
interface MoreFromCloud9Props {
    data: MoreFromCloud9Data;
}
export default function MoreFromCloud9({ data }: MoreFromCloud9Props) {
    const isLocal = isStrapiLocal();

    const StrapiItems = (data?.items && data.items.length > 0) ? data.items.map((item: SectionItem) => {
        //sbse phle nikalenge url
        // @ts-ignore
        const imgurl = item.image.data?.attributes?.formats?.small?.url || item.image.formats?.small?.url || item.image?.url || "";
        const button = item.button;
        const showButton = button ? !button.disablebutton : false;
        return {
            id: item.id,
            image: imgurl,
            title: item.title,
            description: item.description,
            buttonText: button?.buttonText || item.buttonText,
            buttonLink: button?.buttonLink || item.buttonLink || "#",
            showButton
        }
    }) : [];
    const finalItems = StrapiItems;

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [itemsPerPage, setItemsPerPage] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth >= 768 ? 3 : 1);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 0;
        if (cardWidth === 0) return;

        // Add gap to card width (gap-6 = 24px)
        const stride = cardWidth + 24;
        const newPage = Math.round(container.scrollLeft / (stride * itemsPerPage));
        setActiveIndex(newPage);
    };

    return (
        data && (
            <section className="w-full bg-[var(--background)] -mb-5 pt-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-13">
                    <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-10 text-black px-4">{data.sectionTitle}</h2>

                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                        onScroll={checkScroll}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {finalItems.map((item: MoreFromCloud9Item, index: number) => (
                            <div key={`${item.id}-${index}`} className="w-[85vw] md:w-[calc((100%-48px)/3)] flex-shrink-0 snap-start bg-[var(--component)] rounded-[20px] overflow-hidden flex flex-col shadow-sm group">
                                <div className="relative h-[200px] md:h-[250px] w-full">
                                    <Image
                                        src={getStrapiMediaUrl(item.image)}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized={isLocal}
                                    />
                                </div>
                                <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                                    <h3 className="text-[20px] md:text-[24px] font-bold mb-3 text-black leading-[1.2]">
                                        {item.title}
                                    </h3>
                                    <p className="text-[14px] md:text-[16px] text-black mb-6 leading-[1.5]">
                                        {item.description}
                                    </p>
                                    {item.showButton && (
                                        <div className="mt-auto">
                                            <Link href={item.buttonLink} className="inline-flex items-center text-black font-bold text-[14px] md:text-[16px] group border-b-2 border-black hover:border-transparent transition-all pb-0.5">
                                                {item.buttonText}
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    {Math.ceil(finalItems.length / itemsPerPage) > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {Array.from({ length: Math.ceil(finalItems.length / itemsPerPage) }).map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (!scrollContainerRef.current) return;
                                        const container = scrollContainerRef.current;
                                        const cardWidth = container.firstElementChild?.clientWidth || 0;
                                        if (cardWidth === 0) return;
                                        const stride = cardWidth + 24; // gap-6
                                        container.scrollTo({
                                            left: index * stride * itemsPerPage,
                                            behavior: 'smooth'
                                        });
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${index === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-400'
                                        }`}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        ));
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";

export interface MoreFromCocaColaItem {
    id: number;
    image: string;
    title: string;
    description: string;
    buttonText: string;
    link: string;
}

export default function MoreFromCocaCola({ items: userItems }: { items?: MoreFromCocaColaItem[] }) {
    const defaultItems: MoreFromCocaColaItem[] = [
        {
            id: 1,
            image: "/assets/Home/coke-offering-vending.jpg",
            title: "Coca-Cola Vending",
            description: "Each time you make a purchase with your mobile wallet at select Coca-Cola vending machines, you’ll be one step closer to earning a drink reward.",
            buttonText: "Start Earning Today",
            link: "#"
        },
        {
            id: 2,
            image: "/assets/Home/coke-offering-refreshing-films.jpg",
            title: "Coca-Cola Refreshing Films",
            description: "Coca-Cola® Refreshing Films provides students the opportunity to create content for the big screen.",
            buttonText: "Check It Out",
            link: "#"
        },
        {
            id: 3,
            image: "/assets/Home/plusone-card.jpg",
            title: "you plus +one",
            description: "Have you downloaded yet? The +one app brings the universe of Coca-Cola® into the palm of your hand. Start earning rewards today!",
            buttonText: "Download Now",
            link: "#"
        },
        {
            id: 4,
            image: "/assets/Home/newExhibit.webp",
            title: "New Exhibit at World of Coca-Cola",
            description: "Experience the magic of Coca-Cola’s history like never before—step into Coca-Cola Stories at World of Coca-Cola.",
            buttonText: "Learn More",
            link: "#"
        },
        {
            id: 5,
            image: "/assets/Home/drinkup.webp",
            title: "Drink up what we’ve dreamed up!",
            description: "Coca-Cola Freestyle gives you the freedom to explore, pour, and enjoy your perfect drinks.",
            buttonText: "Explore and Pour",
            link: "#"
        }
    ];

    const finalItems = userItems || defaultItems;

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

    return (
        <section className="w-full bg-[#EEEEEE] -mb-5 pt-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-13">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-10 text-black px-4">More from Coca-Cola®</h2>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {finalItems.map((item, index) => (
                        <div key={`${item.id}-${index}`} className="w-[85vw] md:w-[calc((100%-48px)/3)] flex-shrink-0 snap-start bg-white rounded-[20px] overflow-hidden flex flex-col shadow-sm group">
                            <div className="relative h-[200px] md:h-[250px] w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[24px] font-bold mb-3 text-black leading-[1.2]">
                                    {item.title}
                                </h3>
                                <p className="text-[14px] md:text-[16px] text-black mb-6 leading-[1.5]">
                                    {item.description}
                                </p>
                                <div className="mt-auto">
                                    <Link href={item.link} className="inline-flex items-center text-black font-bold text-[14px] md:text-[16px] group border-b-2 border-black hover:border-transparent transition-all pb-0.5">
                                        {item.buttonText}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-2 mt-4">
                    {finalItems.map((_, index) => (
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

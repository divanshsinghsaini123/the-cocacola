"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

export default function PromosAndOffers() {
    const offers = [
        {
            id: 1,
            image: "/assets/pro&offer1.webp",
            title: "Enter for a chance to win groceries for a year",
            description: "There's nothing more comforting than a stocked kitchen. We'll take care of that all year.",
            link: "#"
        },
        {
            id: 2,
            image: "/assets/nascar-home-tile.png",
            title: "Coca-Cola® DAYTONA 500® Flyaway Sweepstakes",
            description: "Enter for your chance to win a NASCAR® VIP experience that will get your heart racing.",
            link: "#"
        }
    ];

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            if (scrollWidth > 0) {
                const relativeScroll = container.scrollLeft / scrollWidth;
                setActiveIndex(Math.round(relativeScroll));
            }
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollContainerRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="w-full bg-[#EEEEEE] py-10 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-10 text-black">Promos & Offers</h2>

                {/* Mobile: Scrollable, Desktop: Grid */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 sm:gap-6 sm:grid sm:grid-cols-2 sm:overflow-visible snap-x snap-mandatory pb-6 sm:pb-0 no-scrollbar cursor-grab active:cursor-grabbing"
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
                >
                    {offers.map((offer) => (
                        <div key={offer.id} className="min-w-[85%] sm:min-w-0 bg-white rounded-[20px] overflow-hidden flex flex-col snap-center shadow-sm select-none">
                            <div className="relative h-[250px] md:h-[430px] sm:h-[350px] w-full">
                                <Image
                                    src={offer.image}
                                    alt={offer.title}
                                    fill
                                    className="object-cover pointer-events-none"
                                />
                            </div>
                            <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    {offer.title}
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5]">
                                    {offer.description}
                                </p>
                                <div className="mt-auto">
                                    <Link href={offer.link} className="inline-flex items-center text-black font-bold text-[16px] group pointer-events-auto">
                                        <span className="border-b-2 border-black group-hover:border-transparent transition-all">Enter Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Pagination Indicator */}
                <div className="flex justify-center items-center gap-2 mt-4 sm:hidden">
                    {offers.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-400'
                                }`}
                        ></div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="flex justify-center mt-8 sm:mt-12">
                    <Link href="#" className="bg-black text-white w-[90%] sm:w-auto px-14 md:px-20 py-2 rounded-full font-bold text-[16px] tracking-wide hover:bg-gray-800 transition-colors text-center block sm:inline-block">
                        View all Offerings
                    </Link>
                </div>
            </div>
        </section>
    );
}

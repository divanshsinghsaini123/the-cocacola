"use client";

import React, { useState, useRef } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function PromosAndOffersPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 0;
        if (cardWidth === 0) return;

        // Add gap to card width (gap-6 = 24px)
        const stride = cardWidth + 24;
        const newIndex = Math.round(container.scrollLeft / stride);
        setActiveIndex(newIndex);
    };

    const promoItems = [
        {
            title: "Drink up what we’ve dreamed up!",
            desc: "Coca-Cola Freestyle gives you the freedom to explore, pour, and enjoy your perfect drinks.",
            link: "Explore and Pour",
            img: "/assets/promos&offeres/snap-camera-kit-onexp-tile-campaign-more-from-cc.png"
        },
        {
            title: "you plus +one",
            desc: "Have you downloaded yet? The +one app brings the universe of Coca-Cola® Into the palm of your hand. Start earning rewards today!",
            link: "Download Now",
            img: "/assets/promos&offeres/plusone-card.jpg"
        },
        {
            title: "Discover Your Tastebud Map",
            desc: "We’ve devised a quick, fun way to discover your ideal flavor pairings. Simply stick out your tongue and let us do the mapping. It’s not science, but the results might surprise you.",
            link: "Let's Do It",
            img: "/assets/promos&offeres/width1960.jpg"
        },
        {
            title: "New Exhibit at World of Coca-Cola",
            desc: "Experience the magic of Coca-Cola's history like never before—step into Coca-Cola Stories at World of Coca-Cola.",
            link: "Learn More",
            img: "/assets/promos&offeres/onexp-offerings-wocc.jpg"
        },
        {
            title: "Coca-Cola Refreshing Films",
            desc: "Coca-Cola® Refreshing Films provides students the opportunity to create content for the big screen.",
            link: "Check It Out",
            img: "/assets/promos&offeres/coke-offering-refreshing-films.jpg"
        },
        {
            title: "Coca-Cola Vending",
            desc: "Each time you make a purchase with your mobile wallet at select Coca-Cola vending machines, you’ll be one step closer to earning a drink reward.",
            link: "Start Earning Today",
            img: "/assets/promos&offeres/coke-offering-vending.jpg"
        }
    ];

    return (
        <main className="w-full bg-[#EEEEEE] min-h-screen py-10 lg:py-14">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-6">
                <div className="text-center mb-10 md:mb-14">
                    <h1 className="text-[30px] md:text-[38px] font-bold text-black mb-2 leading-tight">
                        Explore a World of Possibilities with Coca-Cola®
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-black font-medium max-w-6xl mx-auto">
                        Welcome to your one-stop shop for promotions, sweepstakes, and fun across all your favorite Coca-Cola brands.
                    </p>
                </div>

                {/* Hero-like Banner */}
                <div className="w-full h-[570px] md:h-[540px] lg:h-[570px] rounded-[18px] overflow-hidden relative mb-10">
                    <div className="absolute inset-0">
                        <Image
                            src="/assets/promos&offeres/coke-holiday-sweeps-banner-refresh-2-dt.png"
                            alt="Winter Adventure"
                            fill
                            className=" object-cover object-center "
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent md:bg-gradient-to-l md:from-black/60 md:via-black/30 md:to-transparent" />
                    </div>

                    <div className="relative h-full flex flex-col justify-end pb-10 md:pb-0 md:justify-center items-center md:items-end text-center md:text-left px-3 md:px-[60px] lg:px-[10px]">
                        <div className="max-w-[600px] text-black md:text-white space-y-2 md:space-y-3 flex flex-col items-center md:items-start">
                            <h2 className="leading-[1.3] text-[23px] md:text-[40px] lg:text-[35px] font-bold text-white">
                                You Could Win a Winter Adventure in Sweden
                            </h2>
                            <p className="text-[16px] md:text-[16px] leading-[1.5] max-w-[500px] text-white px-3 md:px-0">
                                Enter our holiday sweepstakes for your chance to win an unforgettable 5-day/4-night journey to the winter wonderland of Sweden, including a stay at the world-famous ICEHOTEL.
                            </p>
                            <div className="pt-3 w-full md:w-auto flex justify-center md:justify-start">
                                <Link
                                    href="#"
                                    className="text-center block w-[290px] h-[40px] lg:w-[327px] lg:h-[40px] md:inline-block bg-white text-black text-[18px] py-1.5 font-bold rounded-full hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Enter Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* All Promotions Section */}
                <div className="mt-20 mb-10 max-w-[1120px] mx-auto">
                    <div className="text-center mb-5 md:mb-7">
                        <h2 className="text-[28px] md:text-[32px] font-bold text-black mb-2 leading-tight">
                            All Promotions. All Good.
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-black font-medium max-w-6xl mx-auto px-4">
                            Take advantage now of these special promotions, and check back often so you don&apos;t miss out!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-full shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/sprite-squad-dec-tile.png"
                                    alt="Sprite Squad"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Anta Claus + Winter Spiced Cranberry
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    Enter for your chance to win a signed Anthony Edwards jersey or basketball, or a Sprite Winter Spiced Cranberry 12-pack and cooler.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Learn More</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-full shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/2l-10k-fail-safe-sweep-tile.png"
                                    alt="Win $10,000"
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Big Prize. Easy Entry.
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    Enter once per day for your chance to take home $10,000.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Enter Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-full shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/dko-ice-cold-diet-offerings-tile.png"
                                    alt="Diet Coke Perfection"
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Everything You Need for Ice Cold Diet Coke Perfection
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    Enter now for your chance to win your own ice machine, two Diet Coke tumblers, a pack of straws for that perfect sip, plus two 12-packs of Diet Coke.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Enter Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Discover More Banner */}
                    <div className="mt-30 max-w-[1150px] mx-auto bg-black rounded-[18px] py-8 px-6 md:px-10 text-center mb-30">
                        <h2 className="text-[20px] md:text-[32px] font-bold text-white mb-4">
                            Discover a refreshing world of more
                        </h2>
                        <p className="text-[13px] md:text-[16px] text-white mb-8 max-w-6xl mx-auto leading-relaxed font-medium">
                            Sign up to stay in the loop on promotions, new flavors, exclusive offers and more from the Coca-Cola brands you love.
                        </p>
                        <Link
                            href="#"
                            className="inline-block px-20 py-1 rounded-full border-2 border-white text-white font-bold text-[16px] hover:bg-white hover:text-black transition-colors duration-300"
                        >
                            Get Updates
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {/* Card 4: NASCAR */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-[600px] shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/promo-nascar-tile.png"
                                    alt="NASCAR Sweepstakes"
                                    fill
                                    className="object-cover transition-transform duration-500 "
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Coca-Cola® DAYTONA 500® Flyaway Sweepstakes
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    Enter for your chance to win a NASCAR® VIP experience that will get your heart racing.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Enter Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 5: Gold Peak */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-[600px] shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/gold-peak-holiday-tile.png"
                                    alt="Gold Peak Groceries"
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Enter for a chance to win groceries for a year
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    There’s nothing more comforting than a stocked kitchen. We’ll take care of that all year.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Enter Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 6: Future Careers */}
                        <div className="bg-white rounded-[20px] overflow-hidden flex flex-col h-[600px] shadow-sm group">
                            <div className="relative w-full h-[277px] overflow-hidden">
                                <Image
                                    src="/assets/promos&offeres/fca-offers-tile.png"
                                    alt="Future Careers Academy"
                                    fill
                                    className="object-cover transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8 flex flex-col flex-grow text-left">
                                <h3 className="text-[20px] md:text-[22px] font-bold mb-3 text-black leading-[1.2]">
                                    Future Careers Academy
                                </h3>
                                <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                    Discover how your passion for soccer can shape your future. This first-of-its-kind interactive program connects you with industry pros to explore pro soccer jobs beyond the pitch.
                                </p>
                                <div className="mt-auto">
                                    <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                        <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">Learn More</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* More from Coca-Cola Section */}
                    <div className="mt-20 pb-20">
                        <div className="text-center mb-10 md:mb-14">
                            <h2 className="text-[20px] md:text-[32px] font-bold text-black mb-2 leading-tight">
                                More from Coca-Cola
                            </h2>
                        </div>
                        <div
                            ref={scrollRef}
                            onScroll={checkScroll}
                            className="h-[604px] flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {promoItems.map((item, index) => (
                                <div key={index} className="w-[85vw] md:w-[calc((100%-48px)/3)] flex-shrink-0 snap-start bg-white rounded-[20px] overflow-hidden flex flex-col h-full shadow-sm group">
                                    <div className="relative w-full h-[277px] overflow-hidden">
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow text-left">
                                        <h3 className="text-[20px] md:text-[24px] font-bold mb-3 text-black leading-[1.2]">
                                            {item.title}
                                        </h3>
                                        <p className="text-[16px] text-black mb-6 leading-[1.5] flex-grow">
                                            {item.desc}
                                        </p>
                                        <div className="mt-auto">
                                            <Link href="#" className="inline-flex items-center text-black font-bold text-[16px] group/link">
                                                <span className="border-b-2 border-black group-hover/link:border-transparent transition-all">{item.link}</span>
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
                            {promoItems.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-300'}`}
                                ></div>
                            ))}
                        </div>
                    </div>


                </div>
            </div>
        </main>
    );
}




"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

interface BrandImageCarouselProps {
    images: string[];
}

export default function BrandImageCarousel({ images }: BrandImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Create enough duplicates to simulate infinity without jumping logic (prevents flickering)
    // 30 sets should be practically unreachable for normal users
    const SETS_COUNT = 30;
    const extendedImages = images.length > 1
        ? Array(SETS_COUNT).fill(images).flat()
        : images;

    // Initial scroll positioning tracking
    const [isFormatted, setIsFormatted] = useState(false);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 0;
        if (cardWidth === 0) return;

        // Gap is set to 24px (gap-6)
        const stride = cardWidth + 24;
        const scrollLeft = container.scrollLeft;

        // Calculate the "real" index relative to the original list
        const rawIndex = Math.round(scrollLeft / stride);
        const realIndex = rawIndex % images.length;
        setActiveIndex(realIndex);
    };

    // Initial centering setup
    useEffect(() => {
        if (images.length > 1) {
            const timer = setTimeout(() => {
                if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const cardWidth = container.firstElementChild?.clientWidth || 0;
                    if (cardWidth === 0) return;

                    const stride = cardWidth + 24;
                    const oneSetWidth = images.length * stride;

                    // Start in the middle set (index 15)
                    const middleSetIndex = Math.floor(SETS_COUNT / 2);

                    container.style.scrollBehavior = 'auto'; // Instant jump
                    container.scrollLeft = oneSetWidth * middleSetIndex;
                    container.style.scrollBehavior = 'smooth'; // Re-enable smooth

                    setIsFormatted(true);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [images.length]);

    if (!images || images.length === 0) return null;

    return (
        <div className="w-full">
            <div className="max-w-full mx-auto px-4 md:px-0">
                <div
                    ref={scrollContainerRef}
                    className={`flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden ${isFormatted ? 'scroll-smooth' : ''}`}
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {extendedImages.map((imageSrc, index) => (
                        <div
                            key={index}
                            className={`w-full md:w-[1150px] shrink-0 snap-center rounded-[20px] overflow-hidden ${images.length === 1 ? 'mx-auto' : ''}`}
                        >
                            <div className="relative w-full aspect-[2/1]">
                                <Image
                                    src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + imageSrc}
                                    alt={`Brand banner ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index >= (SETS_COUNT / 2 * images.length) && index < ((SETS_COUNT / 2 + 1) * images.length)} // Prioritize middle set
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                {images.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-[-10px] mb-8">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-400'
                                    }`}
                            ></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

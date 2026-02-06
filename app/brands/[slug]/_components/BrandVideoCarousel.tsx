"use client";

import { useRef, useState, useEffect } from "react";
import VideoCard from "./VideoCard";

interface BrandVideoCarouselProps {
    videos: string[];
}

export default function BrandVideoCarousel({ videos }: BrandVideoCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Create enough duplicates to simulate infinity without jumping logic (prevents flickering)
    // 30 sets should be practically unreachable for normal users
    const SETS_COUNT = 30;
    const extendedVideos = videos.length > 1
        ? Array(SETS_COUNT).fill(videos).flat()
        : videos;

    // Initial scroll positioning tracking
    const [isFormatted, setIsFormatted] = useState(false);

    const [itemsPerPage, setItemsPerPage] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            // Videos are 2 per line on md (1112 width, 548px cards -> 2 items)
            setItemsPerPage(window.innerWidth >= 768 ? 2 : 1);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const cardWidth = container.firstElementChild?.clientWidth || 0;
        if (cardWidth === 0) return;

        // Gap is set to 24px (gap-6) - make sure this matches className (16px = gap-4)
        const gap = 16;
        const stride = cardWidth + gap;
        const scrollLeft = container.scrollLeft;

        // Calculate the "real" index relative to the original list
        const rawIndex = Math.round(scrollLeft / stride);
        const realIndex = rawIndex % videos.length;

        // Convert item index to page index
        const pageIndex = Math.floor(realIndex / itemsPerPage);
        setActiveIndex(pageIndex);
    };

    // Initial centering setup
    useEffect(() => {
        if (videos.length > 1) {
            const timer = setTimeout(() => {
                if (scrollContainerRef.current) {
                    const container = scrollContainerRef.current;
                    const cardWidth = container.firstElementChild?.clientWidth || 0;
                    if (cardWidth === 0) return;

                    const gap = 16;
                    const stride = cardWidth + gap;
                    const oneSetWidth = videos.length * stride;

                    // Start in the middle set
                    const middleSetIndex = Math.floor(SETS_COUNT / 2);

                    container.style.scrollBehavior = 'auto'; // Instant jump
                    container.scrollLeft = oneSetWidth * middleSetIndex;
                    container.style.scrollBehavior = 'smooth'; // Re-enable smooth

                    setIsFormatted(true);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [videos.length]);

    if (!videos || videos.length === 0) return null;

    return (
        <div className="w-full">
            {/* 1112px = 548px * 2 + 16px gap */}
            <div className="max-w-[1112px] mx-auto">
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden hide-scrollbar"
                    ref={scrollContainerRef}
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: isFormatted ? 'smooth' : 'auto' }}
                >
                    {extendedVideos.map((video, idx) => (
                        <div key={idx} className="w-[300px] md:w-[548px] h-[170px] md:h-[308px] shrink-0 rounded-3xl overflow-hidden bg-black shadow-lg snap-start relative">
                            <VideoCard videoUrl={video} index={idx} />
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                {Math.ceil(videos.length / itemsPerPage) > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {Array.from({ length: Math.ceil(videos.length / itemsPerPage) }).map((_, idx) => (
                            <div key={idx}
                                onClick={() => {
                                    if (!scrollContainerRef.current) return;
                                    const container = scrollContainerRef.current;
                                    const cardWidth = container.firstElementChild?.clientWidth || 0;
                                    if (cardWidth === 0) return;

                                    const gap = 16;
                                    const stride = cardWidth + gap;
                                    const setWidth = videos.length * stride;

                                    // Calculate closest target in the current set or nearby
                                    const currentScroll = container.scrollLeft;
                                    const currentSet = Math.round(currentScroll / setWidth);

                                    // Target specific item (first item of the page)
                                    const targetItemIndex = idx * itemsPerPage;

                                    const targetScroll = (currentSet * videos.length + targetItemIndex) * stride;

                                    container.scrollTo({
                                        left: targetScroll,
                                        behavior: 'smooth'
                                    });
                                }}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex ? 'w-8 bg-black' : 'w-2 bg-gray-400'}`}></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
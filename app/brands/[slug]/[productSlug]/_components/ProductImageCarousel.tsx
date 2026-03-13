"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface ProductImageCarouselProps {
    images: string[];
    productName: string;
}

export default function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.offsetWidth;
        scrollRef.current.scrollTo({
            left: width * index,
            behavior: "smooth"
        });
        setCurrentIndex(index);
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.offsetWidth;
        const position = scrollRef.current.scrollLeft;
        const newIndex = Math.round(position / width);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const nextSlide = () => {
        if (currentIndex < images.length - 1) {
            scrollTo(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            scrollTo(currentIndex - 1);
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full lg:w-[544px] h-[350px] md:h-[544px] bg-white rounded-[20px] flex items-center justify-center shadow-sm text-gray-400">
                No Images Available
            </div>
        );
    }

    return (
        <div className="w-full lg:w-[544px] h-[350px] md:h-[544px] bg-white rounded-[20px] shadow-sm relative group overflow-hidden">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
                {images.map((img: string, idx: number) => (
                    <div key={idx} className="relative w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                        <div className="relative w-full h-full transition-transform duration-500">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_GCORE_CDN_URL}/${img}`}
                                alt={`${productName} - Image ${idx + 1}`}
                                fill
                                className="object-contain rounded-lg"
                                priority={idx === 0}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur border border-gray-100 rounded-full flex items-center justify-center shadow-md text-black hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-0 pointer-events-auto z-10"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex === images.length - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur border border-gray-100 rounded-full flex items-center justify-center shadow-md text-black hover:bg-white hover:scale-110 transition-all duration-200 disabled:opacity-0 pointer-events-auto z-10"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                    </button>

                    {/* Slide Indicators */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10 pointer-events-none">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-black" : "w-2 bg-black/20"
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

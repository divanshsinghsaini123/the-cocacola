"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface EventGalleryCarouselProps {
    images: {
        id?: number;
        Picture?: any;
        AltText?: string;
    }[];
    eventName: string;
}

export default function EventGalleryCarousel({ images, eventName }: EventGalleryCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Auto-scroll logic: Move to next item every 5 seconds
    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((current) => current + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handlePrev = () => setCurrentIndex(c => c - 1);
    const handleNext = () => setCurrentIndex(c => c + 1);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEndEvent = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        }
        if (isRightSwipe) {
            handlePrev();
        }
    };

    if (!images || images.length === 0) return null;

    const actualActiveIndex = ((currentIndex % images.length) + images.length) % images.length;

    return (
        <div className="w-full flex flex-col items-center justify-center relative py-12 overflow-hidden">
            <h2 className="text-3xl font-bold text-foreground mb-8 md:mb-12 ">Event Gallery</h2>

            {/* Carousel Container */}
            <div
                className="w-full max-w-[95%] md:max-w-[1400px] px-2 relative z-10 h-[400px] md:h-[650px] flex justify-center items-center group"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEndEvent}
            >
                {/* Navigation Buttons (Static) */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-[5px] md:left-[20px] top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-105"
                        >
                            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-[5px] md:right-[20px] top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-105"
                        >
                            <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-white" />
                        </button>
                    </>
                )}

                <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
                    {images.length === 1 ? (
                        <div className="absolute top-1/2 left-1/2 w-full max-w-[1000px] transition-all duration-700 ease-in-out transform opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%] h-[400px] md:h-[650px]">
                            <CarouselCard img={images[0]} index={0} eventName={eventName} />
                        </div>
                    ) : (
                        [-2, -1, 0, 1, 2].map((offset) => {
                            const vIndex = currentIndex + offset;
                            const dataIndex = ((vIndex % images.length) + images.length) % images.length;
                            const item = images[dataIndex];

                            let positionClass = "";
                            if (offset === 0) {
                                positionClass = "opacity-100 scale-100 z-30 -translate-x-1/2 translate-y-[-50%]";
                            } else if (offset === -1) {
                                positionClass = "opacity-40 scale-[0.80] z-20 -translate-x-[110%] md:-translate-x-[120%] translate-y-[-50%] cursor-pointer";
                            } else if (offset === 1) {
                                positionClass = "opacity-40 scale-[0.80] z-20 translate-x-[10%] md:translate-x-[20%] translate-y-[-50%] cursor-pointer";
                            } else if (offset < -1) {
                                positionClass = "opacity-0 scale-50 z-10 -translate-x-[200%] translate-y-[-50%] pointer-events-none";
                            } else if (offset > 1) {
                                positionClass = "opacity-0 scale-50 z-10 translate-x-[100%] translate-y-[-50%] pointer-events-none";
                            }

                            return (
                                <div
                                    key={vIndex}
                                    onClick={() => {
                                        if (offset === -1) handlePrev();
                                        if (offset === 1) handleNext();
                                    }}
                                    className={`absolute top-1/2 left-1/2 w-full max-w-[80%] md:max-w-[1100px] h-[400px] md:h-[650px] transition-all duration-700 ease-in-out transform ${positionClass}`}
                                >
                                    <div className={`relative w-full h-full pointer-events-none md:pointer-events-auto ${offset === 0 ? '' : 'pointer-events-none'}`}>
                                        <CarouselCard img={item} index={dataIndex} eventName={eventName} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-[60%] md:w-[400px] h-1 md:h-2 bg-foreground/10 relative rounded-full mt-6 md:mt-12 overflow-hidden z-10">
                <div
                    className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-500 ease-out"
                    style={{ width: `${((actualActiveIndex + 1) / images.length) * 100}%` }}
                ></div>
            </div>
        </div>
    );
}

function CarouselCard({ img, index, eventName }: { img: any; index: number; eventName: string }) {
    const imgUrl = img.Picture?.url || img.Picture?.formats?.large?.url;
    if (!imgUrl) return null;

    return (
        <div className="group relative rounded-3xl overflow-hidden bg-component shadow-2xl border border-foreground/10 w-full h-full">
            <img
                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imgUrl}
                alt={img.AltText || `${eventName} - Image ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-700"
                loading="lazy"
            />
            {img.AltText && (
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end">
                    <span className="text-white text-lg md:text-2xl font-semibold p-6 md:p-10 w-full tracking-wide">
                        {img.AltText}
                    </span>
                </div>
            )}
        </div>
    );
}

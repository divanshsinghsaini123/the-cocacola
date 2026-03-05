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
    const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Auto-scroll logic: Move to next item every 5 seconds (only in carousel mode)
    useEffect(() => {
        if (images.length <= 1 || viewMode !== "carousel") return;
        const interval = setInterval(() => {
            setCurrentIndex((current) => current + 1);
        }, 10000);

        return () => clearInterval(interval);
    }, [images.length, viewMode]);

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
        <div className="w-full flex flex-col items-center justify-center relative py-6 md:py-8 overflow-hidden">
            <div className="flex flex-col items-center w-full max-w-[95%] md:max-w-[1400px] px-2 md:px-0 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Event Gallery</h2>

                {/* View Mode Tabs */}
                {images.length > 1 && (
                    <div className="flex bg-foreground/5 p-1 rounded-full mb-8 border border-foreground/10 relative z-20">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${viewMode === "grid" ? "bg-red-600 text-white shadow-md transform scale-105" : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Grid View
                        </button>
                        <button
                            onClick={() => setViewMode("carousel")}
                            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${viewMode === "carousel" ? "bg-red-600 text-white shadow-md transform scale-105" : "text-foreground/70 hover:text-foreground hover:bg-foreground/10"}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Carousel
                        </button>
                    </div>
                )}

                {images.length > 1 && viewMode === "carousel" && (
                    <div className="flex md:hidden items-center justify-center self-center text-foreground/50 text-sm mb-6 w-full animate-pulse">
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        <span>Swipe to explore</span>
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </div>
                )}
            </div>

            {viewMode === "carousel" ? (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-100 md:bg-opacity-90 md:backdrop-blur-2xl flex flex-col items-center justify-center w-screen h-[100dvh]">
                    {/* Close Button */}
                    <button
                        onClick={() => setViewMode("grid")}
                        className="absolute top-6 right-4 md:top-8 md:right-8 z-[110] p-3 bg-white/10 hover:bg-white/30 text-white rounded-full transition-all backdrop-blur-md"
                    >
                        <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Mobile swipe hint */}
                    <div className="absolute top-6 left-0 w-full flex md:hidden items-center justify-center text-white/50 text-sm animate-pulse z-[110] pointer-events-none">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span>Swipe</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </div>

                    {/* Carousel Container */}
                    <div
                        className="w-full h-full md:h-[90vh] max-w-[600px] relative z-10 flex flex-col justify-center items-center group bg-black md:rounded-[2rem] overflow-hidden md:shadow-2xl"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEndEvent}
                    >
                        {/* Blurred Background from active image */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            <img
                                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + (images[actualActiveIndex]?.Picture?.url || '')}
                                className="w-full h-full object-cover opacity-40 blur-3xl scale-125 transition-all duration-700"
                                alt="Background blur"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
                        </div>

                        {/* Navigation Buttons (Static) */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                    className="absolute left-[10px] md:left-[20px] top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-110 border border-white/20"
                                >
                                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    className="absolute right-[10px] md:right-[20px] top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-110 border border-white/20"
                                >
                                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </button>
                            </>
                        )}

                        {/* Main Image Container */}
                        <div className="relative w-full h-[calc(100%-120px)] mt-12 md:mt-0 flex justify-center items-center z-10 p-2 md:p-4 pb-0">
                            <img
                                key={`main-img-${actualActiveIndex}`}
                                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + (images[actualActiveIndex]?.Picture?.url || images[actualActiveIndex]?.Picture?.formats?.large?.url)}
                                alt={images[actualActiveIndex]?.AltText || `${eventName} - Image`}
                                className="w-full h-full object-contain drop-shadow-2xl max-h-full"
                            />
                            {images[actualActiveIndex]?.AltText && (
                                <div className="absolute bottom-4 w-full text-center p-4 pointer-events-none">
                                    <span className="text-white text-base md:text-lg font-medium drop-shadow-md">{images[actualActiveIndex].AltText}</span>
                                </div>
                            )}
                        </div>

                        {/* Instagram-style Thumbnails Strip at the bottom */}
                        <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-3 md:gap-5 z-20 px-4">
                            {images.length > 1 && [-1, 0, 1].map((offset) => {
                                const vIndex = currentIndex + offset;
                                const dataIndex = ((vIndex % images.length) + images.length) % images.length;
                                const item = images[dataIndex];
                                const imgUrl = item.Picture?.url || item.Picture?.formats?.small?.url || item.Picture?.formats?.large?.url;
                                if (!imgUrl) return null;

                                return (
                                    <div
                                        key={`thumb-${vIndex}-${offset}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (offset === -1) handlePrev();
                                            if (offset === 1) handleNext();
                                        }}
                                        className={`relative rounded-lg md:rounded-xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer border-[2px] md:border-[3px] ${offset === 0 ? 'w-16 h-24 md:w-20 md:h-28 border-white scale-110 z-10 box-content' : 'w-14 h-20 md:w-16 md:h-24 border-white/20 opacity-50 hover:opacity-100 hover:border-white/60 box-content'}`}
                                    >
                                        <img src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imgUrl} className="w-full h-full object-cover" alt="Thumbnail preview" />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-[1000px] grid grid-cols-3 gap-1 md:gap-2 relative z-10 mt-4 mx-auto">
                    {images.map((img, idx) => {
                        const imgUrl = img.Picture?.url || img.Picture?.formats?.large?.url;
                        if (!imgUrl) return null;

                        return (
                            <div
                                key={img.id || idx}
                                className="group relative aspect-square overflow-hidden bg-component cursor-pointer"
                                onClick={() => {
                                    setCurrentIndex(idx);
                                    setViewMode("carousel");
                                }}
                            >
                                <img
                                    src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imgUrl}
                                    alt={img.AltText || `${eventName} - Image ${idx + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white font-medium bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        View
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// function CarouselCard({ img, index, eventName }: { img: any; index: number; eventName: string }) {
//     const imgUrl = img.Picture?.url || img.Picture?.formats?.large?.url;
//     if (!imgUrl) return null;

//     return (
//         <div className="group relative rounded-3xl overflow-hidden bg-component shadow-2xl border border-foreground/10 w-full h-full">
//             <img
//                 src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imgUrl}
//                 alt={img.AltText || `${eventName} - Image ${index + 1}`}
//                 className="w-full h-full object-fit transition-all duration-700"
//                 loading="lazy"
//             />
//             {img.AltText && (
//                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end">
//                     <span className="text-white text-lg md:text-2xl font-semibold p-6 md:p-10 w-full tracking-wide">
//                         {img.AltText}
//                     </span>
//                 </div>
//             )}
//         </div>
//     );
// }

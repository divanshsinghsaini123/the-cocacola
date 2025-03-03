"use client";

import React, { useRef } from "react";
import Event from "./event";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function EventsCarousel({ events }: { events: any[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (!events || events.length === 0) {
        return <div className="text-center py-10">No events found.</div>;
    }

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth; // Scroll by the visible width
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="relative w-full py-4 group">
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Hide default scrollbar with CSS styles below or global class */}
                <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>

                {events.map((event: any) => (
                    <div
                        key={event.id}
                        className="w-full md:w-[calc(50%-1rem)] flex-shrink-0 snap-center md:snap-start"
                    >
                        <Event event={event} />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            {events.length > 2 && (
                <>
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 bg-background/90 hover:bg-background text-foreground border border-foreground/10 shadow-lg p-3 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-105"
                        aria-label="Previous Events"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 bg-background/90 hover:bg-background text-foreground border border-foreground/10 shadow-lg p-3 rounded-full transition-all z-10 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transform hover:scale-105"
                        aria-label="Next Events"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}
        </div>
    );
}

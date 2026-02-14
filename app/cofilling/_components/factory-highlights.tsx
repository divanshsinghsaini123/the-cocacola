"use client";

import React from "react";

const FactoryHighlights = () => {
    return (
        <section className="relative w-full h-[808px] bg-[#eeeeee] flex flex-col items-center justify-center py-16 px-4">

            {/* Background Texture Overlay (Optional, using a pattern or similar if available, otherwise just color) */}
            <div className="absolute inset-0 w-full h-full z-0 opacity-100 bg-[url('/assets/Coffiling_page/yan-ots-UuBR5kbvt4Y-unsplash-41.png')] bg-cover pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center mb-12">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-widest mb-2 text-black">
                    WATCH OUR INTRO VIDEO
                </h3>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase text-black">
                    HELL FACTORY HIGHLIGHTS
                </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-4 mb-16">
                {/* Video 1 */}
                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/_CYtIFAVhDg"
                        title="HELL Energy Drink - QUALITY PACK FACTORY"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>

                {/* Video 2 */}
                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/-oFQyxMcvwg"
                        title="Introducing the factory of HELL ENERGY (Short version)"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {/* CTA Button */}
            <div className="relative z-10">
                <button className="px-4 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                    GET IN TOUCH
                </button>
            </div>

        </section>
    );
};

export default FactoryHighlights;

"use client";

import React from "react";

interface FactoryHighlightsProps {
    data?: {
        title?: string;
        mainheading?: string;
        youtubeURL1?: string;
        youtubeURL2?: string;
        button?: {
            buttonText?: string;
            disablebutton?: boolean;
        };
    };
}

const FactoryHighlights: React.FC<FactoryHighlightsProps> = ({ data }) => {
    if (!data || (!data.title && !data.mainheading && !data.youtubeURL1 && !data.youtubeURL2)) {
        return null;
    }

    const showButton = data?.button ? !data.button.disablebutton : true;

    return (
        <section className="relative w-full h-[808px] bg-[#eeeeee] flex flex-col items-center justify-center py-16 px-4">

            {/* Background Texture Overlay (Optional, using a pattern or similar if available, otherwise just color) */}
            <div className="absolute inset-0 w-full h-full z-0 opacity-100 bg-[url('/assets/Coffiling_page/yan-ots-UuBR5kbvt4Y-unsplash-41.png')] bg-cover pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center mb-12">
                <h3 className="text-sm md:text-base font-bold uppercase tracking-widest mb-2 text-black">
                    {data?.title}
                </h3>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase text-black">
                    {data?.mainheading}
                </h2>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl px-4 mb-16">
                {/* Video 1 */}
                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={data?.youtubeURL1}
                        title=" Energy Drink - QUALITY PACK FACTORY"
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
                        src={data?.youtubeURL2}
                        title="Introducing the factory of  ENERGY (Short version)"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>

            {/* CTA Button */}
            {showButton && (
                <div className="relative z-10">
                    <button
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                        {data?.button?.buttonText || "GET IN TOUCH"}
                    </button>
                </div>
            )}

        </section>
    );
};

export default FactoryHighlights;


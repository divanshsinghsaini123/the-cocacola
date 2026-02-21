"use client";

import React from "react";
import Image from "next/image";

export interface ProductLogisticsCardProps {
    title?: string; // "PRODUCT SIZE: 330 ML"
    sections: {
        id: string; // "can" | "pallet" | "tray" | "truck"
        heading?: string; // "PALLET SIZE", "TRAY SIZE", "TRUCK SIZE"
        stats: {
            label: string; // "can / tray"
            value: string; //"24"
        }[];
        diagram: string;
    }[];
}

const LogisticsCard: React.FC<ProductLogisticsCardProps> = ({ title, sections }) => {
    return (
        <div className="w-full max-w-[635px] h-[490px] mx-auto bg-black border border-[#E51D29] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">


            {/* Header */}
            {title && (
                <div className="w-full bg-[#E51D29] py-0 text-center shrink-0 h-[60px] flex items-center justify-center relative z-10">
                    <h3 className="text-white text-lg font-black uppercase tracking-wider translate-y-[2px]">
                        {title}
                    </h3>
                </div>
            )}

            {/* Grid Content */}
            <div className="grid grid-cols-2 grow h-[430px] relative z-10">
                {sections.map((section, index) => {
                    const isRightColumn = index % 2 === 1;
                    const isBottomRow = index >= 2;

                    let borderClass = "border-[#E51D29]";
                    if (!isRightColumn) borderClass += " border-r-2";
                    if (!isBottomRow) borderClass += " border-b-2";

                    return (
                        <div key={section.id} className={`p-5 flex flex-col relative h-[215px] ${borderClass}`}>

                            {/* Heading */}
                            {section.heading && (
                                <h4 className="text-[#E51D29] text-base font-bold uppercase mb-4 tracking-wide">
                                    {section.heading}
                                </h4>
                            )}

                            {/* Content Layout */}
                            <div className={section.id === "4" ? "flex flex-col justify-between h-full w-full relative" : "flex justify-between items-start h-full w-full relative"}>

                                {/* Stats List */}
                                <div className={`flex flex-col gap-1 z-10 shrink-0 ${!section.heading ? 'mt-4' : ''}`}>
                                    {section.stats.map((stat, statIndex) => (
                                        <div key={statIndex} className="flex items-baseline gap-2 text-white/90">
                                            <span className="text-[#E51D29] text-lg font-bold leading-none">
                                                {stat.value}
                                            </span>
                                            <span className="text-xs font-bold opacity-90 leading-none">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Diagram/Image */}
                                <div className={section.id === "4" ? "w-full h-24 relative mt-auto" : "absolute right-[-10px] bottom-[-10px] md:w-36 md:h-36 w-24 h-24"}>
                                    <Image
                                        src={section.diagram}
                                        alt={section.heading || section.id}
                                        fill
                                        className={section.id === "4" ? "object-contain object-bottom" : "object-contain object-bottom right-0"}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}


                {/* Vertical Divider Overlay to make it distinct if needed, or rely on borders */}
            </div>
        </div>
    );
};

export default LogisticsCard;

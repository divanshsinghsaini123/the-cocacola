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
        <div className="w-full max-w-5xl mx-auto bg-black border border-[#E51D29] rounded-3xl overflow-hidden shadow-2xl mt-16">

            {/* Header */}
            {title && (
                <div className="w-full bg-[#E51D29] py-4 text-center">
                    <h3 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-wider">
                        {title}
                    </h3>
                </div>
            )}

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {sections.map((section, index) => {
                    // Determine borders based on index (2x2 grid logic)
                    // index 0: Top Left (border-r, border-b)
                    // index 1: Top Right (border-b)
                    // index 2: Bottom Left (border-r)
                    // index 3: Bottom Right (none)

                    const isRightColumn = index % 2 === 1;
                    const isBottomRow = index >= 2;

                    let borderClass = "border-[#E51D29]";
                    if (!isRightColumn) borderClass += " md:border-r";
                    if (!isBottomRow) borderClass += " border-b";

                    return (
                        <div key={section.id} className={`p-6 flex flex-col justify-between relative min-h-[250px] md:min-h-[280px] ${borderClass}`}>

                            {/* Heading */}
                            {section.heading && (
                                <h4 className="text-[#E51D29] text-xl font-black uppercase mb-2 tracking-wide">
                                    {section.heading}
                                </h4>
                            )}

                            {/* Content Layout: Text Left, Image Right */}
                            <div className="flex justify-between items-end h-full w-full">

                                {/* Stats List */}
                                <div className="flex flex-col gap-1 z-10 shrink-0">
                                    {section.stats.map((stat, statIndex) => (
                                        <div key={statIndex} className="flex items-baseline gap-2 text-white">
                                            <span className="text-[#E51D29] text-2xl md:text-3xl font-black">
                                                {stat.value}
                                            </span>
                                            <span className="text-sm md:text-base font-bold uppercase whitespace-nowrap opacity-90">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Diagram/Image */}
                                <div className="relative w-32 h-32 md:w-48 md:h-48 shrink-0">
                                    <Image
                                        src={section.diagram}
                                        alt={section.heading || section.id}
                                        fill
                                        className="object-contain object-bottom right-0"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LogisticsCard;

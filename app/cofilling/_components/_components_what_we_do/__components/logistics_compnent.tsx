"use client";

import React from "react";
import Image from "next/image";

export interface ProductLogisticsCardProps {
    title?: string;
    imageUrl?: string;
}

const LogisticsCard: React.FC<ProductLogisticsCardProps> = ({ title, imageUrl }) => {
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
            {imageUrl && (
                <div className="relative w-full grow p-4 bg-black flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={imageUrl}
                            alt={title || "Logistics card"}
                            fill
                            className="object-contain rounded-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogisticsCard;


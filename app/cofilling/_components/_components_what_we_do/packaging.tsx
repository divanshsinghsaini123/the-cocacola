


import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetExtraDataQuery } from "@/src/store/slices/api";

export default function Packaging() {
    const { data, error } = useGetExtraDataQuery();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stickyNav = isMounted ? data?.data?.StickyNavbar : false;
    return (
        <div className="w-full relative flex flex-col items-center bg-black pb-20">
            {/* Section Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/assets/Coffiling_page/BG1-4.png"
                    alt="Packaging Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Header */}
            <div
                className="w-full bg-[#8B0000] py-3 text-center mb-12 sticky z-30 shadow-md md:shadow-none transition-all duration-300"
                style={{ top: stickyNav ? '80px' : '0px' }}
            >
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    PACKAGING
                </h3>
            </div>

            {/* Container for Cards */}
            <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-6 justify-center items-stretch text-white relative z-10">

                {/* Card 1: CAN SIZES */}
                <div className="w-full lg:w-2/5 border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-4 backdrop-blur-sm">

                    {/* Card Header Title - Positioned floating above/within */}
                    <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center">
                        <div className="bg-[#E51D29] py-1 px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)]">
                            <h4 className="text-white text-lg md:text-xl font-black italic uppercase skew-x-[20deg] tracking-wider whitespace-nowrap">
                                CAN SIZES
                            </h4>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col items-center gap-4 flex-grow pt-10 md:pt-12">
                        {/* Cans Image */}
                        <div className="relative w-full h-[100px] md:h-[130px] flex justify-center items-end">
                            <Image
                                src="/assets/Coffiling_page/250ml330ml500ml_CANs-copy-1.png"
                                alt="Can Sizes"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Details Box */}
                        <div className="w-full border border-[#E51D29] rounded-[16px] p-4 flex flex-col md:flex-row justify-between items-stretch relative bg-black/60 backdrop-blur-md mt-auto">
                            {/* Left Column */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <h5 className="font-bold text-base md:text-sm mb-2 leading-tight">Empty can<br />production</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>250 ml</li>
                                        <li>500 ml</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] bg-[#E51D29] self-stretch mx-4 shrink-0"></div>
                            <div className="block md:hidden h-[1px] w-full bg-[#E51D29] my-4"></div>

                            {/* Right Column */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <h5 className="font-bold text-base md:text-sm mb-2">By filling</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>250 ml</li>
                                        <li>330 ml</li>
                                        <li>500 ml</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Card 2: MULTIPACKS */}
                <div className="w-full lg:w-2/5 border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-4 backdrop-blur-sm">

                    {/* Card Header Title */}
                    <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center">
                        <div className="bg-[#E51D29] py-1 px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)]">
                            <h4 className="text-white text-lg md:text-xl font-black italic uppercase skew-x-[20deg] tracking-wider whitespace-nowrap">
                                MULTIPACKS
                            </h4>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col items-center gap-4 flex-grow pt-10 md:pt-12">
                        {/* Multipacks Image Row */}
                        <div className="relative w-full h-[100px] md:h-[130px] flex justify-center items-end gap-2 md:gap-4">
                            {/* Images acting as placeholders relative to layout, adjusted relative sizes */}
                            <div className="relative w-[25%] aspect-square">
                                <Image src="/assets/Coffiling_page/4PACK_250ml_PAPER.png" alt="4 Pack" fill className="object-contain" />
                            </div>
                            <div className="relative w-[30%] aspect-square">
                                <Image src="/assets/Coffiling_page/6PACK_500ml_PAPER.png" alt="6 Pack" fill className="object-contain" />
                            </div>
                            <div className="relative w-[35%] aspect-square">
                                <Image src="/assets/Coffiling_page/8PACK_250ml_PAPER.png" alt="8 Pack" fill className="object-contain" />
                            </div>
                        </div>

                        {/* Details Box */}
                        <div className="w-full border border-[#E51D29] rounded-[16px] p-4 flex flex-col md:flex-row justify-between items-stretch relative bg-black/60 backdrop-blur-md mt-auto">
                            {/* Left Column - Foil */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <h5 className="font-bold text-base md:text-sm mb-2">Foil</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>4pack (250 ml)</li>
                                        <li>6pack (250 ml, 330 ml)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] bg-[#E51D29] self-stretch mx-4 shrink-0"></div>
                            <div className="block md:hidden h-[1px] w-full bg-[#E51D29] my-4"></div>

                            {/* Right Column - Carton */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <h5 className="font-bold text-base md:text-sm mb-2">Carton</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>4pack (250 ml)</li>
                                        <li>8pack (250 ml)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Row 2: Can Design & Trays */}
            <div className="w-full max-w-[1200px] mx-auto px-4 flex flex-col lg:flex-row gap-6 justify-center items-stretch text-white mt-12 relative z-10">

                {/* Card 3: CAN DESIGN */}
                <div className="w-full lg:w-2/5 border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-4 backdrop-blur-sm">

                    {/* Header */}
                    <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center">
                        <div className="bg-[#E51D29] py-1 px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)]">
                            <h4 className="text-white text-lg md:text-xl font-black italic uppercase skew-x-[20deg] tracking-wider whitespace-nowrap">
                                CAN DESIGN
                            </h4>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col items-center gap-4 flex-grow pt-10 md:pt-12">
                        {/* Images */}
                        <div className="relative w-full h-[100px] md:h-[130px] flex justify-center items-center gap-6">
                            <div className="relative w-1/2 h-full">
                                <Image
                                    src="/assets/Coffiling_page/WEB-Your_Brand_ENERGY_DRINK_3can_3D-2-e1706555816288.png"
                                    alt="Can Design Cans"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="relative w-1/4 h-full">
                                <Image
                                    src="/assets/Coffiling_page/opening_tab_pictograms.png"
                                    alt="Colored Tabs"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* Details Box */}
                        <div className="w-full border border-[#E51D29] rounded-[16px] p-4 flex flex-col md:flex-row justify-between items-stretch relative bg-black/60 backdrop-blur-md mt-auto">
                            {/* Left Column */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>matt finish</li>
                                        <li>glossy finish</li>
                                        <li>HD quality</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] bg-[#E51D29] self-stretch mx-4 shrink-0"></div>
                            <div className="block md:hidden h-[1px] w-full bg-[#E51D29] my-4"></div>

                            {/* Right Column */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start">
                                <div className="text-left w-fit max-w-[200px]">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>coloured pull ring</li>
                                        <li>coloured can end (silver or black)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 4: TRAYS */}
                <div className="w-full lg:w-2/5 border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-4 backdrop-blur-sm">

                    {/* Header */}
                    <div className="absolute -top-4 left-0 right-0 z-20 flex justify-center">
                        <div className="bg-[#E51D29] py-1 px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)]">
                            <h4 className="text-white text-lg md:text-xl font-black italic uppercase skew-x-[20deg] tracking-wider whitespace-nowrap">
                                TRAYS
                            </h4>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col items-center gap-4 flex-grow pt-10 md:pt-12">
                        {/* Images */}
                        <div className="relative w-full h-[100px] md:h-[130px] flex justify-center items-end gap-2">
                            <div className="relative w-1/3 h-full">
                                <Image src="/assets/Coffiling_page/24x330ml_tray.png" alt="Tray 1" fill className="object-contain" />
                            </div>
                            <div className="relative w-1/3 h-full">
                                <Image src="/assets/Coffiling_page/24x330ml_tray.png" alt="Tray 2" fill className="object-contain" />
                            </div>
                            <div className="relative w-1/3 h-full">
                                <Image src="/assets/Coffiling_page/12x500ml_tray.png" alt="Tray 3" fill className="object-contain" />
                            </div>
                        </div>

                        {/* Details Box */}
                        <div className="w-full border border-[#E51D29] rounded-[16px] p-4 flex flex-col md:flex-row justify-between items-stretch relative bg-black/60 backdrop-blur-md mt-auto">
                            {/* Column 1: Unit */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start px-2">
                                <h5 className="font-bold text-base md:text-sm mb-2">Unit</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>24 x 250 ml</li>
                                        <li>24 x 330 ml</li>
                                        <li>12 x 500 ml</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] bg-[#E51D29] self-stretch mx-2 shrink-0"></div>

                            {/* Column 2: Packaging */}
                            <div className="flex-[1.5] text-center flex flex-col items-center justify-start px-2">
                                <h5 className="font-bold text-base md:text-sm mb-2">Packaging</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4 leading-tight">
                                        <li>normal tray with shrink foil</li>
                                        <li>high tray without shrink foil</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-[1px] bg-[#E51D29] self-stretch mx-2 shrink-0"></div>

                            {/* Column 3: Design */}
                            <div className="flex-1 text-center flex flex-col items-center justify-start px-2">
                                <h5 className="font-bold text-base md:text-sm mb-2">Design</h5>
                                <div className="text-left w-fit">
                                    <ul className="space-y-1 font-bold text-base md:text-sm list-disc pl-4">
                                        <li>offset</li>
                                        <li>flexo</li>
                                        <li>masterflex</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Transportation Units */}
            <div className="w-full max-w-[500px] mx-auto px-4 mt-16 relative z-10">
                <div className="w-full border border-[#E51D29] rounded-[24px] bg-gradient-to-b from-black/80 to-[#1a0505]/80 relative overflow-visible flex flex-col pt-4 backdrop-blur-sm">

                    {/* Header */}
                    <div className="absolute -top-6 left-0 right-0 z-20 flex justify-center">
                        <div className="bg-[#E51D29] py-1 px-8 md:px-12 skew-x-[-20deg] shadow-[0_4px_8px_rgba(229,29,41,0.5)] text-center">
                            <h4 className="text-white text-lg md:text-xl font-black italic uppercase skew-x-[20deg] tracking-wider leading-none">
                                TRANSPORTATION<br />UNITS
                            </h4>
                        </div>
                    </div>

                    <div className="p-4 md:p-6 flex flex-col items-center gap-4 pt-12 md:pt-16">
                        {/* Images Row */}
                        <div className="flex flex-row justify-center items-end gap-4 md:gap-8 w-full">
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-[80px] md:w-[120px] aspect-[3/4]">
                                    <Image src="/assets/Coffiling_page/logistics-pictograms_250ml-PALLET_CHEP.png" alt="EUR/CHEP" fill className="object-contain" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-[80px] md:w-[120px] aspect-[3/4]">
                                    <Image src="/assets/Coffiling_page/logistics-pictograms_250ml_PALLET_DD-2.png" alt="DD" fill className="object-contain" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="relative w-[60px] md:w-[80px] aspect-[1/2]">
                                    <Image src="/assets/Coffiling_page/logistics-pictograms_10TC-DISPLAY.png" alt="Display" fill className="object-contain" />
                                </div>
                            </div>
                        </div>

                        {/* Details Box */}
                        <div className="w-full border border-[#E51D29] rounded-[16px] p-4 flex justify-between items-center relative bg-black/60 backdrop-blur-md mt-2">
                            <div className="flex-1 text-center border-r border-[#E51D29]">
                                <span className="font-bold text-base md:text-sm text-white">EUR / CHEP</span>
                            </div>
                            <div className="flex-1 text-center border-r border-[#E51D29]">
                                <span className="font-bold text-base md:text-sm text-white">DD</span>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="font-bold text-base md:text-sm text-white">Display</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 mb-8 relative z-10 w-full">
                <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                    GET IN TOUCH
                </button>
                <button
                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                    className="px-10 py-3 bg-white text-black text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-gray-200 min-w-[200px]">
                    FIND OUT MORE
                </button>
            </div>
        </div>
    );
}
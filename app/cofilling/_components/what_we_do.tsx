"use client";
import Packaging from "./_components_what_we_do/packaging";
import Product from "./_components_what_we_do/product";
import LogisticsSection from "./_components_what_we_do/logistics";
import { useGetExtraDataQuery } from "@/src/store/slices/api";

import { useState, useEffect } from "react";

interface WhatWeDoProps {
    data?: {
        heading?: string;
        product?: any;
        packaging?: any;
        logicstics?: any;
    };
}

const WhatWeDo: React.FC<WhatWeDoProps> = ({ data: strapiData }) => {
    const { data, error } = useGetExtraDataQuery();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const stickyNav = isMounted ? data?.data?.StickyNavbar : false;
    const hasLogisticsData = !!(strapiData?.logicstics?.card && strapiData.logicstics.card.length > 0);

    return (
        <section className="w-full bg-black flex flex-col">
            {/* Header Bar */}
            <div
                className="w-full bg-[#E51D29] py-4 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center md:sticky z-40 shadow-md transition-all duration-300"
                // style={{ top: stickyNav ? '80px' : '0px' }}
                style={{ top: '0px' }}
            >
                <h2 className="text-white text-2xl md:text-4xl font-black italic uppercase tracking-wider mb-2 md:mb-0">
                    {strapiData?.heading || "WHAT WE DO"}
                </h2>
                <div className="flex flex-row justify-between md:justify-center w-full md:w-auto md:gap-6 gap-2 mt-2 md:mt-0">
                    <button
                        onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-transparent border-2 border-white text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-white hover:text-[#E51D29] transition-all duration-300 font-bold text-[11px] sm:text-xs md:text-base uppercase tracking-wider whitespace-nowrap flex-1 md:flex-none"
                    >
                        PRODUCT
                    </button>
                    <button
                        onClick={() => document.getElementById('packaging-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-transparent border-2 border-white text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-white hover:text-[#E51D29] transition-all duration-300 font-bold text-[11px] sm:text-xs md:text-base uppercase tracking-wider whitespace-nowrap flex-1 md:flex-none"
                    >
                        PACKAGING
                    </button>
                    {hasLogisticsData && (
                        <button
                            onClick={() => document.getElementById('logistics-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-transparent border-2 border-white text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-white hover:text-[#E51D29] transition-all duration-300 font-bold text-[11px] sm:text-xs md:text-base uppercase tracking-wider whitespace-nowrap flex-1 md:flex-none"
                        >
                            LOGISTICS
                        </button>
                    )}
                </div>
            </div>

            <div id="product-section">
                <Product data={strapiData?.product} />
            </div>
            <div id="packaging-section">
                <Packaging data={strapiData?.packaging} />
            </div>
            {hasLogisticsData && (
                <div id="logistics-section">
                    <LogisticsSection data={strapiData?.logicstics} />
                </div>
            )}
            {/* Placeholder for other products if needed later */}
        </section>
    );
};

export default WhatWeDo;


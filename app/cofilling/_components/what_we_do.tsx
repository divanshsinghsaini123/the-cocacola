"use client";
import { logisticsData } from "../_data/logistics_data";
import { productsData } from "../_data/products_data";
import Packaging from "./_components_what_we_do/packaging";
import Product from "./_components_what_we_do/product";
import LogisticsSection from "./_components_what_we_do/logistics";
const WhatWeDo = () => {


    return (
        <section className="w-full bg-black flex flex-col">
            {/* Header Bar */}
            <div className="w-full bg-[#E51D29] py-6 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40 shadow-md">
                <h2 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-wider mb-4 md:mb-0">
                    WHAT WE DO
                </h2>
                <div className="flex gap-8 text-white font-bold text-lg uppercase tracking-wider">
                    <button
                        onClick={() => document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="hover:opacity-80 transition-opacity"
                    >
                        PRODUCT
                    </button>
                    <button
                        onClick={() => document.getElementById('packaging-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="hover:opacity-80 transition-opacity"
                    >
                        PACKAGING
                    </button>
                    <button
                        onClick={() => document.getElementById('logistics-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="hover:opacity-80 transition-opacity"
                    >
                        LOGISTICS
                    </button>
                </div>
            </div>

            <div id="product-section">
                <Product products={productsData} />
            </div>
            <div id="packaging-section">
                <Packaging />
            </div>
            <div id="logistics-section">
                <LogisticsSection logistics={logisticsData} />
            </div>
            {/* Placeholder for other products if needed later */}
        </section>
    );
};

export default WhatWeDo;

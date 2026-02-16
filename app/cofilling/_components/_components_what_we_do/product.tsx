"use client";

import React from "react";
import Image from "next/image";
import ProductComponent, { ProductProps } from "./__components/product_componet";

interface ProductSectionProps {
    productData: ProductProps;
}

const Product: React.FC<ProductSectionProps> = ({ productData }) => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* PRODUCT Header */}
            <div className="w-full bg-[#8B0000] py-3 text-center">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    PRODUCTS
                </h3>
            </div>

            {/* Main Product Display */}
            <ProductComponent {...productData} />

            {/* PRODUCT Footer */}
            <div className="w-full h-[813px] relative py-20 mt-16 flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Coffiling_page/zygra_ENERGY_DRINK_portfolio-1.png"
                        alt="Footer Background"
                        fill
                        className="object-contain"
                    />
                    <div className="absolute inset-0" /> {/* Overlay for text readability */}
                </div>

                <div className="relative z-10 flex flex-col items-center gap-6 px-4">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-white text-2xl md:text-3xl font-bold italic uppercase tracking-wider">
                            YOU DON'T HAVE A BRAND?
                        </h3>
                        <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-wider">
                            TAKE ONE OF THESE!
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-white/80 font-bold text-lg md:text-xl uppercase tracking-widest my-4">
                        <span>ZYGRA</span>
                        <span>SLANG</span>
                        <span>ROUZED</span>
                        <span>PLAGE</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        <button className="px-8 py-3 bg-[#E51D29] text-white font-bold uppercase rounded hover:bg-red-700 transition-colors tracking-wide">
                            GET IN TOUCH
                        </button>
                        <button className="px-8 py-3 bg-white text-black font-bold uppercase rounded hover:bg-gray-200 transition-colors tracking-wide">
                            FIND OUT MORE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;

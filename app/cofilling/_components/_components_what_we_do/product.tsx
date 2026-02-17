"use client";

import React from "react";
import Image from "next/image";
import ProductComponent, { ProductProps } from "./__components/product_componet";

interface ProductSectionProps {
    products: ProductProps[];
}

const Product: React.FC<ProductSectionProps> = ({ products }) => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* PRODUCT Header */}
            <div className="w-full bg-[#8B0000] py-3 text-center">
                <h3 className="text-white text-xl md:text-2xl font-bold uppercase tracking-widest">
                    PRODUCTS
                </h3>
            </div>

            {/* Main Product Display Loop */}
            {products.map((product, index) => (
                <ProductComponent key={index} {...product} />
            ))}

            {/* PRODUCT Footer */}
            <div className="w-full h-[813px] relative flex flex-col items-center justify-center text-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/Coffiling_page/zygra_ENERGY_DRINK_portfolio-1.png"
                        alt="Footer Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0" /> {/* Overlay for text readability */}
                </div>

                <div className="relative z-10 flex flex-col items-center gap-10 px-4">
                    <div className="flex flex-col gap-3">
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

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                            Get In Touch
                        </button>
                        <button
                            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                            className="px-10 py-3 bg-white text-black text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-gray-200 min-w-[200px]">
                            Find Out More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;

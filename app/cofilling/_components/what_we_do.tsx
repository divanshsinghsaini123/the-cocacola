"use client";

import React from "react";
import Product from "./_components_what_we_do/product";
import { Pill, BookOpen, Atom, Ban } from "lucide-react";

const WhatWeDo = () => {

    const energyDrinkData = {
        title: "ENERGY DRINK",
        subtitle: "choose your flavour",
        layout: "left" as const,
        // Using BG2 as a likely candidate, assuming it matches the theme. 
        backgroundImage: "/assets/Coffiling_page/BG2-e1706537132149.png",
        productImage: "/assets/Coffiling_page/WEB-Your_Brand_ENERGY_DRINK_3can_3D-1-e1706517266345.png",
        flavours: [
            {
                columns: 2 as const,
                items: [
                    "classic", "plum",
                    "sugarfree", "cherry",
                    "half-sugar", "blackcurrant",
                    "apple", "cola",
                    "cranberry", "red grape",
                    "mango-orange", "watermelon",
                    "pear", "multivitamin"
                ]
            }
        ],
        features: [
            {
                icon: <Pill className="w-10 h-10 text-white" />,
                text: "vitamin content"
            },
            {
                icon: <BookOpen className="w-10 h-10 text-white" />,
                text: "recipe on request"
            }
        ],
        subFeatures: [
            {
                icon: <Atom className="w-6 h-6" />,
                text: "no preservatives"
            },
            {
                icon: <Ban className="w-6 h-6" />,
                text: "no aspartame"
            }
        ]
    };

    const logisticsData = {
        title: "PRODUCT SIZE: 330 ML",
        sections: [
            {
                id: "can",
                heading: "",
                stats: [
                    { value: "24", label: "can / tray" },
                    { value: "240", label: "can / layer" },
                    { value: "2160", label: "can / pallet" }
                ],
                diagram: "/assets/Coffiling_page/330ml-CAN.png"
            },
            {
                id: "pallet",
                heading: "PALLET SIZE",
                stats: [
                    { value: "9", label: "layer / pallet" }
                ],
                diagram: "/assets/Coffiling_page/330ml-PALLET.png"
            },
            {
                id: "tray",
                heading: "TRAY SIZE",
                stats: [
                    { value: "10", label: "tray / layer" },
                    { value: "90", label: "tray / pallet" }
                ],
                diagram: "/assets/Coffiling_page/330ml-TRAY.png"
            },
            {
                id: "truck",
                heading: "TRUCK SIZE",
                stats: [
                    { value: "30", label: "pallet / truck" }
                ],
                diagram: "/assets/Coffiling_page/330ml-TRUCK.png"
            }
        ]
    };

    return (
        <section className="w-full bg-black flex flex-col">
            {/* Header Bar */}
            <div className="w-full bg-[#E51D29] py-6 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center sticky top-0 z-40 shadow-md">
                <h2 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-wider mb-4 md:mb-0">
                    WHAT WE DO
                </h2>
                <div className="flex gap-8 text-white font-bold text-lg uppercase tracking-wider">
                    <button className="hover:opacity-80 transition-opacity">PRODUCT</button>
                    <button className="hover:opacity-80 transition-opacity">PACKAGING</button>
                    <button className="hover:opacity-80 transition-opacity">LOGISTICS</button>
                </div>
            </div>

            <Product
                productData={energyDrinkData}
            />

            {/* Placeholder for other products if needed later */}
        </section>
    );
};

export default WhatWeDo;

"use client";

import React from "react";
import ProductComponent from "./_components_what_we_do/__components/product_componet";
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

    return (
        <section className="w-full bg-black">
            <ProductComponent {...energyDrinkData} />

            {/* Placeholder for other products if needed later */}
        </section>
    );
};

export default WhatWeDo;

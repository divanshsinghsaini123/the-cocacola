"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeroData } from "@/types/home";
import { getStrapiMediaUrl, isStrapiLocal } from "@/src/lib/strapi-media";

interface HeroProps {
    data: HeroData;
    buttonStyle?: { BackgroundHexColor?: string; FontHexColor?: string };
}

export default function Hero({ data, buttonStyle }: HeroProps) {
    const isLocal = isStrapiLocal();

    // Support both single image objects and arrays of images
    const desktopImages = Array.isArray(data?.imageDesktop)
        ? data.imageDesktop
        : data?.imageDesktop
            ? [data.imageDesktop]
            : [];

    const mobileImages = Array.isArray(data?.imageMobile)
        ? data.imageMobile
        : data?.imageMobile
            ? [data.imageMobile]
            : [];

    const getImageUrl = (img: any) => {
        return img?.data?.attributes?.formats?.large?.url || img?.formats?.large?.url || img?.url || "";
    };

    // Auto-scroll indices
    const [desktopIndex, setDesktopIndex] = useState(0);
    const [mobileIndex, setMobileIndex] = useState(0);

    useEffect(() => {
        if (desktopImages.length <= 1) return;
        const interval = setInterval(() => {
            setDesktopIndex((prev) => (prev + 1) % desktopImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [desktopImages.length]);

    useEffect(() => {
        if (mobileImages.length <= 1) return;
        const interval = setInterval(() => {
            setMobileIndex((prev) => (prev + 1) % mobileImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [mobileImages.length]);

    const button = data?.button;
    const showButton = button ? !button.disablebutton : data?.ShowButton;
    const buttonText = button?.buttonText || data?.ButtonText;
    const buttonLink = button?.buttonLink || data?.ButttonLink || "#";

    return (
        <section className="w-full bg-[var(--background)] pt-4 lg:pt-14 pb-4 lg:pb-14">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-6">
                <div className="relative w-full h-[500px] md:h-[540px] lg:h-[570px] rounded-[18px] overflow-hidden">
                    {/* Background Images */}
                    <div className="absolute inset-0">
                        {/* Mobile Images (Cross-Fade) */}
                        {mobileImages.map((img, index) => {
                            const url = getImageUrl(img);
                            if (!url) return null;
                            return (
                                <Image
                                    key={img.id || index}
                                    src={getStrapiMediaUrl(url)}
                                    alt="Hero Mobile Banner"
                                    fill
                                    className={`object-fit object-right md:hidden absolute inset-0 transition-opacity duration-1000 ${index === mobileIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                    priority={index === 0}
                                    unoptimized={isLocal}
                                />
                            );
                        })}

                        {/* Desktop Images (Cross-Fade) */}
                        {desktopImages.map((img, index) => {
                            const url = getImageUrl(img);
                            if (!url) return null;
                            return (
                                <Image
                                    key={img.id || index}
                                    src={getStrapiMediaUrl(url)}
                                    alt="Hero Desktop Banner"
                                    fill
                                    className={`hidden md:block object-cover object-center absolute inset-0 transition-opacity duration-1000 ${index === desktopIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                                        }`}
                                    priority={index === 0}
                                    unoptimized={isLocal}
                                />
                            );
                        })}

                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/10 md:to-transparent z-20" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-start pt-8 pb-8 lg:pt-0 md:justify-center md:pt-0 md:pb-0 items-center md:items-start text-center md:text-left px-6 md:px-[60px] lg:px-[80px] z-30">
                        <div className="max-w-[600px] w-full flex-1 md:flex-none text-black md:text-white flex flex-col items-center md:items-start">
                            <div className="space-y-2 md:space-y-5 flex flex-col items-start md:items-start">
                                <h1 className="leading-[1.3] text-[23px] md:text-[40px] lg:text-[35px] font-bold text-white">
                                    {data?.heading}
                                </h1>
                                <p className="text-left text-[16px] md:text-[16px] leading-[1.5] max-w-[500px] text-white px-3 md:px-0">
                                    {data?.description
                                        ?.map((block) => block.children?.map((child) => child.text).join(""))
                                        .join(" ")}
                                </p>
                            </div>
                            {showButton && buttonText &&
                                (<div className="mt-auto md:mt-8 pt-4 w-full md:w-auto flex justify-center md:block">

                                    <Link
                                        href={buttonLink}
                                        style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined}
                                        className="flex items-center justify-center w-[290px] h-[40px] lg:w-[327px] lg:h-[40px] md:inline-flex bg-[var(--component)] text-black text-[18px] font-bold rounded-full hover:bg-opacity-80 transition-all duration-200"
                                    >
                                        {buttonText}
                                    </Link>

                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

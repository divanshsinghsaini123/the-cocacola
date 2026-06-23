"use client";

import Image from "next/image";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface HeroProps {
    data?: {
        heading?: string;
        subheading?: string;
        description?: string;
        logo?: { url?: string };
        backgroundvideo?: { url?: string };
        leftbutton?: { buttonText?: string; disablebutton?: boolean };
        rightbutton?: { buttonText?: string; disablebutton?: boolean };
        stats?: {
            totalcapacity?: string;
            canPerhour?: string;
            fillinglines?: string;
            aluminiumEmptyCanLines?: string;
        };
    };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
    if (!data || (!data.heading && !data.logo)) {
        return null;
    }

    const showLeftButton = data?.leftbutton ? !data.leftbutton.disablebutton : true;
    const showRightButton = data?.rightbutton ? !data.rightbutton.disablebutton : true;

    return (
        <section className="relative w-full min-h-screen lg:min-h-[800px] lg:h-[120vh] overflow-hidden bg-black flex flex-col">
            {/* Background Video */}
            <video
                key={data?.backgroundvideo?.url || "default-video"}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            >
                <source src={getStrapiMediaUrl(data?.backgroundvideo?.url) || "/assets/Coffiling_page/main_video.webm"} type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col justify-center pt-24 lg:pt-32 pb-16 lg:pb-12 space-y-12 lg:space-y-0">

                {/* Main Grid: Logo Left, Text Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left: Logo */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-[200px] h-[100px] lg:w-[250px] lg:h-[120px]">
                            <Image
                                src={getStrapiMediaUrl(data?.logo?.url) || "/assets/Coffiling_page/SmartCofilling_powered_by_HELL_logo_4C_darkbase-e1706280670447.png"}
                                alt="Smart Co-Filling Powered by HELL"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right: Text Content */}
                    <div className="text-white text-center lg:text-left space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-wider leading-tight">
                                {data?.heading || "The Best Advanced Automated Beverage Production Facility"}
                            </h1>
                            <p className="text-lg lg:text-xl font-semibold uppercase tracking-wide opacity-90">
                                {data?.subheading || "Built by the team behind established energy drinks,"}
                            </p>
                            <p className="text-lg lg:text-lg font-medium uppercase tracking-wide opacity-80">
                                {data?.description || "packaged water, and carbonated beverages, our co-filling runs on systems already proven at scale."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Content Wrapper */}
                <div className="mt-12 lg:mt-20 flex flex-col gap-12 lg:gap-20 w-full">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center border-t border-white/20 pt-8">

                        {/* Stat 1 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">
                                {data?.stats?.totalcapacity || "6,000,000,000"}
                            </span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">total capacity</span>
                        </div>

                        {/* Stat 2 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">
                                {data?.stats?.canPerhour || "750,000"}
                            </span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">can / hour</span>
                        </div>

                        {/* Stat 3 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">
                                {data?.stats?.fillinglines || "8"}
                            </span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">filling lines</span>
                        </div>

                        {/* Stat 4 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">
                                {data?.stats?.aluminiumEmptyCanLines || "3"}
                            </span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">aluminium empty can lines</span>
                        </div>
                    </div>

                    {/* Buttons - Centered at Bottom */}
                    {(showLeftButton || showRightButton) && (
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pb-8">
                            {showLeftButton && (
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-10 py-3 bg-[#E51D29] text-white text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-red-700 min-w-[200px]">
                                    {data?.leftbutton?.buttonText || "Get In Touch"}
                                </button>
                            )}
                            {showRightButton && (
                                <button
                                    onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
                                    className="px-10 py-3 bg-white text-black text-base font-bold uppercase tracking-wider rounded-2xl transition-colors hover:bg-gray-200 min-w-[200px]">
                                    {data?.rightbutton?.buttonText || "Find Out More"}
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Hero;


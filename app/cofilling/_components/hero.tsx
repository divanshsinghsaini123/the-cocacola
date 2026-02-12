"use client";

import React from "react";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative w-full h-[150vh] min-h-[800px] overflow-hidden bg-black">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
            >
                <source src="/assets/Coffiling_page/main_video.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col pt-32 pb-12">

                {/* Main Grid: Logo Left, Text Right */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left: Logo */}
                    <div className="flex justify-center lg:justify-start">
                        <div className="relative w-[200px] h-[100px] lg:w-[250px] lg:h-[120px]">
                            <Image
                                src="/assets/Coffiling_page/SmartCofilling_powered_by_HELL_logo_4C_darkbase-e1706280670447.png"
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
                                The World's Largest State-of-the-Art Megafactory,
                            </h1>
                            <p className="text-lg lg:text-xl font-semibold uppercase tracking-wide opacity-90">
                                By a same-owned corporate group,
                            </p>
                            <p className="text-lg lg:text-lg font-medium uppercase tracking-wide opacity-80">
                                Manufacturing and filling aluminium beverage cans at one location.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Content Wrapper */}
                <div className="mt-20 flex flex-col gap-30 w-full">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center border-t border-white/20 pt-8">

                        {/* Stat 1 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">6,000,000,000</span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">total capacity</span>
                        </div>

                        {/* Stat 2 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">750,000</span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">can / hour</span>
                        </div>

                        {/* Stat 3 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">8</span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">filling lines</span>
                        </div>

                        {/* Stat 4 */}
                        <div className="flex flex-col items-center">
                            <span className="text-2xl lg:text-4xl font-black italic block mb-2">3</span>
                            <span className="text-sm lg:text-base font-bold uppercase tracking-wider opacity-90">aluminium empty can lines</span>
                        </div>
                    </div>

                    {/* Buttons - Centered at Bottom */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pb-8">
                        <button className="px-6 py-2 bg-[#E51D29] text-white text-base rounded-2xl font-bold uppercase tracking-wider rounded transition-colors hover:bg-red-700 w-full sm:w-auto min-w-[150px]">
                            Get In Touch
                        </button>
                        <button className="px-6 py-2 bg-white text-black text-base rounded-2xl font-bold uppercase tracking-wider rounded transition-colors hover:bg-gray-200 w-full sm:w-auto min-w-[150px]">
                            Find Out More
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Hero;

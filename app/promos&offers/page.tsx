
import React from 'react';
import Image from "next/image";
import Link from "next/link";

export default function PromosAndOffersPage() {
    return (
        <main className="w-full bg-[#EEEEEE] min-h-screen py-10 lg:py-14">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-6">
                <div className="text-center mb-10 md:mb-14">
                    <h1 className="text-[30px] md:text-[38px] font-bold text-black mb-2 leading-tight">
                        Explore a World of Possibilities with Coca-Cola®
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-black font-medium max-w-6xl mx-auto">
                        Welcome to your one-stop shop for promotions, sweepstakes, and fun across all your favorite Coca-Cola brands.
                    </p>
                </div>

                {/* Hero-like Banner */}
                <div className="w-full h-[570px] md:h-[540px] lg:h-[570px] rounded-[18px] overflow-hidden relative mb-10">
                    <div className="absolute inset-0">
                        <Image
                            src="/assets/promos&offeres/coke-holiday-sweeps-banner-refresh-2-dt.png"
                            alt="Winter Adventure"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent md:bg-gradient-to-l md:from-black/60 md:via-black/30 md:to-transparent" />
                    </div>

                    <div className="relative h-full flex flex-col justify-start pt-10 lg:pt-0 md:justify-center items-center md:items-end text-center md:text-right px-6 md:px-[60px] lg:px-[80px]">
                        <div className="max-w-[600px] text-black md:text-white space-y-2 md:space-y-5 flex flex-col items-center md:items-end">
                            <h2 className="leading-[1.3] text-[23px] md:text-[40px] lg:text-[35px] font-bold text-white">
                                You Could Win a Winter Adventure in Sweden
                            </h2>
                            <p className="text-[16px] md:text-[16px] leading-[1.5] max-w-[500px] text-white px-3 md:px-0">
                                Enter our holiday sweepstakes for your chance to win an unforgettable 5-day/4-night journey to the winter wonderland of Sweden, including a stay at the world-famous ICEHOTEL.
                            </p>
                            <div className="pt-4 w-full md:w-auto flex justify-center md:block">
                                <Link
                                    href="#"
                                    className="block w-[290px] h-[40px] lg:w-[327px] lg:h-[40px] md:inline-block bg-white text-black text-[18px] flex items-center justify-center font-bold rounded-full hover:bg-gray-100 transition-colors duration-200"
                                >
                                    Enter Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

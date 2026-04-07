import Image from "next/image";
import Link from "next/link";
import { HeroData } from "@/types/home";

interface HeroProps {
    data: HeroData;
    buttonStyle?: { BackgroundHexColor?: string; FontHexColor?: string };
}
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

export default function Hero({ data, buttonStyle }: HeroProps) {
    const isLocal = STRAPI_BASE_URL.includes("localhost");
    const imageUrlMobile = data?.imageMobile?.data?.attributes?.formats?.large?.url || data?.imageMobile?.formats?.large?.url || data?.imageMobile?.url || "";
    const imageUrlDesktop = data?.imageDesktop?.data?.attributes?.formats?.large?.url || data?.imageDesktop?.formats?.large?.url || data?.imageDesktop?.url || "";
    return (
        <section className="w-full bg-[var(--background)] pt-4 lg:pt-14 pb-4 lg:pb-14">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-6">
                <div className="relative w-full h-[500px] md:h-[540px] lg:h-[570px] rounded-[18px] overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 ">
                        {imageUrlMobile && (
                            <Image
                                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imageUrlMobile}
                                alt="Winter Adventure in Sweden"
                                fill
                                className="object-fit object-right md:hidden"
                                priority
                                unoptimized={isLocal}
                            />
                        )}
                        {imageUrlDesktop && (
                            <Image
                                src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imageUrlDesktop}
                                alt="Winter Adventure in Sweden"
                                fill
                                className="hidden md:block object-cover object-center"
                                priority
                                unoptimized={isLocal}
                            />
                        )}

                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/10 md:to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-start pt-8 pb-8 lg:pt-0 md:justify-center md:pt-0 md:pb-0 items-center md:items-start text-center md:text-left px-6 md:px-[60px] lg:px-[80px]">
                        <div className="max-w-[600px] w-full flex-1 md:flex-none text-black md:text-white flex flex-col items-center md:items-start">
                            <div className="space-y-2 md:space-y-5 flex flex-col items-start md:items-start">
                                <h1 className="leading-[1.3] text-[23px] md:text-[40px] lg:text-[35px] font-bold text-white">
                                    {data.heading}
                                </h1>
                                <p className="text-left text-[16px] md:text-[16px] leading-[1.5] max-w-[500px] text-white px-3 md:px-0">
                                    {data.description[0]?.children[0]?.text}
                                </p>
                            </div>

                            <div className="mt-auto md:mt-8 pt-4 w-full md:w-auto flex justify-center md:block">
                                {data.ShowButton && <Link
                                    href={data.ButttonLink || "#"}
                                    style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined}
                                    className="flex items-center justify-center w-[290px] h-[40px] lg:w-[327px] lg:h-[40px] md:inline-flex bg-[var(--component)] text-black text-[18px] font-bold rounded-full hover:bg-opacity-80 transition-all duration-200"
                                >
                                    {data.ButtonText}
                                </Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

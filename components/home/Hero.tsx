import Image from "next/image";
import Link from "next/link";
interface HeroProps {
    data: any;
}
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

export default function Hero({ data }: HeroProps) {
    const isLocal = STRAPI_BASE_URL.includes("localhost");
    const imageUrl = data?.image?.formats?.large?.url
        ? (isLocal ? `${STRAPI_BASE_URL}${data.image.formats.large.url}` : data.image.formats.large.url) : "";
    console.log(imageUrl);
    return (
        <section className="w-full bg-[#EEEEEE] pt-4 lg:pt-14 pb-4 lg:pb-14">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-6">
                <div className="relative w-full h-[570px] md:h-[540px] lg:h-[570px] rounded-[18px] overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 ">
                        <Image
                            src={imageUrl}
                            alt="Winter Adventure in Sweden"
                            fill
                            className="object-cover object-center"
                            priority
                            unoptimized={isLocal}
                        />

                        {/* Overlay gradient for better text readability if needed, though the image seems dark enough on the left */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/15 md:via-transparent md:to-transparent " />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-start pt-5 lg:pt-0 md:justify-center md:pt-0 items-center md:items-start text-center md:text-left px-6 px-[10px] md:px-[60px] lg:px-[80px]">
                        <div className="max-w-[600px] text-black md:text-white space-y-2 md:space-y-5 flex flex-col items-center md:items-start">
                            <h1 className="leading-[1.3] text-[23px] md:text-[40px] lg:text-[35px] font-bold  text-white">
                                {data.heading}
                            </h1>
                            <p className="text-[16px] md:text-[16px] leading-[1.5] max-w-[500px] text-white px-3 md:px-0">
                                {data.description[0]?.children[0]?.text}
                            </p>
                            <div className="pt-1 md:pt-4 w-full md:w-auto lg:w-auto flex justify-center md:block">
                                {data.ShowButton && <Link
                                    href={data.ButttonLink || "#"}
                                    className="pt-2 block w-[290px] h-[40px] lg:w-[327px] lg:h-[40px] md:inline-block bg-white text-black text-[18px] font-bold rounded-full hover:bg-gray-100 transition-colors duration-200 text-center"
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

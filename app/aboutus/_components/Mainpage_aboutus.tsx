import Image from "next/image"
import Link from "next/link";
import { getStrapiMediaUrl, isStrapiLocal } from "@/src/lib/strapi-media";
interface Props {
    feature: Feature
}
interface Feature {
    id: number,
    image: string,
    title: string,
    description: string,
    buttonText: string,
    link: string,
    alignment: string
}



export default function Mainpage_aboutus({ feature }: Props) {
    const isLocal = isStrapiLocal();

    return (
        <div key={feature.id} className={`flex flex-col ${feature.alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center relative`}>
            {/* Image Container */}
            <div className="w-full lg:w-[660px] h-[400px] lg:h-[540px] relative rounded-none lg:rounded-[16px] overflow-hidden shadow-sm mb-2">
                <Image
                    src={getStrapiMediaUrl(feature.image)}
                    alt={feature.title}
                    fill
                    className="object-fill"
                    unoptimized={isLocal}
                />
            </div>

            {/* Content Card */}
            <div className={`
                                w-[88%] lg:w-[544px] lg:h-[552px] flex flex-col justify-between
                                bg-white p-6 md:p-10 lg:p-14 rounded-[16px] shadow-lg
                                relative z-10
                                -mt-20 lg:-mt-35 
                                ${feature.alignment === 'right' ? 'lg:-mr-5' : 'lg:-ml-5'}
                                ${feature.alignment === 'right' ? 'lg:translate-x-10' : 'lg:-translate-x-10'}
                            `}>
                <div>
                    <h3 className="text-[22px] md:text-[30px] mb-4 font-black text-black leading-[1.2]">
                        {feature.title}
                    </h3>
                    <p className="text-[14px] md:text-[16px] text-black mb-8 leading-[1.5] font-light">
                        {feature.description}
                    </p>
                </div>
                <Link
                    href={feature.link}
                    className="w-full md:w-[327px] block text-center py-2 rounded-full border-2 border-black text-black font-bold text-[16px] hover:bg-black hover:text-white transition-colors duration-300"
                >
                    {feature.buttonText}
                </Link>

            </div>
        </div>
    )
}

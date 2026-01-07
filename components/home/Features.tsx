
import Image from "next/image";
import Link from "next/link";

interface FeaturesProps {
    data: any;
}
export default function Features({ data }: FeaturesProps) {
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const isLocal = STRAPI_BASE_URL.includes("localhost");
    const defaultfeatures = [
        {
            id: 1,
            image: "/assets/Home/sprite-squad-december-dt.png",
            title: "Anta Claus + Winter Spiced Cranberry",
            description: "Enter for your chance to win a signed Anthony Edwards backboard used in his video shoot, or a Sprite Winter Spiced Cranberry 12-pack and cooler.",
            buttonText: "Learn More",
            link: "#",
            alignment: "left" // Image on left, Card on right
        },
        {
            id: 2,
            image: "/assets/Home/Features2.webp",
            title: "Sprite Vanilla Frost",
            description: "Step out of the ordinary with Sprite Vanilla Frost, here for a limited time only, exclusively at the Kroger Family of Stores.",
            buttonText: "Secure Yours",
            link: "#",
            alignment: "right" // Image on right, Card on left
        }
    ];
    const featuresdata = (data?.items && data.items.length > 0) ? data.items.slice(0, 3).map((item: any, index: number) => {
        //sbse phle nikalenge url 
        const imgurl = `${STRAPI_BASE_URL}${item.image.formats.large.url}`;
        return {
            id: item.id,
            image: imgurl,
            title: item.title,
            description: item.description,
            buttonText: item.buttonText,
            link: item.buttonLink || "#",
            alignment: index % 2 === 0 ? "left" : "right"
        }
    }) : defaultfeatures;

    interface featuree {
        id: number,
        image: string,
        title: string,
        description: string,
        buttonText: string,
        link: string,
        alignment: string
    }
    return (
        <section className="w-full bg-[#EEEEEE] pb-20 pt-0">
            <div className="max-w-7xl mx-auto px-0 lg:px-16">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center lg:mb-25 text-black px-4">{data.sectionTitle}</h2>

                <div className="space-y-24 lg:space-y-32">
                    {featuresdata.map((feature: featuree) => (
                        <div key={feature.id} className={`flex flex-col ${feature.alignment === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center relative`}>
                            {/* Image Container */}
                            <div className="w-full lg:w-[660px] h-[400px] lg:h-[540px] relative rounded-none lg:rounded-[16px] overflow-hidden shadow-sm mb-2">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    className="object-contain"
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
                                    <h3 className="text-[22px] md:text-[28px] mb-4 font-black text-black leading-[1.2]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[14px] md:text-[16px] text-black mb-8 leading-[1.5]">
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
                    ))}
                </div>
            </div>
        </section>
    );
}

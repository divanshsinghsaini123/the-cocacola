
import Image from "next/image";
import Link from "next/link";

export default function ExploreBrands() {
    const brands = [
        { name: "Coca-Cola", image: "/assets/cococola_brand.webp" },
        { name: "Diet Coke", image: "/assets/dietcoke_brand.webp" },
        { name: "Sprite", image: "/assets/sprite_brand.webp" },
        { name: "Fanta", image: "/assets/fanta_brand.webp" },
        { name: "Smartwater", image: "/assets/smartwater_brand.webp" },
        { name: "Minute Maid", image: "/assets/minutemade_brand.webp" },
    ];

    return (
        <section className="w-full bg-[#EEEEEE] py-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="text-[26px] md:text-[32px] font-bold text-center mb-7 text-black">Explore Our Brands</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {brands.map((brand, index) => (
                        <div key={index} className="bg-white rounded-[14px] lg:rounded-[18px] flex items-center justify-center p-6 h-[120px] md:h-[180px] relative shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-shadow">
                            <div className="relative w-[100%] h-[100%]">
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <Link href="#" className="px-32 py-2 rounded-full border-2 border-black text-black font-bold text-[15px] hover:bg-black hover:text-white transition-colors duration-300">
                        View All
                    </Link>
                </div>
            </div>
        </section>
    )
}

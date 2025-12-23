
import Image from "next/image";

export default function BrandsPage() {
    const brands = [
        { name: "Coca-Cola", image: "CocaColalogor.png" },
        { name: "Diet Coke", image: "en_diet coke_logo_color_471x180.png" },
        { name: "Sprite", image: "en_sprite_logo_green-text-only_477x180.png" },
        { name: "Simply", image: "en_simply_logo_color_377x180_v1.png" },
        { name: "Smartwater", image: "SW_wordmarks_RGB_color_500x180.png" },
        { name: "Fanta", image: "en_fanta_logo_colored_319x180_v1.png" },
        { name: "Minute Maid", image: "Global MinuteMaid Logo.png" },
        { name: "Gold Peak", image: "GoldPeak-Logo.svg" },
        { name: "BodyArmor", image: "body-armor-logo.png" },
        { name: "Costa Coffee", image: "costa-logo-2024.png" },
        { name: "Dasani", image: "dasani-brand-logo.png" },
        { name: "AHA", image: "en_aha_logo_color_420x180_v1.png" },
        { name: "Barq's", image: "en_barqs_logo_colored_229x180_v1.png" },
        { name: "Fuze Tea", image: "en_fuze_logo_color_728x180.png" },
        { name: "Hi-C", image: "en_hi-c_navlogo_237x180(2).png" },
        { name: "Honest Kids", image: "en_honestkids_logo_color_464x180_v1.png" },
        { name: "Hubert's Lemonade", image: "en_huberts_logo_colored_180x210.png" },
        { name: "Mello Yello", image: "en_melloyello_logo_black_336x180_v1.png" },
        { name: "Pibb Xtra", image: "en_pibb_logo_colored_186x180_v1.png" },
        { name: "Seagram's", image: "en_seagrams_logo_black_296x180_v1.png" },
        { name: "Topo Chico", image: "en_topochico_logo_color_714x180 .png" },
        { name: "Tum-E Yummies", image: "en_usa_Tum-E-Yummies-Logo_229x180.png" },
        { name: "Fairlife", image: "fairlife-logo-blue-small.png" },
        { name: "Fresca", image: "fresca-logo.png" },
        { name: "Peace Tea", image: "peace-tea-logo.png" },
        { name: "Powerade", image: "powerade-ccb-logo.png" },
        { name: "Vitaminwater", image: "usa_en_glaceau vitamin water_logo_black_500x180.png" },
    ];

    return (
        <main className="w-full bg-[#EEEEEE] min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-6 sm:px-6">
                <h1 className="text-[31px] md:text-[38px] font-bold text-center mb-7 text-black">Explore Our Brands</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                    {brands.map((brand, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-[14px] lg:rounded-[18px] flex items-center justify-center p-6 h-[160px] lg:h-[230px] md:h-[180px] relative shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 overflow-hidden"
                        >
                            <div className="relative w-[100%] h-[100%]">
                                <Image
                                    src={`/assets/Brands/${brand.image}`}
                                    alt={brand.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

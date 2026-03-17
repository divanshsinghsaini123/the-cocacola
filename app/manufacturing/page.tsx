
import { GetManufacturingData } from "@/src/lib/strapi";
import Table from "./_components/table";
import Image from "next/image";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
    const strapioutput = await GetManufacturingData();
    const seo = strapioutput?.SEO;

    return {
        title: seo?.metaTitle || "Manufacturing | Cloud9 Beverages",
        description: seo?.metaDescription || "Learn about our manufacturing processes, facilities, and the high standards we maintain at Cloud9 Beverages.",
        keywords: seo?.keywords || "manufacturing, facilities, Cloud9, beverages, standards, production",
    };
}

export interface TableData {
    id: number,
    Table_ComponentName: string,
    Section_Table_Row: TableRow[],
}
export interface TableRow {
    id: number,
    PlantCode: string,
    ManufacturerAddress: string,
    FssaiNo: string
}

export default async function ManufacturingPage() {
    const data = await GetManufacturingData();
    if (data?.DisablePage) return notFound();
    const tables = data?.Section_table || [];

    return (
        <main className="min-h-screen bg-[#f1f5f9] p-2 sm:p-4 md:p-8 flex justify-center font-sans tracking-wide">
            <div className="bg-white max-w-7xl w-full shadow-sm">

                {/* Top Section */}
                <div className="p-4 md:p-8 pb-4 md:pb-6">
                    {/* Breadcrumbs and Logo */}
                    <div className="flex justify-between items-start mb-6 md:mb-10">
                        <div className="text-[10px] md:text-sm text-gray-500 mt-1 md:mt-0">
                            Home / Manufacturing_list
                        </div>
                        <Image
                            src="/assets/Manufacturing/manufacturing_logo.png"
                            alt="Cloud9 Beverages"
                            width={140}
                            height={60}
                            className="object-contain w-24 md:w-[140px]"
                        />
                    </div>

                    {/* Headings */}
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-[15px] sm:text-lg md:text-2xl font-bold text-[#1f4e85] flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            <span className="w-[3px] md:w-[4px] h-4 md:h-6 bg-[#97c93d] inline-block"></span>
                            Home / Manufacturing_list
                        </h1>
                        <p className="text-[9px] sm:text-[11px] md:text-sm text-gray-800 leading-snug md:leading-normal pr-4 md:pr-0">
                            <span className="font-bold text-gray-900">Marketer Details :</span> Cloud9 Beverages 101, Bhakti Park, R.H.B. Road, Mulund West, Mumbai, Maharashtra - 400080
                        </p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="w-full p-2 sm:p-4 md:p-8 pt-0 md:pt-0">
                    <table className="w-full text-left border-collapse table-fixed md:table-auto">
                        <thead className="bg-[#e9f0d3]">
                            <tr>
                                <th className="p-2 md:p-4 text-[8px] md:text-sm font-semibold text-gray-900 w-[12%] md:w-24">Serial<br />No.</th>
                                <th className="p-2 md:p-4 text-[8px] md:text-sm font-semibold text-gray-900 w-[15%] md:w-24">Plant<br />Code</th>
                                <th className="p-2 md:p-4 text-[8px] md:text-sm font-semibold text-gray-900 w-[48%] md:w-auto">Manufacturer's Address</th>
                                <th className="p-2 md:p-4 text-[8px] md:text-sm font-semibold text-gray-900 text-left w-[25%] md:w-40">FSSAI NO.</th>
                            </tr>
                        </thead>
                        {tables.map((item: TableData) => (
                            <Table key={item.id} tableData={item} />
                        ))}
                    </table>
                </div>

            </div>
        </main>
    );
}
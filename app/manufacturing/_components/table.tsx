import { TableRow, TableData } from "@/app/manufacturing/page"

interface TableProps {
    tableData: TableData
}
export default function Table({ tableData }: TableProps) {
    const table_heading = tableData.Table_ComponentName
    const table_rows = tableData.Section_Table_Row

    return (
        <tbody className="bg-[var(--component)]">
            <tr>
                <td colSpan={4} className="p-2 md:p-4 pb-1 md:pb-2 pt-4 md:pt-6 text-[10px] sm:text-[12px] md:text-[15px] font-bold text-gray-900 border-b border-gray-200">
                    {table_heading}
                </td>
            </tr>
            {table_rows.map((item: TableRow, index: number) => {
                const plant_code = item.PlantCode
                const manufacturer_address = item.ManufacturerAddress
                const fssai_no = item.FssaiNo
                return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-2 md:p-4 text-[8px] md:text-[14px] text-gray-800 align-top">{index + 1}</td>
                        <td className="p-2 md:p-4 text-[8px] md:text-[14px] text-gray-800 align-top break-words">{plant_code}</td>
                        <td className="p-2 md:p-4 text-[8px] md:text-[14px] text-gray-800 align-top leading-tight md:leading-relaxed pr-2 md:pr-4 break-words">{manufacturer_address}</td>
                        <td className="p-2 md:p-4 text-[7px] md:text-[14px] text-gray-800 align-top text-left break-all md:break-normal">{fssai_no}</td>
                    </tr>
                )
            })}
        </tbody>
    )
}
import { Building2, Phone } from "lucide-react";

interface Row {
    id: string;
    Name: string;
    Department: string;
    ExtensionNumber: string;
}

interface Props {
    rows: Row[];
    sortBy?: string;
}

export default function DownloadableDirectory({ rows, sortBy }: Props) {
    return (
        <div className="bg-white p-4 w-[650px] text-black">
            {/* Header */}
            <div className="flex justify-between items-end border-b pb-2 mb-3 border-gray-300">
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">Corporate Extensions</h1>
                    {sortBy && (
                        <div className="text-[10px] text-gray-500 mt-0.5 font-medium uppercase tracking-wider">
                            Sorted by: {sortBy}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 font-medium pb-0.5">Internal Use Only</div>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700">Name</th>
                        <th className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700">Department</th>
                        <th className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 text-right">Ext No</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="py-0.5 px-2 text-xs font-semibold text-gray-900">{row.Name || 'Unknown'}</td>
                            <td className="py-0.5 px-2 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <Building2 className="w-2.5 h-2.5 mr-1 text-gray-400" />
                                    {row.Department || 'General'}
                                </div>
                            </td>
                            <td className="py-0.5 px-2 text-xs font-bold text-red-600 text-right">{row.ExtensionNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

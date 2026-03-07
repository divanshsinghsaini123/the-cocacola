import { GetExtensionData } from "@/src/lib/strapi";
import { Phone, Building2 } from "lucide-react";

interface Row {
    id: number;
    Name: string;
    ExtensionNumber: number;
    Department: string;
}

export default async function ExtensionPage() {
    const data = await GetExtensionData();
    const rows = data?.Row || [];

    // Helper to get initials safely
    const getInitials = (name: string) => {
        if (!name) return '?';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-10 flex flex-col items-start md:flex-row md:items-end md:justify-between border-b pb-6 border-gray-300">
                <div>
                    <div className="inline-flex items-center space-x-2 text-red-600 mb-2">
                        <Phone className="w-5 h-5" />
                        <span className="text-sm font-bold tracking-widest uppercase">Directory</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        Corporate Extensions
                    </h1>
                </div>
                <p className="mt-4 md:mt-0 text-lg opacity-70">
                    Find team member
                </p>
            </div>

            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--component)] rounded-t-xl border-b border-gray-100 text-sm font-bold tracking-wider opacity-80 uppercase shadow-sm">
                <div className="col-span-5">Name</div>
                <div className="col-span-4">Department</div>
                <div className="col-span-3 text-right">Ext no</div>
            </div>

            {/* List Body */}
            <div className="flex flex-col gap-3 md:gap-0 md:bg-[var(--component)] md:rounded-b-xl shadow-sm overflow-hidden">
                {rows.length > 0 ? (
                    rows.map((row: Row, index: number) => (
                        <div
                            key={row.id}
                            className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:py-4 py-5 items-center bg-[var(--component)] md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none hover:bg-red-50/10 transition-colors duration-200 border border-gray-200 md:border-t-0 md:border-b ${index !== rows.length - 1 ? 'md:border-gray-100' : 'md:border-transparent'}`}
                        >
                            {/* Name Section */}
                            <div className="col-span-5 flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-full bg-red-600 flex flex-shrink-0 items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {getInitials(row.Name)}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="text-lg font-bold group-hover:text-red-700 transition-colors truncate">
                                        {row.Name || 'Unknown'}
                                    </h3>
                                    {/* Show department below name only on mobile */}
                                    <div className="md:hidden flex items-center text-sm opacity-80 mt-0.5">
                                        <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                        <span className="truncate">{row.Department || 'General'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Department Section (Desktop) */}
                            <div className="hidden md:flex col-span-4 items-center opacity-80">
                                <Building2 className="w-4 h-4 mr-2 shrink-0 text-red-600" />
                                <span className="truncate text-base font-medium">{row.Department || 'General'}</span>
                            </div>

                            {/* Extension Section */}
                            <div className="col-span-12 md:col-span-3 flex md:justify-end mt-2 md:mt-0">
                                <div className="flex items-center space-x-3 w-full md:w-auto bg-gray-100/50 md:bg-transparent p-3 md:p-0 rounded-lg">
                                    <div className="flex flex-col md:flex-row md:items-center w-full md:w-auto">
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider opacity-60">Ext No</span>
                                        <span className="font-extrabold text-xl md:text-xl">
                                            {row.ExtensionNumber}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-12 text-center opacity-60">
                        No extensions found.
                    </div>
                )}
            </div>
        </div>
    );
}

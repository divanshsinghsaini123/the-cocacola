'use client'
import { Phone, Building2, Download, Search, ArrowUpDown } from "lucide-react";
import { toPng } from 'html-to-image';
import { useRef, useCallback, useState, useMemo } from 'react';
import DownloadableDirectory from './DownloadableDirectory';
interface ComponentProps {
    rows: Row[];
}
interface Row {
    id: string;
    Name: string;
    Department: string;
    ExtensionNumber: string;
}
type SortOption = 'default' | 'number' | 'name' | 'department';

const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export default function ClientComponent({ rows }: ComponentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>('default');

    const filteredAndSortedRows = useMemo(() => {
        let result = [...rows];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(row =>
                (row.Name?.toLowerCase().includes(query)) ||
                (row.Department?.toLowerCase().includes(query)) ||
                (String(row.ExtensionNumber ?? '').toLowerCase().includes(query))
            );
        }

        // Sort
        if (sortBy !== 'default') {
            result.sort((a, b) => {
                if (sortBy === 'name') {
                    return (a.Name || '').localeCompare(b.Name || '');
                } else if (sortBy === 'department') {
                    return (a.Department || '').localeCompare(b.Department || '');
                } else {
                    // 'number'
                    const numA = parseInt(a.ExtensionNumber, 10) || 0;
                    const numB = parseInt(b.ExtensionNumber, 10) || 0;
                    return numA - numB;
                }
            });
        }

        return result;
    }, [rows, searchQuery, sortBy]);

    // 2. Download function yahan rakho
    const handleDownload = useCallback(() => {
        if (contentRef.current === null) return;

        toPng(contentRef.current, {
            cacheBust: true,
            backgroundColor: '#ffffff', // Taki image transparent na ho
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'corporate-directory.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => console.log(err));
    }, [contentRef]);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative overflow-hidden">
            {/* Hidden component for download - positioned off-screen */}
            <div className="fixed left-[-9999px] top-[-9999px]">
                <div ref={contentRef}>
                    <DownloadableDirectory rows={filteredAndSortedRows} sortBy={sortBy === 'default' ? undefined : sortBy} />
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    <Download className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-wide">Download Image</span>
                </button>
            </div>

            <div className="bg-[var(--background)] w-full">
                {/* Header Section */}
                <div className="mb-10 flex flex-col items-start md:flex-row md:items-end md:justify-between border-b pb-6 border-gray-300">
                    <div>
                        <div className="inline-flex items-center space-x-2 text-red-600 mb-2">
                            <Phone className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-widest uppercase">Directory</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                            Corporate Extensions
                        </h1>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search extensions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 border border-gray-300 shadow-sm rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-[var(--component)]"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ArrowUpDown className="h-4 w-4 text-gray-400" />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="block w-full pl-9 pr-8 py-2 border border-gray-300 shadow-sm rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 appearance-none bg-[var(--component)]"
                            >
                                <option value="default">Default</option>
                                <option value="number">Sort by Number</option>
                                <option value="name">Sort by Name</option>
                                <option value="department">Sort by Department</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* List Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[var(--component)] rounded-t-xl border-b border-gray-100 text-sm font-bold tracking-wider opacity-80 uppercase shadow-sm">
                    <div className="col-span-5">Name</div>
                    <div className="col-span-4">Department</div>
                    <div className="col-span-3 text-right">Ext no</div>
                </div>

                {/* List Body */}
                <div className="flex flex-col gap-3 md:gap-0 md:bg-[var(--component)] md:rounded-b-xl shadow-sm overflow-hidden">
                    {filteredAndSortedRows.length > 0 ? (
                        filteredAndSortedRows.map((row: Row, index: number) => (
                            <div
                                key={row.id}
                                className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:py-4 py-5 items-center bg-[var(--component)] md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none hover:bg-red-50/10 transition-colors duration-200 border border-gray-200 md:border-t-0 md:border-b ${index !== filteredAndSortedRows.length - 1 ? 'md:border-gray-100' : 'md:border-transparent'}`}
                            >
                                {/* Name Section */}
                                <div className="col-span-5 flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-red-600 flex flex-shrink-0 items-center justify-center text-white font-bold text-lg shadow-sm">
                                        {getInitials(row.Name)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-sm md:text-lg font-bold group-hover:text-red-700 transition-colors">
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
                                        <div className="flex md:flex-row md:items-center w-full md:w-auto gap-3">
                                            <span className="md:hidden text-sm md:text-xs font-bold uppercase tracking-wider md:opacity-60">Ext No :</span>
                                            <span className="font-extrabold text-sm md:text-xl">
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
        </div>
    );
}
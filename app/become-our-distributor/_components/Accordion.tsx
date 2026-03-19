"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface OriginalItem {
    id: number;
    Heading: string;
    Description: string;
}

export default function Accordion({ items }: { items: OriginalItem[] }) {
    const [openIndex, setOpenIndex] = useState<number>(0);

    return (
        <div className="flex flex-col space-y-4">
            {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                    <div 
                        key={item.id} 
                        className={`rounded-2xl border ${isOpen ? 'border-gray-500 bg-transparent' : 'border-gray-800 bg-[#0A0D14]'} transition-all overflow-hidden`}
                    >
                        <button 
                            className="w-full flex justify-between items-center px-6 py-5 text-left"
                            onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        >
                            <span className="text-white font-medium text-lg tracking-wide">{item.Heading}</span>
                            {isOpen ? <X className="text-gray-400 shrink-0" size={20} /> : <Plus className="text-gray-400 shrink-0" size={20} />}
                        </button>
                        {isOpen && (
                            <div className="px-6 pb-6 pt-1 text-gray-400 text-sm md:text-[15px] leading-relaxed">
                                {item.Description.split('**').map((part, i) => 
                                    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Save, MapPin } from 'lucide-react';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir"
];

const DEFAULT_BOTTLE_COMPONENTS = [
    { name: 'Preform', rate: 1.50 },
    { name: 'Caps', rate: 0.45 },
    { name: 'Labels', rate: 0.75 },
    { name: 'Handle', rate: 0 },
    { name: 'Glue', rate: 0 },
    { name: 'BOPP Tape', rate: 0 },
    { name: 'Minerals', rate: 0 },
    { name: 'Shrink/C.Box', rate: 0.25 },
    { name: 'Rejection', rate: 0.03 }
];

const DEFAULT_EXTRA_COMPONENTS = [
    { name: 'GST', rate: 0.15 },
    { name: 'Carton Cost', rate: 150.17 },
    { name: 'Transportation', rate: 8.00 },
    { name: 'JHPL Margin', rate: 10.00 }
];

interface ComponentItem {
    name: string;
    rate: number;
}

interface SizeItem {
    size: string;
    bottlesPerCase: number | '';
    bottleComponents: ComponentItem[];
    extraComponents: ComponentItem[];
}

export default function AddProductForm() {
    const [productName, setProductName] = useState("");
    const [selectedStates, setSelectedStates] = useState<string[]>([]);

    // Initialize with one empty size item to start with
    const [sizes, setSizes] = useState<SizeItem[]>([{
        size: '',
        bottlesPerCase: '',
        bottleComponents: JSON.parse(JSON.stringify(DEFAULT_BOTTLE_COMPONENTS)),
        extraComponents: JSON.parse(JSON.stringify(DEFAULT_EXTRA_COMPONENTS)),
    }]);

    const handleStateToggle = (stateName: string) => {
        if (selectedStates.includes(stateName)) {
            setSelectedStates(selectedStates.filter(s => s !== stateName));
        } else {
            setSelectedStates([...selectedStates, stateName]);
        }
    };

    const addSizePanel = () => {
        setSizes([...sizes, {
            size: '',
            bottlesPerCase: '',
            bottleComponents: JSON.parse(JSON.stringify(DEFAULT_BOTTLE_COMPONENTS)),
            extraComponents: JSON.parse(JSON.stringify(DEFAULT_EXTRA_COMPONENTS)),
        }]);
    };

    const removeSizePanel = (index: number) => {
        const newSizes = [...sizes];
        newSizes.splice(index, 1);
        setSizes(newSizes);
    };

    const updateSizeField = (index: number, field: keyof SizeItem, value: any) => {
        const newSizes = [...sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setSizes(newSizes);
    };

    const updateComponentRate = (sizeIndex: number, compType: 'bottleComponents' | 'extraComponents', compIndex: number, newRate: number) => {
        const newSizes = [...sizes];
        newSizes[sizeIndex][compType][compIndex].rate = newRate;
        setSizes(newSizes);
    };

    const handleSave = async () => {
        const payload = {
            productname: productName,
            states: selectedStates,
            sizeAndChanges: sizes
        };

        console.log("Saving payload to DB:", payload);
        alert("Check console for the payload object saved! Next step: send this to your backend API.");
        // TODO: await fetch('/api/calc/product', { method: 'POST', body: JSON.stringify(payload) })
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center bg-white p-6 justify-center rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Add New Calculator Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Define base product info, states, and dynamic pricing models for various sizes.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Product
                    </button>
                </div>

                {/* Main Product Info */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded-xl px-4 py-3 bg-gray-50 border focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                            placeholder="e.g. Classic Cola 500ml Pack"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <MapPin size={16} /> Available States
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
                            {INDIAN_STATES.map((state) => (
                                <label key={state} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                        checked={selectedStates.includes(state)}
                                        onChange={() => handleStateToggle(state)}
                                    />
                                    <span className="text-xs sm:text-sm text-gray-700">{state}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sizes and Configurations */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Size Configurations</h2>

                    {sizes.map((sz, sizeIndex) => (
                        <div key={sizeIndex} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
                            {sizes.length > 1 && (
                                <button
                                    onClick={() => removeSizePanel(sizeIndex)}
                                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pr-12">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Size label</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. 200 ML"
                                        value={sz.size}
                                        onChange={(e) => updateSizeField(sizeIndex, 'size', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bottles Per Case</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                                        placeholder="e.g. 24"
                                        value={sz.bottlesPerCase}
                                        onChange={(e) => updateSizeField(sizeIndex, 'bottlesPerCase', Number(e.target.value) || '')}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Bottle Components Column */}
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <h3 className="font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-2">Bottle Components</h3>
                                    <div className="space-y-3">
                                        {sz.bottleComponents.map((comp, compIndex) => (
                                            <div key={compIndex} className="flex justify-between items-center gap-4">
                                                <span className="text-sm text-gray-600 font-medium w-1/2">{comp.name}</span>
                                                <div className="relative w-1/2">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">&#8377;</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full text-right border border-gray-200 rounded-md px-3 py-1.5 pl-7 text-sm focus:border-blue-400 outline-none"
                                                        value={comp.rate}
                                                        onChange={(e) => updateComponentRate(sizeIndex, 'bottleComponents', compIndex, parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Extra Components Column */}
                                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                                    <h3 className="font-semibold text-orange-900 mb-4 border-b border-orange-200 pb-2">Extra Components</h3>
                                    <div className="space-y-3">
                                        {sz.extraComponents.map((comp, compIndex) => (
                                            <div key={compIndex} className="flex justify-between items-center gap-4">
                                                <span className="text-sm text-gray-600 font-medium w-1/2">{comp.name}</span>
                                                <div className="relative w-1/2">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{comp.name.includes('GST') || comp.name.includes('Margin') ? '%' : '₹'}</span>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full text-right border border-gray-200 rounded-md px-3 py-1.5 pl-8 text-sm focus:border-orange-400 outline-none"
                                                        value={comp.rate}
                                                        onChange={(e) => updateComponentRate(sizeIndex, 'extraComponents', compIndex, parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addSizePanel}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Another Size Variant
                    </button>

                </div>
            </div>
        </div>
    );
}

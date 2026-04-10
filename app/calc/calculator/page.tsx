"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, Save, FileSpreadsheet } from 'lucide-react';

interface ComponentItem {
    name: string;
    rate: number;
}

interface SizeItem {
    size: string;
    bottlesPerCase: number;
    bottleComponents: ComponentItem[];
    extraComponents: ComponentItem[];
}

interface Product {
    _id: string;
    productname: string;
    states: string[];
    sizeAndChanges: SizeItem[];
}

export default function CalculatorWorksheetPage() {
    const [products, setProducts] = useState<Product[]>([]);

    // Selections
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedSizeName, setSelectedSizeName] = useState<string>('');

    // Active Worksheet State (Local changes)
    const [bottlesPerCase, setBottlesPerCase] = useState<number>(0);
    const [bottleComponents, setBottleComponents] = useState<ComponentItem[]>([]);
    const [extraComponents, setExtraComponents] = useState<ComponentItem[]>([]);

    useEffect(() => {
        // MOCK FETCH: Simulate getting full data from the DB
        const mockProducts: Product[] = [
            {
                _id: 'p1',
                productname: 'Classic Cola',
                states: ['Delhi', 'Haryana', 'Maharashtra'],
                sizeAndChanges: [
                    {
                        size: '500 ML',
                        bottlesPerCase: 48,
                        bottleComponents: [
                            { name: 'Preform', rate: 1.50 },
                            { name: 'Caps', rate: 0.45 },
                            { name: 'Labels', rate: 0.75 },
                            { name: 'Shrink/C.Box', rate: 0.25 }
                        ],
                        extraComponents: [
                            { name: 'GST', rate: 7.20 },
                            { name: 'Transportation', rate: 8.00 },
                            { name: 'JHPL Margin', rate: 10.00 }
                        ]
                    },
                    {
                        size: '1 Ltr',
                        bottlesPerCase: 24,
                        bottleComponents: [
                            { name: 'Preform', rate: 2.50 },
                            { name: 'Caps', rate: 0.45 },
                            { name: 'Labels', rate: 0.85 },
                            { name: 'Shrink/C.Box', rate: 0.35 }
                        ],
                        extraComponents: [
                            { name: 'GST', rate: 4.50 },
                            { name: 'Transportation', rate: 5.00 },
                            { name: 'JHPL Margin', rate: 12.00 }
                        ]
                    }
                ]
            }
        ];

        // TODO: Replace with real api fetch eg. await fetch('/api/calc/products')
        setProducts(mockProducts);
    }, []);

    const selectedProduct = products.find(p => p._id === selectedProductId);
    const availableStates = selectedProduct?.states || [];
    const availableSizes = selectedProduct?.sizeAndChanges || [];

    // Load active sizes into local state when user selects a size
    useEffect(() => {
        if (selectedProduct && selectedSizeName) {
            const sizeData = selectedProduct.sizeAndChanges.find(s => s.size === selectedSizeName);
            if (sizeData) {
                setBottlesPerCase(sizeData.bottlesPerCase);
                // Deep copy so local edits don't mutate the raw products data
                setBottleComponents(JSON.parse(JSON.stringify(sizeData.bottleComponents)));
                setExtraComponents(JSON.parse(JSON.stringify(sizeData.extraComponents)));
            }
        } else {
            setBottlesPerCase(0);
            setBottleComponents([]);
            setExtraComponents([]);
        }
    }, [selectedProduct, selectedSizeName]);

    // Derived Calculations
    const calculateBottleCost = (rate: number) => {
        return rate * bottlesPerCase;
    };

    const totalBottleCost = bottleComponents.reduce((acc, comp) => acc + calculateBottleCost(comp.rate), 0);
    const totalExtraCost = extraComponents.reduce((acc, comp) => acc + comp.rate, 0);
    const finalPrice = totalBottleCost + totalExtraCost;

    // Handlers for Local Table Edits
    const updateBottleRate = (index: number, newRate: number) => {
        const newComps = [...bottleComponents];
        newComps[index].rate = newRate;
        setBottleComponents(newComps);
    };

    const updateExtraRate = (index: number, newRate: number) => {
        const newComps = [...extraComponents];
        newComps[index].rate = newRate;
        setExtraComponents(newComps);
    };

    const addBottleComponent = () => {
        setBottleComponents([...bottleComponents, { name: 'New Component', rate: 0 }]);
    };

    const addExtraComponent = () => {
        setExtraComponents([...extraComponents, { name: 'New Extra', rate: 0 }]);
    };

    const removeBottleComponent = (index: number) => {
        const newComps = [...bottleComponents];
        newComps.splice(index, 1);
        setBottleComponents(newComps);
    };

    const removeExtraComponent = (index: number) => {
        const newComps = [...extraComponents];
        newComps.splice(index, 1);
        setExtraComponents(newComps);
    };

    const updateBottleName = (index: number, newName: string) => {
        const newComps = [...bottleComponents];
        newComps[index].name = newName;
        setBottleComponents(newComps);
    };

    const updateExtraName = (index: number, newName: string) => {
        const newComps = [...extraComponents];
        newComps[index].name = newName;
        setExtraComponents(newComps);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header configuration */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6 border-b pb-4">
                        <FileSpreadsheet className="text-blue-600" />
                        Dynamic Calculator Worksheet
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">1. Select Product</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white"
                                value={selectedProductId}
                                onChange={(e) => {
                                    setSelectedProductId(e.target.value);
                                    setSelectedState('');
                                    setSelectedSizeName('');
                                }}
                            >
                                <option value="">-- Choose Product --</option>
                                {products.map(p => (
                                    <option key={p._id} value={p._id}>{p.productname}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">2. Select State</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                disabled={!selectedProductId}
                            >
                                <option value="">-- Choose State --</option>
                                {availableStates.map(st => (
                                    <option key={st} value={st}>{st}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">3. Select Size</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                value={selectedSizeName}
                                onChange={(e) => setSelectedSizeName(e.target.value)}
                                disabled={!selectedProductId || !selectedState}
                            >
                                <option value="">-- Choose Size --</option>
                                {availableSizes.map(sz => (
                                    <option key={sz.size} value={sz.size}>{sz.size} ({sz.bottlesPerCase} btl/case)</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Excel-like Worksheet View */}
                {selectedSizeName && selectedState && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

                        {/* Worksheet Header */}
                        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                            <div className="font-semibold text-lg flex items-center gap-2">
                                <Calculator />
                                Calculation Sheet: {selectedProduct?.productname} - {selectedSizeName}
                            </div>
                            <div className="bg-blue-700 px-4 py-1.5 rounded-lg text-sm font-medium">
                                Bottles Per Case: <span className="text-white text-base ml-1">{bottlesPerCase}</span>
                            </div>
                        </div>

                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                                        <th className="px-6 py-3 font-semibold uppercase tracking-wider w-1/2">Component Name</th>
                                        <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right w-1/4 min-w-[120px]">Landed Rate (₹)</th>
                                        <th className="px-6 py-3 font-semibold uppercase tracking-wider text-right w-1/4">Cost (₹)</th>
                                        <th className="px-4 py-3 w-[50px]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* ---------------- BOTTLE COMPONENTS ---------------- */}
                                    <tr className="bg-blue-50/50">
                                        <td colSpan={4} className="px-6 py-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
                                            Bottle Components (Cost = Rate × {bottlesPerCase})
                                        </td>
                                    </tr>
                                    {bottleComponents.map((comp, index) => (
                                        <tr key={`bottle-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-2">
                                                <input
                                                    type="text"
                                                    value={comp.name}
                                                    onChange={(e) => updateBottleName(index, e.target.value)}
                                                    className="w-full border-none bg-transparent outline-none font-medium text-gray-800 p-1"
                                                />
                                            </td>
                                            <td className="px-6 py-2 text-right">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={comp.rate}
                                                    onChange={(e) => updateBottleRate(index, parseFloat(e.target.value) || 0)}
                                                    className="w-full text-right border-b border-gray-200 bg-transparent focus:border-blue-500 outline-none p-1"
                                                />
                                            </td>
                                            <td className="px-6 py-2 text-right font-medium text-gray-900">
                                                {calculateBottleCost(comp.rate).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => removeBottleComponent(index)} className="text-red-400 hover:text-red-600 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50/80">
                                        <td colSpan={4} className="px-6 py-2">
                                            <button onClick={addBottleComponent} className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700">
                                                <Plus size={16} /> Add Bottle Row
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 border-y-2 border-blue-200">
                                        <td className="px-6 py-3 font-bold text-gray-800 uppercase text-sm">Basic Price (Subtotal)</td>
                                        <td className="px-6 py-3 text-right"></td>
                                        <td className="px-6 py-3 text-right font-bold text-blue-900 text-lg">
                                            {totalBottleCost.toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>


                                    {/* ---------------- EXTRA COMPONENTS ---------------- */}
                                    <tr className="bg-orange-50/50">
                                        <td colSpan={4} className="px-6 py-2 text-xs font-bold text-orange-800 uppercase tracking-wider">
                                            Extra Components & Margins (Added directly to Basic Price)
                                        </td>
                                    </tr>
                                    {extraComponents.map((comp, index) => (
                                        <tr key={`extra-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-2">
                                                <input
                                                    type="text"
                                                    value={comp.name}
                                                    onChange={(e) => updateExtraName(index, e.target.value)}
                                                    className="w-full border-none bg-transparent outline-none font-medium text-gray-800 p-1"
                                                />
                                            </td>
                                            <td colSpan={2} className="px-6 py-2 text-right">
                                                <div className="flex justify-end relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={comp.rate}
                                                        onChange={(e) => updateExtraRate(index, parseFloat(e.target.value) || 0)}
                                                        className="w-[150px] text-right border-b border-gray-200 bg-transparent focus:border-orange-500 outline-none p-1 font-medium"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => removeExtraComponent(index)} className="text-red-400 hover:text-red-600 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-50/80">
                                        <td colSpan={4} className="px-6 py-2">
                                            <button onClick={addExtraComponent} className="text-sm text-orange-600 font-medium flex items-center gap-1 hover:text-orange-700">
                                                <Plus size={16} /> Add Extra Row
                                            </button>
                                        </td>
                                    </tr>

                                    {/* ---------------- FINAL PRICE ---------------- */}
                                    <tr className="bg-gray-800 text-white">
                                        <td className="px-6 py-5 font-bold uppercase text-lg">Final Calculated Price</td>
                                        <td className="px-6 py-5 text-right"></td>
                                        <td className="px-6 py-5 text-right font-bold text-green-400 text-2xl">
                                            ₹{finalPrice.toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

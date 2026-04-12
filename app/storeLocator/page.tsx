


"use client";

import React, { useState, useEffect } from "react";

export default function StoreLocator() {
    const [stores, setStores] = useState<any[]>([]);
    const [pageConfig, setPageConfig] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");

    // Initial fetch to show all available stores (unsorted)
    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async (query = "") => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`/api/storeLocator${query}`);
            const data = await res.json();
            
            if (res.ok) {
                setStores(data.stores || []);
                if (data.pageData) {
                   setPageConfig(data.pageData);
                }
            } else {
                setError(data.error || "Failed to fetch stores.");
                setStores([]);
            }
        } catch (err: any) {
            setError("Something went wrong while fetching stores.");
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                fetchStores(`?lat=${lat}&lng=${lng}`);
            },
            () => {
                setError("Unable to retrieve your location. Please check your browser permissions.");
                setLoading(false);
            }
        );
    };

    const handleSearchByPincode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pincode.trim()) return;
        fetchStores(`?pincode=${pincode.trim()}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Store Locator</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
                <form onSubmit={handleSearchByPincode} className="flex flex-1 w-full gap-2">
                    <input 
                        type="text" 
                        placeholder="Enter Pincode (e.g. 136129)" 
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button 
                        type="submit"
                        className="px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
                        style={pageConfig ? { backgroundColor: pageConfig.BackgroundHexColor, color: pageConfig.FontHexColor } : {}}
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-gray-500 font-medium hidden md:block">OR</span>
                    <button 
                        type="button"
                        onClick={handleUseMyLocation}
                        className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Use My Location
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stores.length > 0 ? (
                        stores.map((store) => (
                            <div key={store.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">{store.name}</h3>
                                <p className="text-gray-600 mb-1">{store.address}</p>
                                <p className="text-gray-600 mb-3">{store.city} - {store.pincode}</p>
                                
                                {store.distance !== undefined && store.distance !== null && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                            {store.distance.toFixed(2)} km away
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No stores found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
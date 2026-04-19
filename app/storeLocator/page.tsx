


"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import Map to prevent SSR "window is not defined" crashes
const StoreMap = dynamic(() => import("./Map"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
        </div>
    )
});

export default function StoreLocator() {
    const [stores, setStores] = useState<any[]>([]);
    const [pageConfig, setPageConfig] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [pincode, setPincode] = useState<string>("");
    const [selectedState, setSelectedState] = useState<string>("All");
    const [selectedStore, setSelectedStore] = useState<any>(null);

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
                setSelectedState("All");
                setSelectedStore(null); // Clear selection on new search
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

    const INDIAN_STATES = [
        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
        "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
        "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
        "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
        "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ];

    const filteredStores = selectedState === "All"
        ? stores
        : stores.filter(s => s.state?.trim().toLowerCase() === selectedState.toLowerCase());

    return (
        <div className="flex flex-col h-screen max-h-screen bg-white overflow-hidden">
            {/* TOP HEADER & SEARCH BAR */}
            <div className="bg-white border-b border-gray-200 shrink-0">
                <div className="max-w-[1600px] mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">STORE LOCATOR</h1>

                    <div className="flex-1 max-w-2xl w-full">
                        <form onSubmit={handleSearchByPincode} className="flex w-full relative drop-shadow-sm">
                            <input
                                type="text"
                                placeholder="Search by Pincode..."
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                className="w-full px-5 py-3 pr-32 border border-gray-300 rounded-full focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm"
                            />
                            <div className="absolute right-1 top-1 bottom-1 flex gap-1">
                                <button
                                    type="button"
                                    onClick={handleUseMyLocation}
                                    title="Use My Location"
                                    className="px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition text-sm"
                                    style={pageConfig ? { backgroundColor: pageConfig.BackgroundHexColor, color: pageConfig.FontHexColor } : {}}
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="flex items-center gap-2">
                        {stores.length > 0 && (
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm bg-white cursor-pointer"
                            >
                                <option value="All">All States</option>
                                {INDIAN_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* ERROR BANNER */}
            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 text-center text-sm font-medium border-b border-red-100 shrink-0">
                    {error}
                </div>
            )}

            {/* MAIN CONTENT SPLIT */}
            <div className="flex flex-1 overflow-hidden max-w-[1600px] w-full mx-auto">

                {/* LEFT - MAP */}
                <div className="hidden md:block w-2/5 lg:w-[40%] bg-gray-100 relative h-full border-r border-gray-200">
                    <StoreMap stores={filteredStores} selectedStore={selectedStore} />
                </div>

                {/* RIGHT - STORE LIST */}
                <div className="w-full md:w-3/5 lg:w-[60%] flex flex-col h-full bg-white relative">
                    {/* List Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm z-10 shrink-0 flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-900 border-b border-black inline-block pb-0.5">
                                View all stores
                            </p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {filteredStores.length} Stores
                        </span>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-pulse flex flex-col items-center gap-4">
                                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ) : filteredStores.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredStores.map((store) => {
                                    const isSelected = selectedStore?.id === store.id;
                                    return (
                                        <div
                                            key={store.id}
                                            onClick={() => setSelectedStore(isSelected ? null : store)}
                                            className={`p-6 transition-all duration-300 cursor-pointer group border-l-4 ${isSelected ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                                        >
                                            <h3 className={`text-lg font-medium transition-colors ${isSelected ? 'text-black' : 'text-gray-900 group-hover:text-red-700'}`}>
                                                {store.name}
                                            </h3>

                                            {/* <div className="mt-2 text-sm text-gray-500 font-medium">
                                                PRODUCTS: DEFAULT BEVERAGES
                                            </div> */}

                                            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                                {store.address} <br />
                                                {store.city}, {store.state} {store.pincode}
                                            </p>

                                            {/* {(store.mobileNumber || store.mobile) && !isSelected && (
                                                <p className="mt-1 text-sm text-gray-500 font-medium flex items-center gap-1">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1.28c-8.158 0-14.72-6.562-14.72-14.72V5z" /></svg>
                                                    {store.mobileNumber || store.mobile}
                                                </p>
                                            )} */}

                                            {/* EXPANDED DETAILS */}
                                            {isSelected && (
                                                <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="pt-4 border-t border-gray-200 space-y-3">
                                                        {(store.mobileNumber || store.mobile) && (
                                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1.28c-8.158 0-14.72-6.562-14.72-14.72V5z" /></svg>
                                                                </div>
                                                                <span className="font-semibold w-16">Phone:</span>
                                                                <span>{store.mobileNumber || store.mobile}</span>
                                                            </div>
                                                        )}
                                                        {store.email && (
                                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                                </div>
                                                                <span className="font-semibold w-16">Email:</span>
                                                                <span className="break-all">{store.email}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <a
                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude || store.lat},${store.longitude || store.lon}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()} // Prevent closing the accordion when clicking the link
                                                        className="w-full py-3 bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-md"
                                                    >
                                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                        Get Directions
                                                    </a>
                                                </div>
                                            )}

                                            {store.distance !== undefined && store.distance !== null && (
                                                <div className="mt-4 flex items-center">
                                                    <span className="text-sm font-bold text-gray-900 border border-gray-200 rounded px-2 py-1 shadow-sm">
                                                        📍 {store.distance.toFixed(1)} km
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 items-center justify-center p-12 text-center h-full text-gray-500">
                                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <p className="text-base font-medium">No stores found</p>
                                <p className="text-sm mt-1">Try searching a different area or removing the State filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
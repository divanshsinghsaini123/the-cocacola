"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetCampaignData } from "@/src/lib/strapi";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface MirzapurStrapiData {
    form_tittle?: string;
    form_heading?: string;
    bottle_heading?: string;
    bottle_descriptoin?: string;
    bottle_image?: {
        url?: string;
    };
    terms_and_conditions?: any;
}

export default function MirzapurPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [specialCode, setSpecialCode] = useState("");
    const [bottleImage, setBottleImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Strapi Data State
    const [campaignData, setCampaignData] = useState<MirzapurStrapiData | null>(null);

    useEffect(() => {
        const fetchStrapiData = async () => {
            try {
                const data = await GetCampaignData();
                if (data?.Mirzapur) {
                    setCampaignData(data.Mirzapur);
                }
            }
            catch (err) {
                console.error("Failed to fetch Strapi Campaign data:", err);
            }
        };
        fetchStrapiData();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBottleImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!name || !phone || !specialCode || !bottleImage) {
            setError("Please fill out all fields and upload the bottle photo.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("specialCode", specialCode);
            formData.append("bottleImage", bottleImage);

            const res = await fetch("/api/Campaigns/mirzapur", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || "Something went wrong.");
            }

            setMessage("Your entry has been accepted! We will let you know within 10 days.");
            // Reset Form
            setName("");
            setPhone("");
            setSpecialCode("");
            setBottleImage(null);
            setImagePreview(null);
        } catch (err: any) {
            setError(err.message || "Failed to submit form.");
        } finally {
            setLoading(false);
        }
    };

    // Dynamic field resolution from Strapi with fallbacks
    const formTitle = campaignData?.form_tittle;
    const formHeading = campaignData?.form_heading;
    const bottleHeading = campaignData?.bottle_heading;
    const bottleDescription = campaignData?.bottle_descriptoin;

    // Resolve Strapi bottle image URL if uploaded, fallback to local image
    const strapiImageUrl = campaignData?.bottle_image?.url;
    const guideImageSrc = getStrapiMediaUrl(strapiImageUrl) as string;
    console.log(guideImageSrc);
    return (
        <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 md:p-10 font-sans">
            <div className="max-w-5xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">

                {/* Left Side: Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                            {formTitle}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            {formHeading}
                        </h1>
                        <p className="text-neutral-400 text-sm mt-2">
                            Enter your details and bottle code to participate!
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                            🎉 {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 1. Name */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                            />
                        </div>

                        {/* 2. Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter your mobile number"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                            />
                        </div>

                        {/* 3. Special Code */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                                Special Code
                            </label>
                            <input
                                type="text"
                                value={specialCode}
                                onChange={(e) => setSpecialCode(e.target.value)}
                                placeholder="Enter the code on bottle"
                                required
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-sm"
                            />
                        </div>

                        {/* 4. Upload Bottle Photo */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                                Photo of Empty Bottle with code visible
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                required
                                className="w-full text-xs text-neutral-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 cursor-pointer"
                            />
                            {imagePreview && (
                                <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-700">
                                    <img
                                        src={imagePreview}
                                        alt="Bottle Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] font-bold text-white transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 text-sm"
                        >
                            {loading ? "Submitting Entry..." : "Submit Entry"}
                        </button>
                    </form>
                </div>

                {/* Right Side: Guide Image (mrp.png) & Strapi content */}
                <div className="bg-neutral-950 p-8 flex flex-col justify-center items-center border-t lg:border-t-0 lg:border-l border-neutral-800 text-center">
                    <h3 className="text-lg font-bold text-neutral-200 mb-2">
                        {bottleHeading}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                        {bottleDescription}
                    </p>
                    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-neutral-800 shadow-lg group">
                        <Image
                            src={guideImageSrc}
                            alt="Code Location Guide"
                            width={500}
                            height={500}
                            className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

            </div>
        </main>
    );
}


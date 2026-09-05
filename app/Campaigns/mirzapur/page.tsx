"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GetCampaignData } from "@/src/lib/strapi";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";
import Toast from "@/app/admin/_components/Toast";

interface MirzapurStrapiData {
    form_tittle?: string;
    form_heading?: string;
    bottle_heading?: string;
    bottle_descriptoin?: string;
    bottle_image?: {
        url?: string;
    };
    terms_and_conditions?: any;
    DisablePage?: boolean;
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

    // Terms & Conditions Modal and Checkbox State
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showInitialModal, setShowInitialModal] = useState(true); // 1st Modal: Opens automatically on initial page load
    const [showTermsModal, setShowTermsModal] = useState(false); // 2nd Modal: Detailed Strapi Terms & Conditions


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
    if (campaignData?.DisablePage == true) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold text-white">Comming soon</h1>
            </div>
        )
    }
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

        if (!termsAccepted) {
            setError("You must accept the Terms & Conditions to submit your entry.");
            return;
        }

        const cleanedPhone = phone.replace(/\D/g, "");
        if (cleanedPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanedPhone) || /^(\d)\1{9}$/.test(cleanedPhone)) {
            setError("Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.");
            return;
        }

        if (!name || !cleanedPhone || !specialCode || !bottleImage) {
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
            setTermsAccepted(false);
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
    const guideImageSrc = (strapiImageUrl && getStrapiMediaUrl(strapiImageUrl)) || "/mirzapur_page.png";

    // Render Strapi Rich Text / Blocks for Terms & Conditions (100% from Strapi)
    const renderTermsContent = (terms: any) => {
        if (!terms) {
            return (
                <div className="flex items-center justify-center p-8 text-neutral-400 text-sm">
                    Loading terms and conditions...
                </div>
            );
        }

        if (typeof terms === "string") {
            return <div className="whitespace-pre-wrap text-neutral-300 text-sm leading-relaxed">{terms}</div>;
        }

        if (Array.isArray(terms)) {
            return (
                <div className="space-y-3 text-neutral-300 text-sm leading-relaxed">
                    {terms.map((block: any, idx: number) => {
                        if (block.type === "heading") {
                            const text = block.children?.map((c: any) => c.text).join("") || "";
                            const level = block.level || 3;
                            if (level === 1) return <h1 key={idx} className="text-xl font-bold text-white mt-4 mb-2">{text}</h1>;
                            if (level === 2) return <h2 key={idx} className="text-lg font-bold text-white mt-4 mb-2">{text}</h2>;
                            return <h3 key={idx} className="text-base font-bold text-white mt-3 mb-1">{text}</h3>;
                        }

                        if (block.type === "paragraph") {
                            const children = block.children || [];
                            const isBlank = children.every((c: any) => !c.text || c.text.trim() === "");
                            if (isBlank) return <div key={idx} className="h-2" />;

                            return (
                                <p key={idx} className="text-neutral-300 text-xs md:text-sm">
                                    {children.map((child: any, cIdx: number) => {
                                        let content: React.ReactNode = child.text || "";
                                        if (child.bold) content = <strong key={cIdx} className="font-bold text-white">{content}</strong>;
                                        if (child.italic) content = <em key={cIdx} className="italic">{content}</em>;
                                        if (child.underline) content = <u key={cIdx} className="underline">{content}</u>;
                                        return <React.Fragment key={cIdx}>{content}</React.Fragment>;
                                    })}
                                </p>
                            );
                        }

                        if (block.type === "list") {
                            const isOrdered = block.format === "ordered";
                            const ListTag = isOrdered ? "ol" : "ul";
                            return (
                                <ListTag key={idx} className={`pl-5 space-y-1 ${isOrdered ? "list-decimal" : "list-disc"} text-neutral-300 text-xs md:text-sm`}>
                                    {block.children?.map((item: any, itemIdx: number) => (
                                        <li key={itemIdx}>
                                            {item.children?.map((c: any) => c.text).join("")}
                                        </li>
                                    ))}
                                </ListTag>
                            );
                        }

                        return null;
                    })}
                </div>
            );
        }

        return null;
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 md:p-10 font-sans relative">
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
                                inputMode="numeric"
                                value={phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    if (val.length <= 10) setPhone(val);
                                }}
                                placeholder="10-digit mobile number"
                                required
                                maxLength={10}
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

                        {/* 5. Terms & Conditions Checkbox */}
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                                required
                                className="mt-0.5 w-4 h-4 rounded bg-neutral-800 border-neutral-700 text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                            />
                            <label htmlFor="termsAccepted" className="text-xs text-neutral-300 leading-relaxed select-none">
                                I agree to the{" "}
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="text-red-500 hover:text-red-400 font-semibold underline focus:outline-none"
                                >
                                    Terms & Conditions
                                </button>{" "}
                                for participating in this contest.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !termsAccepted}
                            className="w-full mt-4 py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] font-bold text-white transition-all shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

            {/* 1st Modal: Participant Acceptance (Initial Page Load) */}
            {showInitialModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-1">
                                    Important Notice
                                </span>
                                <h2 className="text-xl font-bold text-white">Participant Acceptance</h2>
                            </div>
                            <button
                                onClick={() => setShowInitialModal(false)}
                                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                                aria-label="Close Modal"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 text-xs md:text-sm text-neutral-300 leading-relaxed">
                            <p>
                                The “FREE TICKET” mention on the promotional bottle refers to an opportunity to win a ₹250 movie voucher and does not guarantee a movie ticket or voucher.
                            </p>
                            <p>
                                By checking the box below and proceeding, you confirm that you have read, understood and voluntarily agreed to these Terms & Conditions, including the eligibility, verification, winner-selection and disqualification provisions. You acknowledge that participation, registration, scanning the QR code, or submission of proof does not guarantee selection as a winner or receipt of a ₹250 movie voucher.
                            </p>

                            {/* Hyperlink to 2nd Modal */}
                            <div className="pt-2 border-t border-neutral-800/80">
                                <button
                                    type="button"
                                    onClick={() => setShowTermsModal(true)}
                                    className="text-red-500 hover:text-red-400 font-semibold underline focus:outline-none flex items-center gap-1 text-xs"
                                >
                                    <span>Read Full Terms & Conditions</span>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-neutral-400">
                                Please accept to proceed to the campaign page.
                            </p>
                            <button
                                onClick={() => {
                                    setTermsAccepted(true);
                                    setShowInitialModal(false);
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white text-xs transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
                            >
                                I Accept & Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2nd Modal: Detailed Strapi Terms & Conditions Overlay */}
            {showTermsModal && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                            <div>
                                <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-1">
                                    Official Rules
                                </span>
                                <h2 className="text-xl font-bold text-white">Terms & Conditions</h2>
                            </div>
                            <button
                                onClick={() => setShowTermsModal(false)}
                                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                                aria-label="Close Modal"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            {renderTermsContent(campaignData?.terms_and_conditions)}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-neutral-400">
                                Please review and accept to participate in the contest.
                            </p>
                            <button
                                onClick={() => {
                                    setTermsAccepted(true);
                                    setShowTermsModal(false);
                                    setShowInitialModal(false);
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-white text-xs transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
                            >
                                I Accept & Agree
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Shared Toast Notifications */}
            {message && (
                <Toast
                    message={message}
                    type="success"
                    onClose={() => setMessage(null)}
                    duration={4000}
                />
            )}

            {error && (
                <Toast
                    message={error}
                    type="error"
                    onClose={() => setError(null)}
                    duration={4000}
                />
            )}
        </main>
    );
}

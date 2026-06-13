"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckSquare, Square, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Shop {
    _id: string;
    outletDetails: {
        shopName: string;
        ownerName: string;
        gender: string;
        address: string;
        area: string;
        pincode: number;
        mobileNumber: string;
        email?: string;
    };
    distributorDetails: {
        distributorName: string;
        accountNumber: number;
        hubName: string;
    };
    businessDetails: {
        fridgeType?: string;
        branding?: string[];
    };
}

export default function ReplacementRequestPage() {
    const router = useRouter();
    const [shops, setShops] = useState<Shop[]>([]);
    const [selectedShopId, setSelectedShopId] = useState("");
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [loadingShops, setLoadingShops] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs
    const [casesPerMonth, setCasesPerMonth] = useState("");
    const [describeIssue, setDescribeIssue] = useState("");
    const [triedToRepair, setTriedToRepair] = useState<"Yes" | "No">("No");
    const [fridgeType, setFridgeType] = useState("280");
    const [branding, setBranding] = useState<string[]>([]);
    const [currentSerial, setCurrentSerial] = useState("");
    const [currentMfgdDate, setCurrentMfgdDate] = useState("");

    // Load shops
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const res = await fetch("/api/visicooler");
                const data = await res.json();
                if (data.success) {
                    setShops(data.data);
                } else {
                    toast.error("Failed to fetch shops list");
                }
            } catch (err) {
                toast.error("Error fetching shops list");
            } finally {
                setLoadingShops(false);
            }
        };
        fetchShops();
    }, []);

    // Handle shop selection changes
    const handleShopSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedShopId(id);
        const shop = shops.find((s) => s._id === id);
        if (shop) {
            setSelectedShop(shop);
            // Autofill default values from the selected shop
            setFridgeType(shop.businessDetails?.fridgeType || "280");
            setBranding(shop.businessDetails?.branding || []);
        } else {
            setSelectedShop(null);
            setFridgeType("280");
            setBranding([]);
        }
    };

    const handleBrandingCheckbox = (type: string) => {
        setBranding((prev) => {
            if (prev.includes(type)) {
                return prev.filter((t) => t !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedShopId) {
            toast.error("Please select a shop first");
            return;
        }

        if (!casesPerMonth) {
            toast.error("Please specify the monthly case sales");
            return;
        }

        if (!describeIssue.trim()) {
            toast.error("Please describe the cooler issue");
            return;
        }

        if (!currentSerial.trim()) {
            toast.error("Please enter the current fridge serial number");
            return;
        }

        if (!currentMfgdDate.trim()) {
            toast.error("Please enter the current fridge manufactured date");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/visicooler/replacements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    shopId: selectedShopId,
                    casesPerMonth: Number(casesPerMonth),
                    describeIssue,
                    triedToRepair,
                    fridgeType,
                    branding,
                    currentSerial,
                    currentMfgdDate,
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Replacement request submitted successfully!");
                router.push("/visicooler");
            } else {
                toast.error(data.message || "Failed to submit request");
            }
        } catch (err) {
            toast.error("An error occurred during submission");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back Link */}
                <div>
                    <Link
                        href="/visicooler"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Portal
                    </Link>
                </div>

                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 rounded-full blur-2xl" />
                    <h1 className="text-3xl font-bold tracking-tight">Request Cooler Replacement</h1>
                    <p className="text-red-100 mt-2 max-w-xl text-sm md:text-base">
                        Select a shop to fetch its details, provide replacement specifications, and submit the request for admin verification.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Shop Selector Card */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                        <label htmlFor="shop-select" className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Select Shop *
                        </label>
                        {loadingShops ? (
                            <div className="animate-pulse h-12 bg-gray-100 rounded-xl" />
                        ) : (
                            <select
                                id="shop-select"
                                value={selectedShopId}
                                onChange={handleShopSelect}
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white font-medium text-gray-700"
                            >
                                <option value="">-- Choose registered shop from DB --</option>
                                {shops.map((shop) => (
                                    <option key={shop._id} value={shop._id}>
                                        {shop.outletDetails?.shopName} ({shop.outletDetails?.area})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {selectedShop && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            {/* Outlet Details Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                                <div className="border-b border-gray-150 pb-2 flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        1. Outlet Details
                                    </h3>
                                    <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-md">
                                        Auto-filled (Read-Only)
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Shop Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.outletDetails?.shopName || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Owner Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.outletDetails?.ownerName || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.outletDetails?.mobileNumber || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Gender</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.outletDetails?.gender || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Address</label>
                                        <textarea
                                            disabled
                                            rows={2}
                                            value={selectedShop.outletDetails?.address || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">City / State (Area)</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={`${selectedShop.outletDetails?.area || ""}, Pin: ${selectedShop.outletDetails?.pincode || ""}`}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="cases-month" className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                            Cases Per Month <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="cases-month"
                                            required
                                            min="0"
                                            placeholder="Enter average monthly case volume"
                                            value={casesPerMonth}
                                            onChange={(e) => setCasesPerMonth(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium text-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Distributor Details Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                                <div className="border-b border-gray-150 pb-2 flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        2. Distributor Details
                                    </h3>
                                    <span className="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-md">
                                        Auto-filled (Read-Only)
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Distributor Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.distributorDetails?.distributorName || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Account Number</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.distributorDetails?.accountNumber || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Hub Name</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={selectedShop.distributorDetails?.hubName || ""}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-gray-500 border border-gray-150 outline-none cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visicooler Details Card */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
                                <div className="border-b border-gray-150 pb-2">
                                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                                        3. Information About the Visicooler
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="describe-issue" className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                            Describe the issue <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="describe-issue"
                                            required
                                            rows={4}
                                            placeholder="Please provide details about what is wrong with the current cooler..."
                                            value={describeIssue}
                                            onChange={(e) => setDescribeIssue(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium text-gray-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                                                Have you tried to repair it?
                                            </label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setTriedToRepair("Yes")}
                                                    className={`flex-1 py-3 rounded-xl font-bold border transition-all ${triedToRepair === "Yes"
                                                            ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
                                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setTriedToRepair("No")}
                                                    className={`flex-1 py-3 rounded-xl font-bold border transition-all ${triedToRepair === "No"
                                                            ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
                                                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    No
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="fridge-type" className="block text-xs font-bold text-gray-700 uppercase mb-3">
                                                Fridge Type <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="fridge-type"
                                                value={fridgeType}
                                                onChange={(e) => setFridgeType(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all bg-white font-medium text-gray-700 animate-in fade-in duration-300"
                                            >
                                                <option value="255">255 Ltr</option>
                                                <option value="280">280 Ltr</option>
                                                <option value="360">360 Ltr</option>
                                                <option value="450">450 Ltr</option>
                                                <option value="mini">Mini</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-3">
                                            Branding Types
                                        </label>
                                        <div className="flex flex-wrap gap-4">
                                            {["ED", "Water", "Other"].map((type) => {
                                                const isChecked = branding.includes(type);
                                                return (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => handleBrandingCheckbox(type)}
                                                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-bold transition-all text-sm ${isChecked
                                                                ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
                                                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {isChecked ? (
                                                            <CheckSquare className="w-5 h-5 text-red-600" />
                                                        ) : (
                                                            <Square className="w-5 h-5 text-gray-400" />
                                                        )}
                                                        {type}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="serial-number" className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                                Current Fridge Serial Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="serial-number"
                                                required
                                                placeholder="e.g. SN-928374928"
                                                value={currentSerial}
                                                onChange={(e) => setCurrentSerial(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium text-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="mfg-date" className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                                Current Fridge Mfgd Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="mfg-date"
                                                required
                                                placeholder="e.g. MM/YYYY or Year"
                                                value={currentMfgdDate}
                                                onChange={(e) => setCurrentMfgdDate(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-medium text-gray-800"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Area */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Info className="w-4 h-4 text-red-500 shrink-0" />
                                    <span>Submitting will log request to database and notify admins.</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                            <span>Submitting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>Submit Request</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface ReplacementRequest {
    _id: string;
    shopId: {
        _id: string;
        outletDetails?: {
            shopName: string;
            ownerName: string;
            mobileNumber: string;
            address: string;
            area: string;
        };
    };
    shopDetailsSnapshot: {
        outletDetails: {
            shopName: string;
            ownerName: string;
            mobileNumber: string;
            address: string;
            area: string;
            pincode: number;
        };
        distributorDetails: {
            distributorName: string;
            accountNumber: number;
            hubName: string;
        };
    };
    casesPerMonth: number;
    describeIssue: string;
    triedToRepair: string;
    fridgeType: string;
    branding: string[];
    currentSerial: string;
    currentMfgdDate: string;
    status: "pending" | "completed";
    completedAt?: string;
    createdAt: string;
}

export default function AdminReplacementRequestsPage() {
    const [requests, setRequests] = useState<ReplacementRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/visicooler/replacements");
            const data = await res.json();
            if (data.success) {
                setRequests(data.data);
            } else {
                toast.error("Failed to fetch replacement requests");
            }
        } catch (err) {
            toast.error("Error loading replacement requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleMarkAsCompleted = async (id: string) => {
        if (!confirm("Are you sure you want to mark this replacement request as completed?")) return;

        setActionLoading(id);
        try {
            const res = await fetch("/api/visicooler/replacements", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: "completed" }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Request marked as completed!");
                // Update local state instead of full fetch
                setRequests((prev) =>
                    prev.map((req) =>
                        req._id === id
                            ? { ...req, status: "completed", completedAt: new Date().toISOString() }
                            : req
                    )
                );
            } else {
                toast.error(data.message || "Failed to update request");
            }
        } catch (err) {
            toast.error("Error marking request as completed");
        } finally {
            setActionLoading(null);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedRequest((prev) => (prev === id ? null : id));
    };

    const filteredRequests = requests.filter((req) => req.status === activeTab);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Back to Dashboard */}
            <div>
                <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
            </div>

            {/* Header */}
            <div className="text-left space-y-1.5">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Replacement Requests</h1>
                <p className="text-base text-gray-500">Track and manage cooler replacement requests submitted by field personnel.</p>
            </div>

            {/* Subtabs Navigation */}
            <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl border shadow-sm">
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                        activeTab === "pending"
                            ? "bg-amber-50 text-amber-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <Clock size={16} />
                    Pending ({requests.filter((r) => r.status === "pending").length})
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                        activeTab === "completed"
                            ? "bg-green-50 text-green-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                    <CheckCircle2 size={16} />
                    Completed ({requests.filter((r) => r.status === "completed").length})
                </button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex justify-center items-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center">
                    <div className={`p-4 rounded-full mb-3 ${activeTab === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                        {activeTab === 'pending' ? <Clock size={32} /> : <CheckCircle2 size={32} />}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {activeTab === "pending" ? "No pending replacement requests" : "No completed replacement requests"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                        {activeTab === "pending" ? "All submitted requests have been completed." : "Processed requests will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((req) => {
                        const isExpanded = expandedRequest === req._id;
                        const shopName = req.shopDetailsSnapshot?.outletDetails?.shopName || "Unknown Shop";
                        const ownerName = req.shopDetailsSnapshot?.outletDetails?.ownerName || "N/A";
                        const areaName = req.shopDetailsSnapshot?.outletDetails?.area || "N/A";
                        
                        return (
                            <div
                                key={req._id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Summary Header Row */}
                                <div
                                    onClick={() => toggleExpand(req._id)}
                                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                                                req.status === "completed" 
                                                    ? "bg-green-50 text-green-700 border-green-100" 
                                                    : "bg-amber-50 text-amber-700 border-amber-100"
                                            }`}>
                                                {req.status.toUpperCase()}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium">
                                                Requested: {new Date(req.createdAt).toLocaleDateString()}
                                            </span>
                                            {req.completedAt && (
                                                <span className="text-green-600 text-xs font-medium">
                                                    Completed: {new Date(req.completedAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900">{shopName}</h3>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                            <p><span className="font-semibold text-gray-400">Owner:</span> {ownerName}</p>
                                            <p><span className="font-semibold text-gray-400">Area:</span> {areaName}</p>
                                            <p><span className="font-semibold text-gray-400">Replacement Fridge:</span> {req.fridgeType} Ltr</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 self-end md:self-center">
                                        {req.status === "pending" && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMarkAsCompleted(req._id);
                                                }}
                                                disabled={actionLoading === req._id}
                                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-sm flex items-center gap-1.5"
                                            >
                                                {actionLoading === req._id ? (
                                                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                                                ) : (
                                                    <CheckCircle2 size={14} />
                                                )}
                                                Mark as Completed
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Full View */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-6 bg-gray-50/30 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            
                                            {/* Outlet Details Snap */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">1. Outlet Snap Details</h4>
                                                <div className="bg-white border border-gray-150 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                                    <p><span className="font-bold text-gray-400">Phone:</span> {req.shopDetailsSnapshot?.outletDetails?.mobileNumber || "N/A"}</p>
                                                    <p><span className="font-bold text-gray-400">Address:</span> {req.shopDetailsSnapshot?.outletDetails?.address || "N/A"}</p>
                                                    <p><span className="font-bold text-gray-400">Pincode:</span> {req.shopDetailsSnapshot?.outletDetails?.pincode || "N/A"}</p>
                                                    <p><span className="font-bold text-gray-400">Monthly Cases:</span> <strong className="text-amber-700">{req.casesPerMonth}</strong></p>
                                                </div>
                                            </div>

                                            {/* Distributor Details Snap */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">2. Distributor Snap Details</h4>
                                                <div className="bg-white border border-gray-155 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                                    <p><span className="font-bold text-gray-400">Distributor:</span> {req.shopDetailsSnapshot?.distributorDetails?.distributorName || "N/A"}</p>
                                                    <p><span className="font-bold text-gray-400">Account #:</span> {req.shopDetailsSnapshot?.distributorDetails?.accountNumber || "N/A"}</p>
                                                    <p><span className="font-bold text-gray-400">Hub Name:</span> {req.shopDetailsSnapshot?.distributorDetails?.hubName || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* Visicooler Request details */}
                                            <div className="space-y-3">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">3. Visicooler Information</h4>
                                                <div className="bg-white border border-gray-155 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                                    <p><span className="font-bold text-gray-400">Tried to Repair?:</span> {req.triedToRepair}</p>
                                                    <p><span className="font-bold text-gray-400">Requested Type:</span> {req.fridgeType} Ltr</p>
                                                    <p><span className="font-bold text-gray-400">Branding:</span> {req.branding.join(", ") || "None"}</p>
                                                    <p><span className="font-bold text-gray-400">Current Serial:</span> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{req.currentSerial}</code></p>
                                                    <p><span className="font-bold text-gray-400">Current Mfg Date:</span> {req.currentMfgdDate}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Issue message */}
                                        <div className="bg-amber-50/40 border border-amber-200/50 rounded-xl p-5 space-y-2">
                                            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">Detailed Issue Description</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                                "{req.describeIssue}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

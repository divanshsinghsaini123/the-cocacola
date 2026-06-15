"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, X, Eye, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ShopRequestItem {
  _id: string;
  type: "create" | "edit";
  shopId?: string;
  requestedData: {
    outletDetails?: {
      shopName: string;
      ownerName: string;
      area: string;
      mobileNumber: string;
    };
  };
  status: string;
  requestedBy: string;
  createdAt: string;
}

interface RequestHistoryItem {
  _id: string;
  requestId: string;
  type: "create" | "edit";
  shopId?: string;
  requestedData: {
    outletDetails?: {
      shopName: string;
      ownerName: string;
    };
  };
  action: "approved" | "rejected";
  actionBy: string;
  actionAt: string;
}

interface ReplacementRequestItem {
  _id: string;
  shopId: {
    _id: string;
    outletDetails?: {
      shopName: string;
      ownerName: string;
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
  currentMfgdDate: string | Date;
  status: "pending" | "completed";
  completedAt?: string;
  createdAt: string;
}

export default function RequestsDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  // Main Tab: "shops" | "replacements"
  const [mainTab, setMainTab] = useState<"shops" | "replacements">("shops");

  // Shop Registration Sub-tabs: "pending" | "history"
  const [shopSubTab, setShopSubTab] = useState<"pending" | "history">("pending");

  // Replacement Request Sub-tabs: "pending" | "completed"
  const [replacementSubTab, setReplacementSubTab] = useState<"pending" | "completed">("pending");

  // Shop requests states
  const [pendingRequests, setPendingRequests] = useState<ShopRequestItem[]>([]);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);

  // Replacement requests states
  const [replacementRequests, setReplacementRequests] = useState<ReplacementRequestItem[]>([]);
  const [expandedReplacement, setExpandedReplacement] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Parse URL tab parameter on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("tab") === "replacement") {
        setMainTab("replacements");
      }
    }
  }, []);

  // Authenticate admin from local storage session
  useEffect(() => {
    const sessionStr = localStorage.getItem("visicooler_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.role === "Superadmin") {
          setIsAdmin(true);
        } else {
          toast.error("Unauthorized: Superadmin session required");
          router.push("/visicooler");
        }
      } catch (e) {
        toast.error("Invalid session");
        router.push("/visicooler");
      }
    } else {
      toast.error("Access Denied: Please authenticate first");
      router.push("/visicooler");
    }
  }, [router]);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch("/api/visicooler/requests");
      const data = await res.json();
      if (data.success) {
        setPendingRequests(data.data);
      } else {
        toast.error(data.message || "Failed to fetch pending requests");
      }
    } catch (err) {
      toast.error("Error fetching requests");
    }
  };

  const fetchRequestHistory = async () => {
    try {
      const res = await fetch("/api/visicooler/requests/history");
      const data = await res.json();
      if (data.success) {
        setRequestHistory(data.data);
      } else {
        toast.error(data.message || "Failed to fetch request history");
      }
    } catch (err) {
      toast.error("Error fetching request history");
    }
  };

  const fetchReplacements = async () => {
    try {
      const res = await fetch("/api/visicooler/replacements");
      const data = await res.json();
      if (data.success) {
        setReplacementRequests(data.data);
      } else {
        toast.error(data.message || "Failed to fetch replacement requests");
      }
    } catch (err) {
      toast.error("Error fetching replacement requests");
    }
  };

  // Load data depending on state variables
  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      const loadData = async () => {
        if (mainTab === "shops") {
          if (shopSubTab === "pending") {
            await fetchPendingRequests();
          } else {
            await fetchRequestHistory();
          }
        } else {
          await fetchReplacements();
        }
        setLoading(false);
      };
      loadData();
    }
  }, [isAdmin, mainTab, shopSubTab]);

  // Handler for normal shop rejection
  const handleReject = async (requestId: string) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    setActionLoading(requestId);
    try {
      const res = await fetch("/api/visicooler/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action: "reject",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Request rejected successfully");
        setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
      } else {
        toast.error(data.message || "Failed to reject request");
      }
    } catch (err) {
      toast.error("Error rejecting request");
    } finally {
      setActionLoading(null);
    }
  };

  // Handler for replacement requests completion
  const handleMarkReplacementCompleted = async (id: string) => {
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
        toast.success("Replacement marked as completed!");
        setReplacementRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? { ...req, status: "completed", completedAt: new Date().toISOString() }
              : req
          )
        );
      } else {
        toast.error(data.message || "Failed to complete replacement request");
      }
    } catch (err) {
      toast.error("Error completing replacement request");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleExpandReplacement = (id: string) => {
    setExpandedReplacement((prev) => (prev === id ? null : id));
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Filter replacements by subtab status
  const filteredReplacements = replacementRequests.filter((r) => r.status === replacementSubTab);

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/visicooler"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm mb-1"
            >
              <ArrowLeft size={16} />
              Back to Portal
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Workspace</h1>
            <p className="text-sm text-gray-500">Review registrations, shop updates, and cooler replacements.</p>
          </div>
        </div>

        {/* Main Tab System */}
        <div className="flex gap-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap pb-0.5 scrollbar-none">
          <button
            onClick={() => setMainTab("shops")}
            className={`pb-3.5 font-bold text-sm border-b-2 transition-all px-1 flex items-center gap-2 shrink-0 ${mainTab === "shops"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            <span>Shop Registrations</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
              {pendingRequests.length}
            </span>
          </button>
          <button
            onClick={() => setMainTab("replacements")}
            className={`pb-3.5 font-bold text-sm border-b-2 transition-all px-1 flex items-center gap-2 shrink-0 ${mainTab === "replacements"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            <span>Cooler Replacements</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
              {replacementRequests.filter(r => r.status === "pending").length}
            </span>
          </button>
        </div>

        {/* ---------------- SHOP REGISTRATIONS WORKSPACE ---------------- */}
        {mainTab === "shops" && (
          <div className="space-y-6">
            {/* Sub Tabs */}
            <div className="grid grid-cols-2 bg-white p-1.5 rounded-xl border shadow-sm gap-1">
              <button
                onClick={() => setShopSubTab("pending")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all ${shopSubTab === "pending"
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <Clock size={16} />
                Pending ({pendingRequests.length})
              </button>
              <button
                onClick={() => setShopSubTab("history")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all ${shopSubTab === "history"
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <CheckCircle2 size={16} />
                History
              </button>
            </div>

            {/* List Loader / Render */}
            {loading ? (
              <div className="flex justify-center items-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : shopSubTab === "pending" ? (
              pendingRequests.length === 0 ? (
                <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center">
                  <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
                  <p className="text-gray-500 text-sm mt-1">There are no pending shop approval requests.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req._id}
                      className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${req.type === "create"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                              }`}
                          >
                            {req.type === "create" ? "New Shop Request" : "Edit Request"}
                          </span>
                          <span className="text-gray-400 text-xs font-medium">
                            Submitted {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">
                          {req.requestedData.outletDetails?.shopName || "N/A"}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-gray-500">
                          <p>
                            <span className="font-semibold text-gray-400">Owner:</span>{" "}
                            {req.requestedData.outletDetails?.ownerName || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-400">Area:</span>{" "}
                            {req.requestedData.outletDetails?.area || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-400">Requested By:</span>{" "}
                            {req.requestedBy}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                        <Link
                          href={`/visicooler/createshop?requestId=${req._id}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm"
                        >
                          <Eye size={16} />
                          View & Approve
                        </Link>
                        <button
                          onClick={() => handleReject(req._id)}
                          disabled={actionLoading === req._id}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold transition-all text-sm border border-red-100 disabled:opacity-75"
                        >
                          {actionLoading === req._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <X size={16} />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : requestHistory.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                  <Clock size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No history logs</h3>
                <p className="text-gray-500 text-sm mt-1">Processed approval requests will show up here.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 sm:p-5 bg-gray-50/50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <div className="col-span-3">Shop Name</div>
                  <div className="col-span-2">Request Type</div>
                  <div className="col-span-2 text-center">Action</div>
                  <div className="col-span-2">Processed By</div>
                  <div className="col-span-3 text-right">Processed At</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {requestHistory.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:grid md:grid-cols-12 gap-2.5 md:gap-4 p-4 sm:p-5 items-start md:items-center text-sm"
                    >
                      <div className="col-span-3 font-bold text-gray-900">
                        {item.requestedData.outletDetails?.shopName || "N/A"}
                      </div>

                      <div className="col-span-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 md:hidden">Request Type:</span>
                        <span className="capitalize font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-150">
                          {item.type}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center justify-start md:justify-center gap-2">
                        <span className="text-xs font-bold text-gray-400 md:hidden">Action:</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${item.action === "approved"
                              ? "bg-green-50 text-green-700 border border-green-150"
                              : "bg-red-50 text-red-700 border border-red-150"
                            }`}
                        >
                          {item.action === "approved" ? (
                            <>
                              <CheckCircle2 size={12} /> Approved
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Rejected
                            </>
                          )}
                        </span>
                      </div>

                      <div className="col-span-2 flex items-center gap-2 text-gray-600 font-medium">
                        <span className="text-xs font-bold text-gray-400 md:hidden">Processed By:</span>
                        <span>{item.actionBy}</span>
                      </div>

                      <div className="col-span-3 text-left md:text-right text-gray-400 text-xs font-medium w-full md:w-auto flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400 md:hidden">Processed At:</span>
                        <span>{new Date(item.actionAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- COOLER REPLACEMENTS WORKSPACE ---------------- */}
        {mainTab === "replacements" && (
          <div className="space-y-6">
            {/* Subtabs Navigation */}
            <div className="grid grid-cols-2 bg-white p-1.5 rounded-xl border shadow-sm gap-1">
              <button
                onClick={() => setReplacementSubTab("pending")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all ${replacementSubTab === "pending"
                    ? "bg-amber-50 text-amber-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <Clock size={16} />
                Pending ({replacementRequests.filter((r) => r.status === "pending").length})
              </button>
              <button
                onClick={() => setReplacementSubTab("completed")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all ${replacementSubTab === "completed"
                    ? "bg-green-50 text-green-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <CheckCircle2 size={16} />
                Completed ({replacementRequests.filter((r) => r.status === "completed").length})
              </button>
            </div>

            {/* List Loader / Render */}
            {loading ? (
              <div className="flex justify-center items-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredReplacements.length === 0 ? (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center">
                <div className={`p-4 rounded-full mb-3 ${replacementSubTab === 'pending' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                  {replacementSubTab === 'pending' ? <Clock size={32} /> : <CheckCircle2 size={32} />}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {replacementSubTab === "pending" ? "All replacements completed!" : "No completed replacements"}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {replacementSubTab === "pending" ? "There are no pending replacements at this moment." : "Approved completed replacements show here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReplacements.map((req) => {
                  const isExpanded = expandedReplacement === req._id;
                  const shopName = req.shopDetailsSnapshot?.outletDetails?.shopName || "Unknown Shop";
                  const ownerName = req.shopDetailsSnapshot?.outletDetails?.ownerName || "N/A";
                  const areaName = req.shopDetailsSnapshot?.outletDetails?.area || "N/A";

                  return (
                    <div
                      key={req._id}
                      className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Summary Row */}
                      <div
                        onClick={() => toggleExpandReplacement(req._id)}
                        className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/40 transition-colors"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${req.status === "completed"
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
                            <p><span className="font-semibold text-gray-400">Target Cooler:</span> {req.fridgeType} Ltr</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t border-gray-100 md:border-transparent">
                          {req.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkReplacementCompleted(req._id);
                              }}
                              disabled={actionLoading === req._id}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-sm flex items-center gap-1.5"
                            >
                              {actionLoading === req._id ? (
                                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
                              ) : (
                                <CheckCircle2 size={14} />
                              )}
                              Mark Completed
                            </button>
                          )}
                          <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Accordion Expanded Snap Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50/30 space-y-6 animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Outlet Snapshot */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">1. Outlet Snap Details</h4>
                              <div className="bg-white border border-gray-150 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                <p><span className="font-bold text-gray-450">Phone:</span> {req.shopDetailsSnapshot?.outletDetails?.mobileNumber || "N/A"}</p>
                                <p><span className="font-bold text-gray-450">Address:</span> {req.shopDetailsSnapshot?.outletDetails?.address || "N/A"}</p>
                                <p><span className="font-bold text-gray-450">Pincode:</span> {req.shopDetailsSnapshot?.outletDetails?.pincode || "N/A"}</p>
                                <p><span className="font-bold text-gray-450">Monthly Cases:</span> <strong className="text-amber-700">{req.casesPerMonth}</strong></p>
                              </div>
                            </div>

                            {/* Distributor Snapshot */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">2. Distributor Snap Details</h4>
                              <div className="bg-white border border-gray-150 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                <p><span className="font-bold text-gray-455">Distributor:</span> {req.shopDetailsSnapshot?.distributorDetails?.distributorName || "N/A"}</p>
                                <p><span className="font-bold text-gray-455">Account #:</span> {req.shopDetailsSnapshot?.distributorDetails?.accountNumber || "N/A"}</p>
                                <p><span className="font-bold text-gray-455">Hub Name:</span> {req.shopDetailsSnapshot?.distributorDetails?.hubName || "N/A"}</p>
                              </div>
                            </div>

                            {/* Cooler Specifications */}
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">3. Cooler Information</h4>
                              <div className="bg-white border border-gray-155 rounded-xl p-4 text-sm space-y-2.5 shadow-sm">
                                <p><span className="font-bold text-gray-455">Tried to Repair?:</span> {req.triedToRepair}</p>
                                <p><span className="font-bold text-gray-455">Fridge Type:</span> {req.fridgeType} Ltr</p>
                                <p><span className="font-bold text-gray-455">Branding:</span> {req.branding.join(", ") || "None"}</p>
                                <p><span className="font-bold text-gray-455">Current Serial:</span> <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{req.currentSerial}</code></p>
                                <p>
                                  <span className="font-bold text-gray-455">Current Mfg Date:</span>{" "}
                                  {req.currentMfgdDate ? new Date(req.currentMfgdDate).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Issue description */}
                          <div className="bg-amber-50/30 border border-amber-200/40 rounded-xl p-5 space-y-2">
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
        )}

      </div>
    </div>
  );
}

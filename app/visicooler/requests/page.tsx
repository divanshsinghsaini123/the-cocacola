"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, X, Eye, Clock, CheckCircle2, XCircle } from "lucide-react";
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

export default function RequestsDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [pendingRequests, setPendingRequests] = useState<ShopRequestItem[]>([]);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      const loadData = async () => {
        if (activeTab === "pending") {
          await fetchPendingRequests();
        } else {
          await fetchRequestHistory();
        }
        setLoading(false);
      };
      loadData();
    }
  }, [isAdmin, activeTab]);

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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Approval Requests</h1>
            <p className="text-sm text-gray-500">Review and authorize pending shop registrations and edit modifications.</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 bg-white p-1.5 rounded-xl border shadow-sm">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "pending"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Clock size={16} />
            Pending Queue ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
              activeTab === "history"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <CheckCircle2 size={16} />
            Request History
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : activeTab === "pending" ? (
          pendingRequests.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col items-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3 text-gray-400">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">All caught up!</h3>
              <p className="text-gray-500 text-sm mt-1">There are no pending approval requests at the moment.</p>
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
                        className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                          req.type === "create"
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

                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
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
                      className="inline-flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-bold transition-all text-sm border border-red-100 disabled:opacity-75"
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
                  className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 p-4 sm:p-5 items-start md:items-center text-sm"
                >
                  <div className="col-span-3 font-bold text-gray-900">
                    {item.requestedData.outletDetails?.shopName || "N/A"}
                  </div>

                  <div className="col-span-2">
                    <span className="capitalize font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-150">
                      {item.type}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-start md:justify-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full ${
                        item.action === "approved"
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

                  <div className="col-span-2 text-gray-600 font-medium">
                    {item.actionBy}
                  </div>

                  <div className="col-span-3 text-right text-gray-400 text-xs font-medium w-full md:w-auto">
                    {new Date(item.actionAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

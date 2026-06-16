"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Plus, MapPin, Hash, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import GcoreUpload from "@/app/admin/_components/GcoreUpload";

interface Shop {
  _id: string;
  outletDetails: {
    shopName: string;
    pincode: number;
    area: string;
  };
  businessDetails: {
    visicooler: string[];
  };
  isActive: boolean;
}

export default function VisicoolerShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem("visicooler_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.role === "Superadmin") {
          setIsAdmin(true);
        } else {
          // If not admin, show steps modal if not dismissed
          const dismissed = localStorage.getItem("dismissed_visicooler_steps");
          if (dismissed !== "true") {
            setShowStepsModal(true);
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      // If no session is saved yet, open modal as a helpful default
      const dismissed = localStorage.getItem("dismissed_visicooler_steps");
      if (dismissed !== "true") {
        setShowStepsModal(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("/api/visicooler");
        const data = await res.json();
        if (data.success) {
          setShops(data.data);
        } else {
          toast.error("Failed to fetch shops");
        }
      } catch (error) {
        toast.error("Error fetching shops");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleImageUpload = async (id: string, url: string) => {
    try {
      const res = await fetch("/api/visicooler", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "add_image", url }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Image uploaded successfully");
        // Re-fetch shops list to ensure it is up to date
        const resShops = await fetch("/api/visicooler");
        const dataShops = await resShops.json();
        if (dataShops.success) {
          setShops(dataShops.data);
        }
      } else {
        toast.error("Failed to save image to database");
      }
    } catch (error) {
      toast.error("Error saving image");
    }
  };

  const handleCloseModal = () => {
    if (dontShowAgain) {
      localStorage.setItem("dismissed_visicooler_steps", "true");
    }
    setShowStepsModal(false);
  };

  const filteredShops = shops.filter((shop) => {
    const query = searchQuery.toLowerCase();
    const shopName = shop.outletDetails?.shopName || "";
    const pincode = shop.outletDetails?.pincode?.toString() || "";
    const area = shop.outletDetails?.area || "";
    const visicoolerString = shop.businessDetails?.visicooler?.join(", ").toLowerCase() || "";

    return (
      shopName.toLowerCase().includes(query) ||
      pincode.includes(query) ||
      area.toLowerCase().includes(query) ||
      visicoolerString.includes(query)
    );
  });

  const handleExport = (shop: Shop) => {
    window.open(`/api/admin/cron/manual-report?shopId=${shop._id}`, "_blank");
    toast.success(`Downloading report for ${shop.outletDetails?.shopName || 'Shop'}...`);
  };

  /*
  const handleDownloadEmptyForm = () => {
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
          toast.error("Popup blocked! Please allow popups to download the form.");
          return;
      }

      const logoUrl = typeof window !== 'undefined' ? window.location.origin + '/C9LOGO_BevPartner_BLACK.png' : '/C9LOGO_BevPartner_BLACK.png';

      const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Empty Shop Registration Form</title>
      <style>
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
          }
          .no-print {
            display: none;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: #1f2937;
          padding: 40px;
          margin: 0;
          line-height: 1.6;
          background-color: #ffffff;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 4px solid #e60000;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .title-area h1 {
          color: #e60000;
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .title-area p {
          margin: 4px 0 0 0;
          color: #4b5563;
          font-size: 13px;
        }
        .logo {
          font-size: 26px;
          font-weight: 900;
          color: #e60000;
          font-style: italic;
        }
        .section {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .section-title {
          background-color: #fef2f2;
          color: #991b1b;
          font-size: 14px;
          font-weight: 700;
          padding: 6px 12px;
          border-left: 4px solid #e60000;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .grid {
          display: grid;
          grid-template-cols: 1fr 1fr;
          gap: 12px 24px;
        }
        .grid-full {
          grid-column: span 2;
        }
        .field {
          display: flex;
          flex-direction: column;
        }
        .field-label {
          font-size: 11px;
          font-weight: 700;
          color: #4b5563;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-value-line {
          border-bottom: 1px dotted #9ca3af;
          height: 24px;
          margin-top: 2px;
        }
        .checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 4px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #1f2937;
        }
        .checkbox-box {
          width: 12px;
          height: 12px;
          border: 1.5px solid #4b5563;
          margin-right: 6px;
          display: inline-block;
          border-radius: 2px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          text-align: center;
          font-size: 10px;
          color: #9ca3af;
        }
        .sign-area {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          page-break-inside: avoid;
        }
        .sign-box {
          width: 45%;
          text-align: center;
        }
        .sign-line {
          border-bottom: 1px solid #9ca3af;
          margin-bottom: 6px;
          height: 36px;
        }
        .sign-title {
          font-size: 11px;
          font-weight: 700;
          color: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title-area">
          <h1>Visicooler Shop Registration</h1>
          <p>Application Form for Outlet Enrollment</p>
        </div>
        <div class="logo">
          <img src="${logoUrl}" alt="Cloud9 Logo" style="max-height: 120px; object-fit: contain;" />
        </div>
      </div>

      <!-- Section 1: Outlet Details -->
      <div class="section">
        <div class="section-title">1. Outlet Details</div>
        <div class="grid">
          <div class="field grid-full">
            <span class="field-label">Shop Name *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Owner Name *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Date (DD/MM/YYYY) *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Gender *</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> Male</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Female</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Other</div>
            </div>
          </div>
          
          <div class="field grid-full">
            <span class="field-label">Address *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Area *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Pincode *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Mobile Number *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Email Address</span>
            <div class="field-value-line"></div>
          </div>
        </div>
      </div>

      <!-- Section 2: Distributor Details -->
      <div class="section">
        <div class="section-title">2. Distributor Details</div>
        <div class="grid">
          <div class="field">
            <span class="field-label">Distributor Name *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Account Number *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field grid-full">
            <span class="field-label">Hub Name *</span>
            <div class="field-value-line"></div>
          </div>
        </div>
      </div>

      <!-- Section 3: Business Details -->
      <div class="section">
        <div class="section-title">3. Business Details</div>
        <div class="grid">
          <div class="field">
            <span class="field-label">Outlet Type *</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Visibility *</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> Main Road</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Internal Road</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Premium</div>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Nearby Area Footfall *</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> High</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Medium</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Low</div>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Fridge Type</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> 255 ltr</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> 280 ltr</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> 360 ltr</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> 450 ltr</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Mini</div>
            </div>
          </div>
          <div class="field grid-full">
            <span class="field-label">Branding Type *</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> ED</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Water</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> Other</div>
            </div>
          </div>
          <div class="field">
            <span class="field-label">Competitors Present *</span>
            <div class="checkbox-group">
              <div class="checkbox-item"><span class="checkbox-box"></span> Yes</div>
              <div class="checkbox-item"><span class="checkbox-box"></span> No</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Administrative & Visicooler Details -->
      <div class="section">
        <div class="section-title">4. Administrative & Visicooler Details</div>
        <div class="grid">
          <div class="field">
            <span class="field-label">Area Sales Manager (ASM) Name</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field">
            <span class="field-label">Sales Executive (SE) Name</span>
            <div class="field-value-line"></div>
          </div>
          <div class="field grid-full">
            <span class="field-label">Visicooler Sizes (Comma separated)</span>
            <div class="field-value-line"></div>
          </div>
        </div>
      </div>

      <!-- Section 5: Documents Required -->
      <div class="section" style="page-break-inside: avoid;">
        <div class="section-title">5. Verification Documents Checklist</div>
        <div style="font-size: 12px; color: #4b5563; margin-bottom: 8px;">
          Please ensure physical/digital copies of the following are attached:
        </div>
        <div class="checkbox-group" style="flex-direction: column; gap: 6px;">
          <div class="checkbox-item"><span class="checkbox-box"></span> Aadhar Card</div>
          <div class="checkbox-item"><span class="checkbox-box"></span> PAN Card</div>
          <div class="checkbox-item"><span class="checkbox-box"></span> Electricity Bill</div>
          <div class="checkbox-item"><span class="checkbox-box"></span> Shop Agreement</div>
          <div class="checkbox-item"><span class="checkbox-box"></span> Previous 3 Months Sales/Operating Data (Data sheet / invoices)</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() {
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
  };
  */

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            {!isAdmin && (
              <Link
                href="/visicooler"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm mb-2"
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            )}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isAdmin ? "Visicooler Shops" : "My Outlets & Shops"}
            </h1>
            <p className="text-gray-500 mt-1">
              {isAdmin
                ? "Manage and export all registered shop data."
                : "Find your registered shop and upload verification photos."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full sm:flex sm:flex-row sm:items-center sm:gap-3 sm:w-auto mt-2 sm:mt-0">
            {isAdmin && (
              <Link
                href="/visicooler/requests"
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm w-full sm:w-auto text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Review Requests
              </Link>
            )}
            <a
              href="/Visi Cooler Request Form.pdf"
              download="Visi Cooler Request Form.pdf"
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm w-full sm:w-auto text-sm"
            >
              <Download size={18} className="text-gray-500" />
              Download Form
            </a>
            <Link
              href="/visicooler/replacement"
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
              Request Replacement
            </Link>
            <Link
              href="/visicooler/createshop"
              className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto text-sm ${isAdmin ? 'col-span-1' : 'col-span-2'} sm:col-span-1`}
            >
              <Plus size={20} />
              Add New Shop
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500 sm:text-base transition-all shadow-sm"
            placeholder={isAdmin
              ? "Search by name, area, pincode, or visicooler capacity..."
              : "Type shop name or area to search..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Helpful Banner for non-tech users */}
        {!isAdmin && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start sm:items-center gap-3 shadow-sm text-red-800 animate-in fade-in duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 shrink-0 mt-0.5 sm:mt-0"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            <div className="text-xs sm:text-sm font-medium">
              <span className="font-bold text-red-700">📸 Easy Photo Upload:</span> Find your shop below and tap the red <strong className="text-red-700 font-extrabold underline decoration-red-300">Upload Photo</strong> button next to it to upload pictures of your visicooler!
            </div>
          </div>
        )}

        {/* Horizontal List View */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredShops.length > 0 ? (
          <div className={!isAdmin ? "lg:bg-white lg:border lg:border-gray-200 lg:rounded-xl lg:shadow-sm lg:overflow-hidden" : "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"}>
            {/* List Header (Visible on large screens) */}
            <div className="hidden lg:grid grid-cols-12 gap-4 p-4 sm:p-5 bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-3">Shop Name</div>
              <div className="col-span-2">Area</div>
              {isAdmin && <div className="col-span-2">Pincode</div>}
              {isAdmin && <div className="col-span-2">Visicoolers</div>}
              {isAdmin && <div className="col-span-1 text-center">Status</div>}
              <div className={!isAdmin ? "col-span-7 text-right" : "col-span-2 text-right"}>Actions</div>
            </div>

            {/* List Rows */}
            <div className={!isAdmin ? "flex flex-col gap-4 lg:block lg:divide-y lg:divide-gray-100 p-1 lg:p-0" : "divide-y divide-gray-100"}>
              {filteredShops.map((shop) => (
                <div
                  key={shop._id}
                  className={!isAdmin
                    ? "bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-4 lg:bg-transparent lg:border-0 lg:shadow-none lg:rounded-none lg:p-5 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center hover:lg:bg-gray-50/80 transition-colors"
                    : "flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 p-4 sm:p-5 items-start lg:items-center hover:bg-gray-50/80 transition-colors"}
                >
                  {/* Shop Name */}
                  <div className="col-span-3 flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-bold text-lg">
                        {(shop.outletDetails?.shopName || 'S').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 truncate max-w-[200px]" title={shop.outletDetails?.shopName}>
                        {shop.outletDetails?.shopName}
                      </h2>
                    </div>
                  </div>

                  {/* Area */}
                  <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="text-gray-400 lg:hidden" />
                    <span className="truncate" title={shop.outletDetails?.area}>{shop.outletDetails?.area}</span>
                  </div>

                  {/* Pincode */}
                  {isAdmin &&
                    <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                      <Hash size={16} className="text-gray-400 lg:hidden" />
                      <span>{shop.outletDetails?.pincode}</span>
                    </div>}

                  {/* Visicoolers */}
                  {isAdmin &&
                    <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                      <Package size={16} className="text-gray-400 lg:hidden" />
                      <span className="truncate" title={shop.businessDetails?.visicooler?.join(', ')}>
                        {shop.businessDetails?.visicooler && shop.businessDetails.visicooler.length > 0
                          ? shop.businessDetails.visicooler.join(', ')
                          : <span className="text-gray-400 italic">None</span>}
                      </span>
                    </div>}

                  {/* Status */}
                  {isAdmin &&
                    <div className="col-span-1 flex items-center justify-start lg:justify-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {shop.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>}

                  {/* Actions */}
                  <div className={!isAdmin ? "col-span-7 flex flex-wrap lg:flex-nowrap items-center justify-start lg:justify-end gap-2.5 w-full lg:w-auto mt-2 lg:mt-0 pt-2 lg:pt-0 border-t border-gray-100 lg:border-t-0" : "col-span-2 flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto mt-2 lg:mt-0"}>
                    <Link
                      href={`/visicooler/${shop._id}`}
                      className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 px-3.5 py-2.5 rounded-xl border border-gray-200 transition-colors text-sm font-bold shadow-sm w-full lg:w-auto text-center"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                    {isAdmin &&
                      <button
                        onClick={() => handleExport(shop)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-blue-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold shadow-sm w-full lg:w-auto justify-center"
                      >
                        <Download size={16} />
                        Export
                      </button>}
                    {!isAdmin && (
                      <GcoreUpload folder="visicooler" onSuccess={(url) => handleImageUpload(shop._id, url)} multiple={true}>
                        {({ open, isLoading }) => (
                          <button
                            onClick={open}
                            disabled={isLoading}
                            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white lg:px-10 px-6 py-2.5 rounded-xl font-extrabold transition-all text-sm shadow-lg shadow-red-600/35 w-full lg:w-auto active:scale-95 disabled:opacity-75"
                          >
                            {isLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Plus size={16} />
                            )}
                            <span>{isLoading ? "Uploading..." : "Upload Photo"}</span>
                          </button>
                        )}
                      </GcoreUpload>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No shops found</h3>
            <p className="text-gray-500 max-w-sm">We couldn't find any shops matching "{searchQuery}". Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {showStepsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gray-150 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col gap-5">
            
            {/* Modal Header */}
            <div className="text-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Quick Guide
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Upload your visicooler photo in 3 easy steps
              </p>
            </div>

            {/* Modal Steps */}
            <div className="space-y-4 my-2">
              <div className="flex gap-3.5 items-start bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm mt-0.5">1</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-950">Search Your Shop</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Type your shop name or area in the search bar above.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm mt-0.5">2</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-950">Click Upload Button</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Tap the red <strong className="text-red-600 font-extrabold">Upload Photo</strong> button next to your shop name.</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm mt-0.5">3</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-gray-950">Select & Upload Image</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Take a live photo or pick an image of the visicooler to upload it.</p>
                </div>
              </div>
            </div>

            {/* Don't show again checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer text-gray-600 text-xs sm:text-sm font-semibold select-none self-start">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 border-gray-300 focus:ring-red-500 focus:ring-opacity-25"
              />
              <span>Don't show this guide again</span>
            </label>

            {/* Action button */}
            <button
              onClick={handleCloseModal}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-2xl transition-all shadow-lg shadow-red-600/25 text-sm sm:text-base tracking-wide active:scale-95"
            >
              Got It, Let's Start!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

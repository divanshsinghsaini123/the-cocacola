"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Plus, MapPin, Hash, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

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

    useEffect(() => {
        const sessionStr = localStorage.getItem("visicooler_session");
        if (sessionStr) {
            try {
                const session = JSON.parse(sessionStr);
                if (session.role === "Superadmin") {
                    setIsAdmin(true);
                }
            } catch (e) {
                console.error(e);
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

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <Link
                            href="/visicooler"
                            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm mb-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Visicooler Shops</h1>
                        <p className="text-gray-500 mt-1">Manage and export all registered shop data.</p>
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
                        <button
                            type="button"
                            onClick={handleDownloadEmptyForm}
                            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm w-full sm:w-auto text-sm"
                        >
                            <Download size={18} className="text-gray-500" />
                            Download Form
                        </button>
                        <Link
                            href="/visicooler/replacement"
                            className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
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
                <div className="relative mb-8 shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base transition-all shadow-sm"
                        placeholder="Search by name, area, pincode, or visicooler capacity..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Horizontal List View */}
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredShops.length > 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {/* List Header (Visible on large screens) */}
                        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 sm:p-5 bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-3">Shop Name</div>
                            <div className="col-span-2">Area</div>
                            <div className="col-span-2">Pincode</div>
                            <div className="col-span-2">Visicoolers</div>
                            <div className="col-span-1 text-center">Status</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {/* List Rows */}
                        <div className="divide-y divide-gray-100">
                            {filteredShops.map((shop) => (
                                <div
                                    key={shop._id}
                                    className="flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 p-4 sm:p-5 items-start lg:items-center hover:bg-gray-50/80 transition-colors"
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
                                    <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                                        <Hash size={16} className="text-gray-400 lg:hidden" />
                                        <span>{shop.outletDetails?.pincode}</span>
                                    </div>

                                    {/* Visicoolers */}
                                    <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                                        <Package size={16} className="text-gray-400 lg:hidden" />
                                        <span className="truncate" title={shop.businessDetails?.visicooler?.join(', ')}>
                                            {shop.businessDetails?.visicooler && shop.businessDetails.visicooler.length > 0
                                                ? shop.businessDetails.visicooler.join(', ')
                                                : <span className="text-gray-400 italic">None</span>}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-1 flex items-center justify-start lg:justify-center">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full shrink-0 ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {shop.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 flex items-center justify-start lg:justify-end gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                                        <Link
                                            href={`/visicooler/${shop._id}`}
                                            className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold shadow-sm w-full lg:w-auto"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleExport(shop)}
                                            className="flex-1 lg:flex-initial flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 text-blue-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold shadow-sm w-full lg:w-auto justify-center"
                                        >
                                            <Download size={16} />
                                            Export
                                        </button>
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
        </div>
    );
}

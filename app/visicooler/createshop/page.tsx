"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Download, AppWindowMacIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import GcoreUpload from "@/app/admin/_components/GcoreUpload";

function CreateShopForm() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const requestId = searchParams.get("requestId");

  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(!!editId || !!requestId);
  const [isAdmin, setIsAdmin] = useState(false);


  // Document attachments
  const [documents, setDocuments] = useState<Array<{ name: string; url: string }>>([]);
  // Previous three monthly data
  const [monthlyData, setMonthlyData] = useState<Array<{ name: string; url: string }>>([
    { name: "Month 1", url: "" },
    { name: "Month 2", url: "" },
    { name: "Month 3", url: "" },
  ]);

  const [formData, setFormData] = useState({
    // Outlet Details
    shopName: "",
    ownerName: "",
    date: new Date().toISOString().split("T")[0],
    gender: "Male",
    age: 18,
    address: "",
    pincode: "",
    area: "",
    mobileNumber: "",
    email: "",

    // Distributor Details
    distributorName: "",
    accountNumber: "",
    hubName: "",

    // Business Details
    outletType: "",
    visibility: "Main Road",
    competitors: true,
    nearbyAreaFootfall: "Medium",
    fridgeType: "280",
    visicooler: "",
    branding: [] as string[],

    // Other Details
    isActive: true,
    asm: "",
    se: "",
  });

  // Check if current session user is Superadmin
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

  // Fetch data if we are in Edit mode or Admin review mode
  useEffect(() => {
    if (editId) {
      const fetchShop = async () => {
        try {
          const res = await fetch(`/api/visicooler?id=${editId}`);
          const data = await res.json();
          if (data.success) {
            const shop = data.data;
            setFormData({
              shopName: shop.outletDetails?.shopName || "",
              ownerName: shop.outletDetails?.ownerName || "",
              date: shop.outletDetails?.date ? new Date(shop.outletDetails.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              gender: shop.outletDetails?.gender || "Male",
              age: shop.outletDetails?.age || 18,
              address: shop.outletDetails?.address || "",
              pincode: shop.outletDetails?.pincode?.toString() || "",
              area: shop.outletDetails?.area || "",
              mobileNumber: shop.outletDetails?.mobileNumber || "",
              email: shop.outletDetails?.email || "",
              distributorName: shop.distributorDetails?.distributorName || "",
              accountNumber: shop.distributorDetails?.accountNumber?.toString() || "",
              hubName: shop.distributorDetails?.hubName || "",

              outletType: shop.businessDetails?.outletType || "",
              visibility: shop.businessDetails?.visibility || "Main Road",
              competitors: shop.businessDetails?.competitors ?? true,
              nearbyAreaFootfall: shop.businessDetails?.nearbyAreaFootfall || "Medium",
              fridgeType: shop.businessDetails?.fridgeType || "280",
              visicooler: shop.businessDetails?.visicooler ? shop.businessDetails.visicooler.join(", ") : "",
              branding: shop.businessDetails?.branding || [],
              isActive: shop.isActive ?? true,
              asm: shop.asm || "",
              se: shop.se || "",
            });

            // Fetch documents
            setDocuments(shop.documentVerification?.documentAttached || []);
            // Fetch monthly data
            setMonthlyData(shop.documentVerification?.previousThreeMonthlydata || [
              { name: "Month 1", url: "" },
              { name: "Month 2", url: "" },
              { name: "Month 3", url: "" },
            ]);
          } else {
            toast.error("Shop not found");
            router.push("/visicooler");
          }
        } catch (error) {
          toast.error("Error loading shop data");
        } finally {
          setInitialFetchLoading(false);
        }
      };
      fetchShop();
    } else if (requestId) {
      const fetchRequest = async () => {
        try {
          const res = await fetch(`/api/visicooler/requests?id=${requestId}`);
          const data = await res.json();
          if (data.success) {
            const reqItem = data.data;
            const shop = reqItem.requestedData;
            setFormData({
              shopName: shop.outletDetails?.shopName || "",
              ownerName: shop.outletDetails?.ownerName || "",
              date: shop.outletDetails?.date ? new Date(shop.outletDetails.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
              gender: shop.outletDetails?.gender || "Male",
              age: shop.outletDetails?.age || 18,
              address: shop.outletDetails?.address || "",
              pincode: shop.outletDetails?.pincode?.toString() || "",
              area: shop.outletDetails?.area || "",
              mobileNumber: shop.outletDetails?.mobileNumber || "",
              email: shop.outletDetails?.email || "",
              distributorName: shop.distributorDetails?.distributorName || "",
              accountNumber: shop.distributorDetails?.accountNumber?.toString() || "",
              hubName: shop.distributorDetails?.hubName || "",

              outletType: shop.businessDetails?.outletType || "",
              visibility: shop.businessDetails?.visibility || "Main Road",
              competitors: shop.businessDetails?.competitors ?? true,
              nearbyAreaFootfall: shop.businessDetails?.nearbyAreaFootfall || "Medium",
              fridgeType: shop.businessDetails?.fridgeType || "280",
              visicooler: shop.businessDetails?.visicooler ? shop.businessDetails.visicooler.join(", ") : "",
              branding: shop.businessDetails?.branding || [],
              isActive: shop.isActive ?? true,
              asm: shop.asm || "",
              se: shop.se || "",
            });

            // Fetch documents
            setDocuments(shop.documentVerification?.documentAttached || []);
            // Fetch monthly data
            setMonthlyData(shop.documentVerification?.previousThreeMonthlydata || [
              { name: "Month 1", url: "" },
              { name: "Month 2", url: "" },
              { name: "Month 3", url: "" },
            ]);
          } else {
            toast.error("Request not found");
            router.push("/visicooler/requests");
          }
        } catch (error) {
          toast.error("Error loading request data");
        } finally {
          setInitialFetchLoading(false);
        }
      };
      fetchRequest();
    }
  }, [editId, requestId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBrandingCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const currentBranding = prev.branding || [];
      if (checked) {
        return { ...prev, branding: [...currentBranding, value] };
      } else {
        return { ...prev, branding: currentBranding.filter((item) => item !== value) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.shopName.trim()) {
      toast.error("Shop name is required");
      return;
    }
    if (!formData.pincode.trim()) {
      toast.error("Pincode is required");
      return;
    }
    if (!formData.area.trim()) {
      toast.error("Area is required");
      return;
    }
    if (!formData.mobileNumber.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    // If a create request, enforce that all 3 monthly data slots must have a name selected and a file uploaded
    if (!editId && !requestId) {
      for (let i = 0; i < 3; i++) {
        const m = monthlyData[i];
        if (!m || !m.url) {
          toast.error(`Please upload the data file for Month ${i + 1}`);
          return;
        }
        if (!m.name || m.name === `Month ${i + 1}` || m.name === `Month1`) {
          toast.error(`Please select the month name for Month ${i + 1}`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Process data to match schema
      const payload = {
        outletDetails: {
          shopName: formData.shopName,
          ownerName: formData.ownerName,
          date: formData.date,
          gender: formData.gender,
          age: Number(formData.age),
          address: formData.address,
          pincode: Number(formData.pincode),
          area: formData.area,
          mobileNumber: formData.mobileNumber,
          email: formData.email || undefined,
        },
        distributorDetails: {
          distributorName: formData.distributorName,
          accountNumber: Number(formData.accountNumber),
          hubName: formData.hubName,
        },
        businessDetails: {
          outletType: formData.outletType,
          visibility: formData.visibility,
          competitors: formData.competitors,
          nearbyAreaFootfall: formData.nearbyAreaFootfall,
          fridgeType: formData.fridgeType || undefined,
          visicooler: formData.visicooler
            ? formData.visicooler.split(",").map((s) => s.trim()).filter((s) => s !== "")
            : [],
          branding: formData.branding,
        },
        isActive: formData.isActive,
        asm: formData.asm,
        se: formData.se,
        documentVerification: {
          documentAttached: documents,
          previousThreeMonthlydata: monthlyData.filter((m) => m.url !== ""),
        },
      };

      if (requestId) {
        // Admin approving request
        const res = await fetch("/api/visicooler/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId,
            action: "approve",
            approvedData: payload
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("Request approved and database updated successfully!");
          router.push("/visicooler/requests");
        } else {
          toast.error(data.error?.message || data.message || "Failed to approve request");
        }
      } else {
        // Normal user submitting edit or creation request
        const url = editId ? `/api/visicooler?id=${editId}` : "/api/visicooler";
        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          toast.success(editId ? "Shop edit request submitted for admin approval!" : "Shop creation request submitted for admin approval!");
          router.push(editId ? `/visicooler/${editId}` : "/visicooler");
        } else {
          toast.error(data.error?.message || data.message || "Failed to submit request");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving the shop details.");
    } finally {
      setLoading(false);
    }
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
            <img src="${logoUrl}" alt="Cloud9 Logo" style="max-height: 45px; object-fit: contain;" />
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
            <div class="field">
              <span class="field-label">Age *</span>
              <div class="field-value-line"></div>
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

  if (initialFetchLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Link
        href={editId ? `/visicooler/${editId}` : "/visicooler"}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={18} />
        {editId ? "Back to Shop" : "Back to Shops"}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editId ? "Edit Shop Details" : "Create New Shop"}
            </h1>
            <p className="text-gray-500 mt-1">
              {editId ? "Update the details for this visicooler shop." : "Enter the details for the new visicooler shop below."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadEmptyForm}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-sm text-sm shrink-0"
          >
            <Download size={18} className="text-gray-500" />
            Download Empty Form
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Show Outlet Details Section (Full for Create, Partial/Main for Edit) */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-150 pb-2">
                1. Outlet Details
              </h3>
            </div>

            {/* Shop Name */}
            <div className="md:col-span-2">
              <label htmlFor="shopName" className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                required
                value={formData.shopName}
                onChange={handleChange}
                placeholder="e.g. Babulnath fruit shop"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-semibold text-gray-700 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                required
                min={18}
                max={70}
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 123 Main St"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Area */}
            <div>
              <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
                Area <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="area"
                name="area"
                required
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Dadar"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 400011"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. contact@shop.com (Optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Distributor Details Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-150 pb-2">
                2. Distributor Details
              </h3>
            </div>

            {/* Distributor Name */}
            <div>
              <label htmlFor="distributorName" className="block text-sm font-semibold text-gray-700 mb-2">
                Distributor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="distributorName"
                name="distributorName"
                required
                value={formData.distributorName}
                onChange={handleChange}
                placeholder="e.g. Coca-Cola Distributors"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Account Number */}
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Account Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="accountNumber"
                name="accountNumber"
                required
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 12345678"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Hub Name */}
            <div className="md:col-span-2">
              <label htmlFor="hubName" className="block text-sm font-semibold text-gray-700 mb-2">
                Hub Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="hubName"
                name="hubName"
                required
                value={formData.hubName}
                onChange={handleChange}
                placeholder="e.g. Central Mumbai Hub"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Business Details Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-150 pb-2">
                3. Business Details
              </h3>
            </div>

            {/* Outlet Type */}
            <div>
              <label htmlFor="outletType" className="block text-sm font-semibold text-gray-700 mb-2">
                Outlet Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="outletType"
                name="outletType"
                required
                value={formData.outletType}
                onChange={handleChange}
                placeholder="e.g. Kirana Shop, Supermarket"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Visibility */}
            <div>
              <label htmlFor="visibility" className="block text-sm font-semibold text-gray-700 mb-2">
                Visibility <span className="text-red-500">*</span>
              </label>
              <select
                id="visibility"
                name="visibility"
                required
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="Main Road">Main Road</option>
                <option value="Internal Road">Internal Road</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            {/* Nearby Area Footfall */}
            <div>
              <label htmlFor="nearbyAreaFootfall" className="block text-sm font-semibold text-gray-700 mb-2">
                Nearby Area Footfall <span className="text-red-500">*</span>
              </label>
              <select
                id="nearbyAreaFootfall"
                name="nearbyAreaFootfall"
                required
                value={formData.nearbyAreaFootfall}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Fridge Type */}
            <div>
              <label htmlFor="fridgeType" className="block text-sm font-semibold text-gray-700 mb-2">
                Fridge Type
              </label>
              <select
                id="fridgeType"
                name="fridgeType"
                value={formData.fridgeType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
              >
                <option value="255">255 ltr</option>
                <option value="280">280 ltr</option>
                <option value="360">360 ltr</option>
                <option value="450">450 ltr</option>
                <option value="mini">mini</option>
              </select>
            </div>

            {/* Branding */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Branding Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {["ED", "Water", "Other"].map((option) => (
                  <label key={option} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      name="branding"
                      value={option}
                      checked={formData.branding.includes(option)}
                      onChange={handleBrandingCheckboxChange}
                      className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Competitors Toggle */}
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="competitors"
                name="competitors"
                checked={formData.competitors}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="competitors" className="ml-3 text-sm font-semibold text-gray-700">
                Competitors Present
              </label>
            </div>

            {/* Shared/Common Visicooler and Admin Info */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-150 pb-2">
                4. Administrative & Visicooler Details
              </h3>
            </div>

            {/* ASM Name */}
            <div>
              <label htmlFor="asm" className="block text-sm font-semibold text-gray-700 mb-2">
                Area Sales Manager (ASM) Name
              </label>
              <input
                type="text"
                id="asm"
                name="asm"
                value={formData.asm}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar (Optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* SE Name */}
            <div>
              <label htmlFor="se" className="block text-sm font-semibold text-gray-700 mb-2">
                Sales Executive (SE) Name
              </label>
              <input
                type="text"
                id="se"
                name="se"
                value={formData.se}
                onChange={handleChange}
                placeholder="e.g. Suresh Patel (Optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>

            {/* Visicooler Sizes */}
            <div className="md:col-span-2">
              <label htmlFor="visicooler" className="block text-sm font-semibold text-gray-700 mb-2">
                Visicooler Sizes
              </label>
              <input
                type="text"
                id="visicooler"
                name="visicooler"
                value={formData.visicooler}
                onChange={handleChange}
                placeholder="e.g. 280 ltr, 360 ltr (Separate by commas)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <p className="text-xs text-gray-500 mt-2">Enter dimensions or sizes separated by commas.</p>
            </div>

            {/* Is Active Toggle */}
            <div className="md:col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-3 text-sm font-semibold text-gray-700">
                Shop is Active
              </label>
            </div>

            {/* Document Verification Section */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-150 pb-2">
                5. Document Verification
              </h3>
            </div>

            {/* Part 1: documentAttached */}
            <div className="md:col-span-2 space-y-4">
              <label className="block text-sm font-semibold text-gray-700">
                Required Verification Documents
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["aadhar", "PAN", "Electricity Bill", "Shop Agreement"].map((docName) => {
                  const attachedDoc = documents.find((d) => d.name === docName);
                  const isUploaded = !!attachedDoc?.url;

                  return (
                    <div key={docName} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col justify-between gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 uppercase">
                          {docName}
                        </span>
                        {isUploaded && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            Uploaded
                          </span>
                        )}
                      </div>

                      {isUploaded ? (
                        <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-gray-150">
                          <a
                            href={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + attachedDoc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-medium truncate max-w-[150px]"
                          >
                            View File
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setDocuments((prev) => prev.filter((d) => d.name !== docName));
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <GcoreUpload
                          folder="visicooler_docs"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onSuccess={(url) => {
                            setDocuments((prev) => [
                              ...prev.filter((d) => d.name !== docName),
                              { name: docName, url },
                            ]);
                            toast.success(`${docName} uploaded!`);
                          }}
                        >
                          {({ open, isLoading }) => (
                            <button
                              type="button"
                              onClick={open}
                              disabled={isLoading}
                              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                            >
                              {isLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-700"></div>
                              ) : (
                                <span>Upload File</span>
                              )}
                            </button>
                          )}
                        </GcoreUpload>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part 2: previousThreeMonthlydata */}
            <div className="md:col-span-2 space-y-4 pt-4 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700">
                Previous 3 Months Sales/Operating Data <span className="text-red-500">*</span>
              </label>

              <div className="space-y-4">
                {[0, 1, 2].map((idx) => {
                  const currentMonthData = monthlyData[idx] || { name: `Month ${idx + 1}`, url: "" };
                  const isUploaded = !!currentMonthData.url;

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50">
                      <div className="flex-1 flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400">Month {idx + 1}:</span>
                        <select
                          value={currentMonthData.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setMonthlyData((prev) => {
                              const copy = [...prev];
                              copy[idx] = { ...copy[idx], name: newName };
                              return copy;
                            });
                          }}
                          disabled={isUploaded}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500 font-semibold text-gray-700"
                        >
                          <option value={`Month ${idx + 1}`}>Select Month...</option>
                          {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                          ].map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        {isUploaded ? (
                          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-lg border border-gray-150 text-xs">
                            <span className="text-green-600 font-bold">✓ Uploaded</span>
                            <a
                              href={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + currentMonthData.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline font-semibold"
                            >
                              View
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setMonthlyData((prev) => {
                                  const copy = [...prev];
                                  copy[idx] = { ...copy[idx], url: "" };
                                  return copy;
                                });
                              }}
                              className="text-red-500 hover:text-red-700 font-bold"
                            >
                              Clear
                            </button>
                          </div>
                        ) : (
                          <GcoreUpload
                            folder="visicooler_monthly"
                            accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png"
                            onSuccess={(url) => {
                              // Automatically set default name if not selected yet
                              const finalName = currentMonthData.name === `Month ${idx + 1}` || currentMonthData.name === `Month1`
                                ? `Month ${idx + 1}`
                                : currentMonthData.name;

                              setMonthlyData((prev) => {
                                const copy = [...prev];
                                copy[idx] = { name: finalName, url };
                                return copy;
                              });
                              toast.success(`Month ${idx + 1} data uploaded!`);
                            }}
                          >
                            {({ open, isLoading }) => (
                              <button
                                type="button"
                                onClick={open}
                                disabled={isLoading}
                                className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                              >
                                {isLoading ? (
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-gray-700"></div>
                                ) : (
                                  <span>Upload Data</span>
                                )}
                              </button>
                            )}
                          </GcoreUpload>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save size={20} />
              )}
              {loading
                ? (requestId ? "Approving..." : "Saving...")
                : (requestId ? "Approve & Save Details" : (editId ? "Request Update" : "Request Create"))
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default function CreateShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:py-10 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Suspense boundary is required when using useSearchParams() in App Router */}
        <Suspense fallback={<div className="animate-spin mx-auto mt-20 h-10 w-10 border-b-2 border-blue-600"></div>}>
          <CreateShopForm />
        </Suspense>
      </div>
    </div>
  );
}

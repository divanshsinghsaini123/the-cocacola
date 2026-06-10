"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, MapPin, Hash, Package, Image as ImageIcon, Plus, Maximize, X, ShieldAlert, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import GcoreUpload from "@/app/admin/_components/GcoreUpload";
import { GetHomePageData } from "@/src/lib/strapi";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

interface ShopImage {
  _id?: string;
  url: string;
  uploadedAt: string;
}

interface DocumentItem {
  _id?: string;
  name: string;
  url: string;
}

interface Shop {
  _id: string;
  outletDetails?: {
    shopName: string;
    ownerName: string;
    date: string;
    gender: string;
    age: number;
    address: string;
    pincode: number;
    area: string;
    mobileNumber: string;
    email?: string;
  };
  distributorDetails?: {
    distributorName: string;
    accountNumber: number;
    hubName: string;
  };
  businessDetails?: {
    outletType: string;
    visibility: string;
    competitors: boolean;
    nearbyAreaFootfall: string;
    fridgeType?: string;
    visicooler: string[];
    branding: string | string[];
  };
  isActive: boolean;
  status?: string;
  images: ShopImage[];
  asm?: string;
  se?: string;
  documentVerification?: {
    documentAttached?: DocumentItem[];
    previousThreeMonthlydata?: DocumentItem[];
  };
}

export default function ShopViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Admin Verification Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"image" | "shop">("image");
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchShop = async () => {
    try {
      const res = await fetch(`/api/visicooler?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setShop(data.data);
      } else {
        toast.error("Shop not found");
        router.push("/visicooler");
      }
    } catch (error) {
      toast.error("Error fetching shop data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchShop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const data = await GetHomePageData();
        const navbarUrl = data?.NavbarImage?.url || data?.attributes?.NavbarImage?.url;
        if (navbarUrl) {
          setLogoUrl(getStrapiMediaUrl(navbarUrl));
        }
      } catch (err) {
        console.error("Failed to load logo:", err);
      }
    };
    fetchLogo();
  }, []);

  const downloadFile = (url: string, filename: string) => {
    return new Promise<void>((resolve) => {
      try {
        fetch(url)
          .then(res => res.blob())
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            resolve();
          })
          .catch(() => {
            // Fallback if fetch fails (CORS, etc.)
            const link = document.createElement('a');
            link.href = url;
            link.target = "_blank";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve();
          });
      } catch (e) {
        resolve();
      }
    });
  };

  const handlePrintForm = () => {
    if (!shop) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to download the form.");
      return;
    }

    const brandingString = Array.isArray(shop.businessDetails?.branding)
      ? shop.businessDetails.branding.join(", ")
      : (shop.businessDetails?.branding || "N/A");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shop Registration Details - ${shop.outletDetails?.shopName || 'Details'}</title>
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
          .field-value {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
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
            text-align: center;
            line-height: 10px;
            font-size: 9px;
            font-weight: bold;
          }
          .checkbox-box.checked {
            background-color: #e60000;
            border-color: #e60000;
            color: white;
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
            display: flex;
            align-items: flex-end;
            justify-content: center;
            font-size: 12px;
            color: #9ca3af;
            font-style: italic;
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
            <h1>Visicooler Shop Details</h1>
            <p>Outlet Enrollment Data & Verification Summary</p>
          </div>
          <div class="logo">
            ${logoUrl ? '<img src="' + logoUrl + '" alt="Cloud9 Logo" style="max-height: 45px; object-fit: contain;" />' : 'Cloud9'}
          </div>
        </div>

        <!-- Section 1: Outlet Details -->
        <div class="section">
          <div class="section-title">1. Outlet Details</div>
          <div class="grid">
            <div class="field grid-full">
              <span class="field-label">Shop Name</span>
              <div class="field-value">${shop.outletDetails?.shopName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Owner Name</span>
              <div class="field-value">${shop.outletDetails?.ownerName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Date Registered</span>
              <div class="field-value">${shop.outletDetails?.date ? new Date(shop.outletDetails.date).toLocaleDateString() : "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Gender</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Male' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Male' ? '✓' : ''}</span> Male
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Female' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Female' ? '✓' : ''}</span> Female
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Other' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Other' ? '✓' : ''}</span> Other
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Age</span>
              <div class="field-value">${shop.outletDetails?.age || "N/A"} years</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Address</span>
              <div class="field-value">${shop.outletDetails?.address || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Area</span>
              <div class="field-value">${shop.outletDetails?.area || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Pincode</span>
              <div class="field-value">${shop.outletDetails?.pincode || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Mobile Number</span>
              <div class="field-value">${shop.outletDetails?.mobileNumber || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Email Address</span>
              <div class="field-value">${shop.outletDetails?.email || "N/A"}</div>
            </div>
          </div>
        </div>

        <!-- Section 2: Distributor Details -->
        <div class="section">
          <div class="section-title">2. Distributor Details</div>
          <div class="grid">
            <div class="field">
              <span class="field-label">Distributor Name</span>
              <div class="field-value">${shop.distributorDetails?.distributorName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Account Number</span>
              <div class="field-value">${shop.distributorDetails?.accountNumber || "N/A"}</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Hub Name</span>
              <div class="field-value">${shop.distributorDetails?.hubName || "N/A"}</div>
            </div>
          </div>
        </div>

        <!-- Section 3: Business Details -->
        <div class="section">
          <div class="section-title">3. Business Details</div>
          <div class="grid">
            <div class="field">
              <span class="field-label">Outlet Type</span>
              <div class="field-value">${shop.businessDetails?.outletType || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Visibility</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Main Road' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Main Road' ? '✓' : ''}</span> Main Road
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Internal Road' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Internal Road' ? '✓' : ''}</span> Internal Road
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Premium' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Premium' ? '✓' : ''}</span> Premium
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Nearby Area Footfall</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'High' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'High' ? '✓' : ''}</span> High
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'Medium' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'Medium' ? '✓' : ''}</span> Medium
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'Low' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'Low' ? '✓' : ''}</span> Low
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Fridge Type</span>
              <div class="field-value">${shop.businessDetails?.fridgeType || 'N/A'} ltr</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Branding Type</span>
              <div class="field-value">${brandingString}</div>
            </div>
            <div class="field">
              <span class="field-label">Competitors Present</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.competitors === true ? 'checked' : ''}">${shop.businessDetails?.competitors === true ? '✓' : ''}</span> Yes
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.competitors === false ? 'checked' : ''}">${shop.businessDetails?.competitors === false ? '✓' : ''}</span> No
                </div>
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
              <div class="field-value">${shop.asm || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Sales Executive (SE) Name</span>
              <div class="field-value">${shop.se || "N/A"}</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Visicooler Sizes Registered</span>
              <div class="field-value">${shop.businessDetails?.visicooler && shop.businessDetails.visicooler.length > 0 ? shop.businessDetails.visicooler.join(', ') : "None"}</div>
            </div>
          </div>
        </div>

        <!-- Section 5: Verification Documents Attached Status -->
        <div class="section" style="page-break-inside: avoid;">
          <div class="section-title">5. Attached Verification Documents</div>
          <div class="checkbox-group" style="flex-direction: column; gap: 6px;">
            ${["aadhar", "PAN", "Electricity Bill", "Shop Agreement"].map((docName) => {
      const hasDoc = shop.documentVerification?.documentAttached?.some(d => d.name === docName);
      return `
                <div class="checkbox-item">
                  <span class="checkbox-box ${hasDoc ? 'checked' : ''}">${hasDoc ? '✓' : ''}</span> ${docName.toUpperCase()}
                  <span style="font-size: 10px; color: #6b7280; margin-left: 10px;">${hasDoc ? '(Attached & Verified)' : '(Missing)'}</span>
                </div>
              `;
    }).join('')}
          </div>
        </div>

        <!-- Signatures -->
        <div class="sign-area">
         
          <div class="sign-box">
            <div class="sign-line">Approved System-wide</div>
            <div class="sign-title">Sales Representative / ASM Signature</div>
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

  const handleDownloadAll = () => {
    if (!shop) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to download the form.");
      return;
    }

    const brandingString = Array.isArray(shop.businessDetails?.branding)
      ? shop.businessDetails.branding.join(", ")
      : (shop.businessDetails?.branding || "N/A");

    const cdnUrl = process.env.NEXT_PUBLIC_GCORE_CDN_URL || "";
    const docs = shop.documentVerification?.documentAttached || [];
    const monthly = shop.documentVerification?.previousThreeMonthlydata || [];
    const images = shop.images || [];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Combined Shop Record - ${shop.outletDetails?.shopName || 'Details'}</title>
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
            .attachment-page {
              page-break-before: always !important;
              break-before: page !important;
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
          .field-value {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            padding: 6px 0;
            border-bottom: 1px solid #e5e7eb;
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
            text-align: center;
            line-height: 10px;
            font-size: 9px;
            font-weight: bold;
          }
          .checkbox-box.checked {
            background-color: #e60000;
            border-color: #e60000;
            color: white;
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
            display: flex;
            align-items: flex-end;
            justify-content: center;
            font-size: 12px;
            color: #9ca3af;
            font-style: italic;
          }
          .sign-title {
            font-size: 11px;
            font-weight: 700;
            color: #4b5563;
          }
          .attachment-page {
            page-break-before: always;
            break-before: page;
            margin-top: 40px;
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: flex-start;
          }
          .attachment-header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 8px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .attachment-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .attachment-body {
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            max-height: 80vh;
            overflow: hidden;
          }
          .image-embed {
            max-width: 100%;
            max-height: 75vh;
            object-fit: contain;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
          }
          .pdf-embed {
            width: 100%;
            height: 75vh;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-area">
            <h1>Visicooler Shop Details</h1>
            <p>Outlet Enrollment Data & Verification Summary</p>
          </div>
          <div class="logo">
            ${logoUrl ? '<img src="' + logoUrl + '" alt="Cloud9 Logo" style="max-height: 45px; object-fit: contain;" />' : 'Cloud9'}
          </div>
        </div>

        <!-- Section 1: Outlet Details -->
        <div class="section">
          <div class="section-title">1. Outlet Details</div>
          <div class="grid">
            <div class="field grid-full">
              <span class="field-label">Shop Name</span>
              <div class="field-value">${shop.outletDetails?.shopName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Owner Name</span>
              <div class="field-value">${shop.outletDetails?.ownerName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Date Registered</span>
              <div class="field-value">${shop.outletDetails?.date ? new Date(shop.outletDetails.date).toLocaleDateString() : "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Gender</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Male' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Male' ? '✓' : ''}</span> Male
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Female' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Female' ? '✓' : ''}</span> Female
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.outletDetails?.gender === 'Other' ? 'checked' : ''}">${shop.outletDetails?.gender === 'Other' ? '✓' : ''}</span> Other
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Age</span>
              <div class="field-value">${shop.outletDetails?.age || "N/A"} years</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Address</span>
              <div class="field-value">${shop.outletDetails?.address || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Area</span>
              <div class="field-value">${shop.outletDetails?.area || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Pincode</span>
              <div class="field-value">${shop.outletDetails?.pincode || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Mobile Number</span>
              <div class="field-value">${shop.outletDetails?.mobileNumber || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Email Address</span>
              <div class="field-value">${shop.outletDetails?.email || "N/A"}</div>
            </div>
          </div>
        </div>

        <!-- Section 2: Distributor Details -->
        <div class="section">
          <div class="section-title">2. Distributor Details</div>
          <div class="grid">
            <div class="field">
              <span class="field-label">Distributor Name</span>
              <div class="field-value">${shop.distributorDetails?.distributorName || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Account Number</span>
              <div class="field-value">${shop.distributorDetails?.accountNumber || "N/A"}</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Hub Name</span>
              <div class="field-value">${shop.distributorDetails?.hubName || "N/A"}</div>
            </div>
          </div>
        </div>

        <!-- Section 3: Business Details -->
        <div class="section">
          <div class="section-title">3. Business Details</div>
          <div class="grid">
            <div class="field">
              <span class="field-label">Outlet Type</span>
              <div class="field-value">${shop.businessDetails?.outletType || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Visibility</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Main Road' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Main Road' ? '✓' : ''}</span> Main Road
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Internal Road' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Internal Road' ? '✓' : ''}</span> Internal Road
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.visibility === 'Premium' ? 'checked' : ''}">${shop.businessDetails?.visibility === 'Premium' ? '✓' : ''}</span> Premium
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Nearby Area Footfall</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'High' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'High' ? '✓' : ''}</span> High
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'Medium' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'Medium' ? '✓' : ''}</span> Medium
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.nearbyAreaFootfall === 'Low' ? 'checked' : ''}">${shop.businessDetails?.nearbyAreaFootfall === 'Low' ? '✓' : ''}</span> Low
                </div>
              </div>
            </div>
            <div class="field">
              <span class="field-label">Fridge Type</span>
              <div class="field-value">${shop.businessDetails?.fridgeType || 'N/A'} ltr</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Branding Type</span>
              <div class="field-value">${brandingString}</div>
            </div>
            <div class="field">
              <span class="field-label">Competitors Present</span>
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.competitors === true ? 'checked' : ''}">${shop.businessDetails?.competitors === true ? '✓' : ''}</span> Yes
                </div>
                <div class="checkbox-item">
                  <span class="checkbox-box ${shop.businessDetails?.competitors === false ? 'checked' : ''}">${shop.businessDetails?.competitors === false ? '✓' : ''}</span> No
                </div>
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
              <div class="field-value">${shop.asm || "N/A"}</div>
            </div>
            <div class="field">
              <span class="field-label">Sales Executive (SE) Name</span>
              <div class="field-value">${shop.se || "N/A"}</div>
            </div>
            <div class="field grid-full">
              <span class="field-label">Visicooler Sizes Registered</span>
              <div class="field-value">${shop.businessDetails?.visicooler && shop.businessDetails.visicooler.length > 0 ? shop.businessDetails.visicooler.join(', ') : "None"}</div>
            </div>
          </div>
        </div>

        <!-- Section 5: Verification Documents Attached Status -->
        <div class="section" style="page-break-inside: avoid;">
          <div class="section-title">5. Attached Verification Documents</div>
          <div class="checkbox-group" style="flex-direction: column; gap: 6px;">
            ${["aadhar", "PAN", "Electricity Bill", "Shop Agreement"].map((docName) => {
      const hasDoc = shop.documentVerification?.documentAttached?.some(d => d.name === docName);
      return `
                <div class="checkbox-item">
                  <span class="checkbox-box ${hasDoc ? 'checked' : ''}">${hasDoc ? '✓' : ''}</span> ${docName.toUpperCase()}
                  <span style="font-size: 10px; color: #6b7280; margin-left: 10px;">${hasDoc ? '(Attached & Verified)' : '(Missing)'}</span>
                </div>
              `;
    }).join('')}
          </div>
        </div>

        <!-- Signatures -->
        <div class="sign-area">
          <div class="sign-box">
            <div class="sign-line">Signed digitally</div>
            <div class="sign-title">Shop Owner Signature</div>
          </div>
          <div class="sign-box">
            <div class="sign-line">Approved System-wide</div>
            <div class="sign-title">Sales Representative / ASM Signature</div>
          </div>
        </div>

        <div class="footer">
          Cloud9 Commercial & Distribution Network &copy; ${new Date().getFullYear()} | Internal Business Document
        </div>

        <!-- Section 6: Attached Documents & Images -->
        ${docs.length > 0 || monthly.length > 0 || images.length > 0 ? `
          <div class="no-print" style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            Scroll down to see the attached documents and gallery images that will be printed/saved in this PDF.
          </div>
        ` : ''}

        ${docs.map((doc) => {
      if (!doc.url) return '';
      const fullUrl = cdnUrl + "/" + doc.url;
      const isPdf = doc.url.toLowerCase().endsWith('.pdf');
      return `
            <div class="attachment-page">
              <div class="attachment-header">
                <h3>Attachment: ${doc.name.toUpperCase()}</h3>
              </div>
              <div class="attachment-body">
                ${isPdf
          ? `<embed src="${fullUrl}" type="application/pdf" class="pdf-embed" />`
          : `<img src="${fullUrl}" alt="${doc.name}" class="image-embed" />`
        }
              </div>
            </div>
          `;
    }).join('')}

        ${monthly.map((month) => {
      if (!month.url) return '';
      const fullUrl = cdnUrl + "/" + month.url;
      const isPdf = month.url.toLowerCase().endsWith('.pdf');
      const isExcel = month.url.toLowerCase().endsWith('.xlsx') || month.url.toLowerCase().endsWith('.xls') || month.url.toLowerCase().endsWith('.csv');
      return `
            <div class="attachment-page">
              <div class="attachment-header">
                <h3>Monthly Sales Data: ${month.name}</h3>
              </div>
              <div class="attachment-body">
                ${isPdf
          ? `<embed src="${fullUrl}" type="application/pdf" class="pdf-embed" />`
          : isExcel
            ? `<div style="text-align: center; padding: 50px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; width: 100%;">
                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin-bottom: 15px; display: inline-block;"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
                         <p style="font-size: 16px; font-weight: 600; margin: 0 0 5px 0;">Spreadsheet Data Attached</p>
                         <p style="font-size: 13px; color: #6b7280; margin: 0;">File: ${month.url.split('/').pop()}</p>
                       </div>`
            : `<img src="${fullUrl}" alt="${month.name}" class="image-embed" />`
        }
              </div>
            </div>
          `;
    }).join('')}

        ${images.map((img, idx) => {
      if (!img.url) return '';
      const fullUrl = cdnUrl + "/" + img.url;
      return `
            <div class="attachment-page">
              <div class="attachment-header">
                <h3>Gallery Image ${idx + 1}</h3>
                <span style="font-size: 12px; color: #6b7280;">Uploaded: ${img.uploadedAt ? new Date(img.uploadedAt).toLocaleString() : 'N/A'}</span>
              </div>
              <div class="attachment-body">
                <img src="${fullUrl}" alt="Gallery Image ${idx + 1}" class="image-embed" />
              </div>
            </div>
          `;
    }).join('')}

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

  const handleImageUpload = async (url: string) => {
    try {
      const res = await fetch("/api/visicooler", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "add_image", url }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Image uploaded successfully");
        fetchShop(); // Refresh data to get the new image with timestamp
      } else {
        toast.error("Failed to save image to database");
      }
    } catch (error) {
      toast.error("Error saving image");
    }
  };

  const openDeleteImageModal = (url: string) => {
    setImageToDelete(url);
    setDeleteType("image");
    setAdminUsername("");
    setAdminPassword("");
    setAuthError(null);
    setDeleteModalOpen(true);
  };

  const openDeleteShopModal = () => {
    setDeleteType("shop");
    setAdminUsername("");
    setAdminPassword("");
    setAuthError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setImageToDelete(null);
    setAdminUsername("");
    setAdminPassword("");
    setAuthError(null);
  };

  const handleVerifyAndDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteType === "image" && !imageToDelete) return;

    setVerifying(true);
    setAuthError(null);

    try {
      // 1. Verify Admin Credentials
      const verifyRes = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      let verifyData;
      try {
        verifyData = await verifyRes.json();
      } catch (err) {
        setAuthError("Server error: API returned invalid response. Did you restart the server?");
        setVerifying(false);
        return;
      }

      if (!verifyData.success) {
        setAuthError(verifyData.error || "Please enter the correct username or password.");
        setVerifying(false);
        return;
      }

      // 2. If verified, proceed with deletion
      if (deleteType === "image") {
        const res = await fetch("/api/visicooler", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, action: "delete_image", url: imageToDelete }),
        });
        const data = await res.json();

        if (data.success) {
          toast.success("Image deleted successfully");
          closeDeleteModal();
          fetchShop();
        } else {
          setAuthError("Failed to delete image");
        }
      } else if (deleteType === "shop") {
        const res = await fetch(`/api/visicooler?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          toast.success("Shop deleted successfully");
          closeDeleteModal();
          router.push("/visicooler");
        } else {
          setAuthError("Failed to delete shop");
        }
      }
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during deletion");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 -blue-600"></div>
      </div>
    );
  }

  if (!shop) return null;

  // Sort images newest first
  const sortedImages = [...(shop.images || [])].sort((a, b) => {
    return new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-4 sm:py-10 sm:px-6">

      {/* Delete Verification Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-red-600 font-bold">
                <ShieldAlert size={20} />
                <h3>Admin Verification Required</h3>
              </div>
              <button onClick={closeDeleteModal} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleVerifyAndDelete} className="p-6">
              <p className="text-sm text-gray-600 mb-6">
                {deleteType === "shop"
                  ? "Deleting this entire shop requires administrator privileges. Please enter an active admin's credentials to confirm deletion. This action cannot be undone."
                  : "Deleting images requires administrator privileges. Please enter an active admin's credentials to confirm deletion."}
              </p>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  {authError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Username</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => { setAdminUsername(e.target.value); setAuthError(null); }}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${authError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => { setAdminPassword(e.target.value); setAuthError(null); }}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${authError
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {verifying ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Verify & Delete"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <Link
            href="/visicooler"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to Shops
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200 shadow-sm"
            >
              <Download size={16} className="text-gray-500" />
              Download Form + Files
            </button>
            <Link
              href={`/visicooler/createshop?edit=${shop._id}`}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200"
            >
              Edit Details
            </Link>
            <button
              onClick={openDeleteShopModal}
              className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors border border-red-100"
            >
              <Trash2 size={16} />
              Delete Shop
            </button>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {shop.outletDetails?.shopName || "Shop Details"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {shop.isActive ? "Active" : "Inactive"}
                </span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${shop.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  shop.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                  {shop.status ? shop.status.toUpperCase() : "PENDING"}
                </span>
                <span className="text-gray-500 text-sm font-mono">ID: {shop._id}</span>
              </div>
            </div>

            <GcoreUpload folder="visicooler" onSuccess={handleImageUpload} multiple={true}>
              {({ open, isLoading }) => (
                <button
                  onClick={open}
                  disabled={isLoading}
                  className="flex items-center justify-center w-full md:w-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Plus size={20} />
                  )}
                  {isLoading ? "Uploading..." : "Upload New Image"}
                </button>
              )}
            </GcoreUpload>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Area</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.outletDetails?.area || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pincode</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.outletDetails?.pincode || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mobile</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.outletDetails?.mobileNumber || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-lg font-medium text-gray-900 mt-1 truncate" title={shop.outletDetails?.email}>{shop.outletDetails?.email || <span className="text-gray-400 italic">N/A</span>}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Visicoolers</p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {shop.businessDetails?.visicooler && shop.businessDetails.visicooler.length > 0
                    ? shop.businessDetails.visicooler.join(', ')
                    : <span className="text-gray-400 italic">None registered</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        {shop.outletDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner & Outlet Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-900">Outlet & Owner Details</h3>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner Name:</span>
                  <span className="font-semibold text-gray-900">{shop.outletDetails.ownerName || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender:</span>
                  <span className="font-semibold text-gray-900">{shop.outletDetails.gender || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Age:</span>
                  <span className="font-semibold text-gray-900">{shop.outletDetails.age ? `${shop.outletDetails.age} years` : "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registration Date:</span>
                  <span className="font-semibold text-gray-900">
                    {shop.outletDetails.date ? new Date(shop.outletDetails.date).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-semibold text-gray-900 text-right max-w-[200px] truncate" title={shop.outletDetails.address}>
                    {shop.outletDetails.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Distributor Details */}
            {shop.distributorDetails && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Distributor Details</h3>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Distributor Name:</span>
                    <span className="font-semibold text-gray-900">{shop.distributorDetails.distributorName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-semibold text-gray-900">{shop.distributorDetails.accountNumber || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Hub Name:</span>
                    <span className="font-semibold text-gray-900">{shop.distributorDetails.hubName || "N/A"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Business Details */}
            {shop.businessDetails && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">Business Details</h3>
                </div>
                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Outlet Type:</span>
                    <span className="font-semibold text-gray-900">{shop.businessDetails.outletType || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Visibility:</span>
                    <span className="font-semibold text-gray-900">{shop.businessDetails.visibility || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nearby Area Footfall:</span>
                    <span className="font-semibold text-gray-900">{shop.businessDetails.nearbyAreaFootfall || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Fridge Type:</span>
                    <span className="font-semibold text-gray-900">{shop.businessDetails.fridgeType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Branding Type:</span>
                    <span className="font-semibold text-gray-900">
                      {Array.isArray(shop.businessDetails.branding)
                        ? shop.businessDetails.branding.join(", ")
                        : (shop.businessDetails.branding || "N/A")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Competitors Present:</span>
                    <span className="font-semibold text-gray-900">{shop.businessDetails.competitors ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Document Verification Section */}
        {shop.documentVerification && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
                <h2 className="text-xl font-bold text-gray-900">Document Verification</h2>
              </div>
            </div>

            <div className="p-5 sm:p-8 bg-gray-50/30 space-y-8">
              {/* Part 1: Attached Documents */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Verification Documents</h3>
                {!shop.documentVerification.documentAttached || shop.documentVerification.documentAttached.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No verification documents attached.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {shop.documentVerification.documentAttached.map((doc, idx) => {
                      const isPdf = doc.url.toLowerCase().endsWith('.pdf');
                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${isPdf ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                              {isPdf ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M9 15v2" /><path d="M12 13v4" /><path d="M15 11v6" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Document Type</p>
                              <h4 className="text-sm font-semibold text-gray-900 mt-0.5 capitalize truncate" title={doc.name}>{doc.name}</h4>
                            </div>
                          </div>
                          <a
                            href={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg text-xs transition-colors border border-gray-200 flex items-center justify-center gap-1.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View Document
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Part 2: Monthly Data */}
              <div className="pt-6 border-t border-gray-150">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Previous 3 Months Data</h3>
                {!shop.documentVerification.previousThreeMonthlydata || shop.documentVerification.previousThreeMonthlydata.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No monthly sales data uploaded.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {shop.documentVerification.previousThreeMonthlydata.map((month, idx) => {
                      const isExcel = month.url.toLowerCase().endsWith('.xlsx') || month.url.toLowerCase().endsWith('.xls') || month.url.toLowerCase().endsWith('.csv');
                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${isExcel ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                              {isExcel ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /></svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Report Month</p>
                              <h4 className="text-sm font-semibold text-gray-900 mt-0.5 truncate" title={month.name || `Month ${idx + 1}`}>{month.name || `Month ${idx + 1}`}</h4>
                            </div>
                          </div>
                          <a
                            href={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + month.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg text-xs transition-colors border border-gray-200 flex items-center justify-center gap-1.5"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            View/Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Images Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-gray-500" size={22} />
              <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
            </div>
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {sortedImages.length} {sortedImages.length === 1 ? 'Image' : 'Images'}
            </span>
          </div>

          <div className="p-5 sm:p-8 bg-gray-50/30">
            {sortedImages.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No images yet</h3>
                <p className="text-gray-500 mt-1 mb-6">This shop doesn't have any gallery pictures.</p>
                <GcoreUpload folder="visicooler" onSuccess={handleImageUpload} multiple={true}>
                  {({ open, isLoading }) => (
                    <button
                      onClick={open}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                      ) : (
                        <Plus size={18} />
                      )}
                      {isLoading ? "Uploading..." : "Upload First Image"}
                    </button>
                  )}
                </GcoreUpload>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedImages.map((img, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white aspect-[4/3]">
                    <img
                      src={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + img.url}
                      alt={`Shop view ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 sm:bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4">
                      <div className="self-end flex gap-2">
                        {/* View Full Screen Button */}
                        <a
                          href={process.env.NEXT_PUBLIC_GCORE_CDN_URL + "/" + img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white hover:bg-gray-100 text-gray-800 p-2.5 rounded-lg shadow-sm transition-colors"
                          title="View full screen"
                        >
                          <Maximize size={18} />
                        </a>

                        {/* Delete Button (Opens Admin Modal) */}
                        <button
                          onClick={() => openDeleteImageModal(img.url)}
                          className="bg-white hover:bg-red-50 text-red-600 p-2.5 rounded-lg shadow-sm transition-colors"
                          title="Delete image (Requires Admin)"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="bg-white/95 px-4 py-2 rounded-lg self-start shadow-sm border border-white/20">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Uploaded</p>
                        <p className="text-sm font-bold text-gray-900">
                          {img.uploadedAt
                            ? new Date(img.uploadedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

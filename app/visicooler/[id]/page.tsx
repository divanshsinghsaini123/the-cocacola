"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, MapPin, Hash, Package, Image as ImageIcon, Plus, Maximize, X, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import GcoreUpload from "@/app/admin/_components/GcoreUpload";

interface ShopImage {
  _id?: string;
  url: string;
  uploadedAt: string;
}

interface Shop {
  _id: string;
  name: string;
  pincode: number;
  area: string;
  mobileNumber: string;
  email?: string;
  visicooler: string[];
  isActive: boolean;
  images: ShopImage[];
}

export default function ShopViewPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  // Admin Verification Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  const openDeleteModal = (url: string) => {
    setImageToDelete(url);
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
    if (!imageToDelete) return;
    
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
    } catch (error: any) {
      setAuthError(error.message || "An error occurred during deletion");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
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
                Deleting images requires administrator privileges. Please enter an active admin's credentials to confirm deletion.
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
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                      authError 
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
                    className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 outline-none transition-all ${
                      authError 
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
          <Link
            href={`/visicooler/createshop?edit=${shop._id}`}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-200"
          >
            Edit Details
          </Link>
        </div>

        {/* Shop Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{shop.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${shop.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {shop.isActive ? "Active" : "Inactive"}
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
          
          <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Area</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.area}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Hash className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pincode</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.pincode}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Mobile</p>
                <p className="text-lg font-medium text-gray-900 mt-1">{shop.mobileNumber}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-500 mt-1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-lg font-medium text-gray-900 mt-1 truncate" title={shop.email}>{shop.email || <span className="text-gray-400 italic">N/A</span>}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Package className="text-blue-500 mt-1" size={24} />
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Visicoolers</p>
                <p className="text-lg font-medium text-gray-900 mt-1">
                  {shop.visicooler && shop.visicooler.length > 0 
                    ? shop.visicooler.join(', ') 
                    : <span className="text-gray-400 italic">None registered</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

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
                          onClick={() => openDeleteModal(img.url)}
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

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

function CreateShopForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [loading, setLoading] = useState(false);
  const [initialFetchLoading, setInitialFetchLoading] = useState(!!editId);

  // OTP administrative security authorization states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    pincode: "",
    area: "",
    mobileNumber: "",
    email: "",
    visicooler: "",
    isActive: true,
    asm: "",
    se: "",
  });

  // Fetch data if we are in Edit mode
  useEffect(() => {
    if (editId) {
      const fetchShop = async () => {
        try {
          const res = await fetch(`/api/visicooler?id=${editId}`);
          const data = await res.json();
          if (data.success) {
            const shop = data.data;
            setFormData({
              name: shop.name || "",
              pincode: shop.pincode?.toString() || "",
              area: shop.area || "",
              mobileNumber: shop.mobileNumber || "",
              email: shop.email || "",
              visicooler: shop.visicooler ? shop.visicooler.join(", ") : "",
              isActive: shop.isActive ?? true,
              asm: shop.asm || "",
              se: shop.se || "",
            });
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
    }
  }, [editId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation before dispatching verification code
    if (!formData.name.trim()) {
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

    setLoading(true);

    try {
      // 1. Dispatch dynamic OTP to all designated admin emails with full shop details payload
      const res = await fetch("/api/visicooler/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: editId ? "UPDATE" : "CREATE",
          name: formData.name,
          pincode: Number(formData.pincode),
          area: formData.area,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          visicooler: formData.visicooler,
          asm: formData.asm,
          se: formData.se,
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMaskedEmail(data.email || "");
        toast.success("Transaction authorization code dispatched!");
        setShowOtpModal(true);
      } else {
        toast.error(data.error || "Failed to dispatch verification code");
      }
    } catch (error) {
      toast.error("Could not connect to the transaction authorization server.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }

    setOtpLoading(true);

    try {
      // Process data to match schema
      const payload = {
        otp: otpCode.trim(), // include authorization code
        name: formData.name,
        pincode: Number(formData.pincode),
        area: formData.area,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        visicooler: formData.visicooler
          ? formData.visicooler.split(",").map((s) => s.trim()).filter((s) => s !== "")
          : [],
        isActive: formData.isActive,
        asm: formData.asm,
        se: formData.se,
      };

      const url = editId ? `/api/visicooler?id=${editId}` : "/api/visicooler";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editId ? "Shop updated successfully!" : "Shop created successfully!");
        setShowOtpModal(false);
        setOtpCode("");
        // If we edited, take them back to the shop view, otherwise list
        router.push(editId ? `/visicooler/${editId}` : "/visicooler");
      } else {
        toast.error(data.error?.message || data.message || "Failed to save shop");
      }
    } catch (error) {
      toast.error("An error occurred while saving the shop.");
    } finally {
      setOtpLoading(false);
    }
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
        <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-900">
            {editId ? "Edit Shop Details" : "Create New Shop"}
          </h1>
          <p className="text-gray-500 mt-1">
            {editId ? "Update the details for this visicooler shop." : "Enter the details for the new visicooler shop below."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Shop Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Babulnath fruit shop"
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
              {loading ? "Saving..." : (editId ? "Request Update" : "Request Create")}
            </button>
          </div>
        </form>
      </div>

      {/* OTP administrative security authorization overlay modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 max-w-[420px] w-full text-center relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtpCode("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors font-semibold text-lg"
            >
              ✕
            </button>
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Authorize CMS Transaction</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Please enter the 6-digit OTP code sent to: <br />
              <span className="font-bold text-gray-800">{maskedEmail}</span>
            </p>

            <form onSubmit={handleVerifyAndSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full p-4 border border-gray-200 rounded-xl text-2xl font-bold text-center tracking-[8px] outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setOtpCode("");
                  }}
                  className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpLoading}
                  className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {otpLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : "Verify & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

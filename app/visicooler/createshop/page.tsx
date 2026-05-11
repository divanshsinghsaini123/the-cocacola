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

  const [formData, setFormData] = useState({
    name: "",
    pincode: "",
    area: "",
    mobileNumber: "",
    email: "",
    visicooler: "", 
    isActive: true,
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
    setLoading(true);

    try {
      // Process data to match schema
      const payload = {
        name: formData.name,
        pincode: Number(formData.pincode),
        area: formData.area,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        visicooler: formData.visicooler
          ? formData.visicooler.split(",").map((s) => s.trim()).filter((s) => s !== "")
          : [],
        isActive: formData.isActive,
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
        // If we edited, take them back to the shop view, otherwise list
        router.push(editId ? `/visicooler/${editId}` : "/visicooler");
      } else {
        toast.error(data.error?.message || data.message || "Failed to save shop");
      }
    } catch (error) {
      toast.error("An error occurred while saving the shop.");
    } finally {
      setLoading(false);
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
              {loading ? "Saving..." : (editId ? "Update Shop" : "Save Shop")}
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

"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Download, Plus, MapPin, Hash, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Shop {
  _id: string;
  name: string;
  pincode: number;
  area: string;
  visicooler: string[];
  isActive: boolean;
}

export default function VisicoolerPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
    const visicoolerString = shop.visicooler?.join(", ").toLowerCase() || "";
    
    return (
      shop.name.toLowerCase().includes(query) ||
      shop.pincode.toString().includes(query) ||
      shop.area.toLowerCase().includes(query) ||
      visicoolerString.includes(query)
    );
  });

  const handleExport = (shop: Shop) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shop, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${shop.name.replace(/\s+/g, '_')}_data.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success(`${shop.name} data exported!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Visicooler Shops</h1>
            <p className="text-gray-500 mt-1">Manage and export all registered shop data.</p>
          </div>
          <Link 
            href="/visicooler/createshop" 
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            Add New Shop
          </Link>
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
            <div className="hidden lg:grid grid-cols-12 gap-4 p-5 bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-500 uppercase tracking-wider">
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
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-4 p-5 items-start lg:items-center hover:bg-gray-50/80 transition-colors"
                >
                  {/* Shop Name */}
                  <div className="col-span-3 flex items-center gap-3 w-full">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-700 font-bold text-lg">
                        {shop.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 truncate max-w-[200px]" title={shop.name}>
                        {shop.name}
                      </h2>
                    </div>
                  </div>
                  
                  {/* Area */}
                  <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin size={16} className="text-gray-400 lg:hidden" />
                    <span className="truncate" title={shop.area}>{shop.area}</span>
                  </div>

                  {/* Pincode */}
                  <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                    <Hash size={16} className="text-gray-400 lg:hidden" />
                    <span>{shop.pincode}</span>
                  </div>

                  {/* Visicoolers */}
                  <div className="col-span-2 flex items-center gap-2 text-gray-600 text-sm">
                    <Package size={16} className="text-gray-400 lg:hidden" />
                    <span className="truncate" title={shop.visicooler?.join(', ')}>
                      {shop.visicooler && shop.visicooler.length > 0 
                        ? shop.visicooler.join(', ') 
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
                      className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold shadow-sm"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <button 
                      onClick={() => handleExport(shop)}
                      className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-blue-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-sm font-semibold shadow-sm"
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

"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  RefreshCw,
  Wrench,
  Camera,
  FileText,
  Laptop,
  ArrowLeft,
  Shield,
  CheckCircle2,
  AlertCircle,
  Download
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ViewState = "menu" | "request" | "replace";

export default function VisicoolerPortalDashboard() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("menu");
  const [sessionUser, setSessionUser] = useState<{ name: string; role: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem("visicooler_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setSessionUser(session);
        if (session.role === "Superadmin") {
          setIsAdmin(true);
          router.push("/visicooler/shops");
        }
      } catch (e) {
        console.error("Failed to parse session", e);
      }
    }
  }, []);

  const handleRepairClick = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-4 sm:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">

        {/* Greeting Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[180px] h-[180px] bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Welcome to Visicooler Portal
            </h1>
            <p className="text-red-100 mt-1 text-xs sm:text-sm font-medium">
              Select a task below to get started.
            </p>
          </div>
        </div>

        {/* Toast-style Alert for Repair Action */}
        {showAlert && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 flex items-center gap-3 shadow-md animate-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Repair Request Portal Coming Soon</h3>
              <p className="text-xs sm:text-sm text-amber-700 mt-0.5">
                We are working on this feature. Please contact customer support directly to report hardware issues for now.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- MAIN DASHBOARD SCREEN ---------------- */}
        {view === "menu" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

            {/* Button 1: Request New Cooler */}
            <button
              type="button"
              onClick={() => setView("request")}
              className="bg-white border border-gray-200 hover:border-red-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <PlusCircle size={32} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  Request New Cooler
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Submit details to register and request a brand new cooler installation for an outlet.
                </p>
              </div>
            </button>

            {/* Button 2: Replace Cooler */}
            <button
              type="button"
              onClick={() => setView("replace")}
              className="bg-white border border-gray-200 hover:border-red-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <RefreshCw size={30} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  Replace Cooler
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Replace an existing broken or old cooler with a fresh, updated unit.
                </p>
              </div>
            </button>

            {/* Button 3: Repair Cooler */}
            <button
              type="button"
              onClick={handleRepairClick}
              className="bg-white border border-gray-200 hover:border-red-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Wrench size={30} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors flex items-center gap-2">
                  Repair Cooler
                  <span className="text-[10px] bg-red-50 border border-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full shrink-0">
                    Soon
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Report cooler issues and schedule hardware repairs or support visits.
                </p>
              </div>
            </button>

            {/* Button 4: Attach Photos / Edit details */}
            <Link
              href="/visicooler/shops"
              className="bg-white border border-gray-200 hover:border-red-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Camera size={30} />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  Attach Photos & Details
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  View shop lists, edit registration details, or upload verification documents and photos.
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* ---------------- SUB VIEW: REQUEST NEW COOLER ---------------- */}
        {view === "request" && (
          <div className="space-y-5 sm:space-y-6 animate-in slide-in-from-right-8 duration-300">
            {/* Back navigation */}
            <div>
              <button
                type="button"
                onClick={() => setView("menu")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Main Menu
              </button>
            </div>

            {/* Instruction Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Request New Cooler</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                You can choose to download the physical application form to print, or fill out the digital registration form online.
              </p>
            </div>

            {/* Option grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* Download PDF */}
              <a
                href="/Visi Cooler Request Form.pdf"
                download="Visi Cooler Request Form.pdf"
                className="bg-white border border-gray-200 hover:border-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Download Form PDF
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                    Save the physical application form on your mobile/PC to print and fill by hand.
                  </p>
                </div>
              </a>

              {/* Fill online */}
              <Link
                href="/visicooler/createshop"
                className="bg-white border border-gray-200 hover:border-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Laptop size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Fill Form Online
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                    Open our simplified online portal to fill in details and upload docs directly.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ---------------- SUB VIEW: REPLACE COOLER ---------------- */}
        {view === "replace" && (
          <div className="space-y-5 sm:space-y-6 animate-in slide-in-from-right-8 duration-300">
            {/* Back navigation */}
            <div>
              <button
                type="button"
                onClick={() => setView("menu")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Main Menu
              </button>
            </div>

            {/* Instruction Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Replace Existing Cooler</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                You can choose to download the physical replacement request form to print, or fill out the replacement request online.
              </p>
            </div>

            {/* Option grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

              {/* Download PDF */}
              <a
                href="/Visi Cooler Replacement Form.pdf"
                download="Visi Cooler Replacement Form.pdf"
                className="bg-white border border-gray-200 hover:border-amber-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Download Form PDF
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                    Save the physical cooler replacement form to print and fill manually.
                  </p>
                </div>
              </a>

              {/* Fill online */}
              <Link
                href="/visicooler/replacement"
                className="bg-white border border-gray-200 hover:border-amber-500 rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Laptop size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                    Fill Form Online
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                    Submit an online replacement request with automatic shop information fetching.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

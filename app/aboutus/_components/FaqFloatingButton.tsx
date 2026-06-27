import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function FaqFloatingButton() {
    return (
        <div className="fixed bottom-8 right-8 z-50 group">
            {/* Outer pulsing shadow/glow for high visibility */}
            <div className="absolute inset-0 bg-[#F40009] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"></div>

            <Link
                href="/aboutus/faq"
                className="relative flex items-center justify-center w-14 h-14 bg-[#F40009] hover:bg-[#d60008] text-white rounded-full shadow-[0_10px_30px_rgba(244,0,9,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20 focus:outline-none"
                aria-label="Frequently Asked Questions"
            >
                {/* FAQ Help Icon that rotates 360 degrees on hover */}
                <HelpCircle className="w-7 h-7 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]" />
            </Link>

            {/* Tooltip description */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <div className="bg-black/90 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-white/10 flex items-center gap-1.5">
                    <span>View FAQs</span>
                    <span className="text-white/60">→</span>
                </div>
            </div>
        </div>
    );
}

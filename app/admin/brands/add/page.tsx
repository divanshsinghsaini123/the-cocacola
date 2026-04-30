import Link from "next/link";
import BrandForm from "../../_components/BrandForm";

export default function AddBrandPage() {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <Link
                    href="/admin/brands"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Brands
                </Link>
            </div>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Add New Brand</h1>
                <BrandForm />
            </div>
        </div>
    );
}

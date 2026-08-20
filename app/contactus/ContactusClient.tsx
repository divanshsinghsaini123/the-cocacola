"use client";

import Link from "next/link";
import {
    MessageSquare,
    Building2,
    Factory,
    Sparkles,
    FileSearch,
    HelpCircle,
    ArrowRight,
    Mail,
    Phone
} from "lucide-react";
import { SITE_CONFIG } from "@/src/config/site";

interface ContactData {
    Contact_email: string;
    Contact_number: string;
    Terms_of_use?: any;
    Privacy_policy_page?: any;
    PageButton?: { BackgroundHexColor?: string; FontHexColor?: string };
}

interface ContactusProps {
    data: ContactData;
}

export default function ContactusClient({ data }: ContactusProps) {
    const email = data?.Contact_email || "support@coke.com";
    const mobile = data?.Contact_number || "+91 1800-XXX-XXXX";

    const contactOptions = [
        {
            title: "General Inquiry & Feedback",
            description: "Have a general question, sponsorship request, or an issue with a drink you purchased?",
            icon: MessageSquare,
            href: "/general_inquiry",
            badge: "Customer Support",
            color: "bg-red-50 text-red-600 border-red-100",
        },
        {
            title: "Become a Distributor",
            description: "Partner with us to distribute our world-class beverage portfolio in your area.",
            icon: Building2,
            href: "/become-our-distributor#contact-form",
            badge: "Business Partnership",
            color: "bg-blue-50 text-blue-600 border-blue-100",
        },
        {
            title: "Co-Filling Services",
            description: "Inquire about our state-of-the-art contract manufacturing and co-filling bottling facilities.",
            icon: Factory,
            href: "/cofilling#contact",
            badge: "Manufacturing",
            color: "bg-amber-50 text-amber-600 border-amber-100",
        },
        {
            title: "Co-Branding Opportunities",
            description: "Collaborate on custom branding, joint promotions, and brand partnership programs.",
            icon: Sparkles,
            href: "/cobranding",
            badge: "Collaboration",
            color: "bg-purple-50 text-purple-600 border-purple-100",
        },
        {
            title: "Track Inquiry Status",
            description: "Already submitted a form? Check the real-time status of your request or application.",
            icon: FileSearch,
            href: "/statuscheck",
            badge: "Track Request",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        },
        {
            title: "Frequently Asked Questions",
            description: "Find instant answers to common queries about our brands, products, and policies.",
            icon: HelpCircle,
            href: "/aboutus/faq",
            badge: "Help Center",
            color: "bg-gray-100 text-gray-700 border-gray-200",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-slate-900">
            <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">

                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto mb-14">
                    <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100 rounded-full">
                        Contact Hub
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                        How Can We Help You Today?
                    </h1>
                    <p className="text-base md:text-xl text-slate-600 leading-relaxed">
                        Select the category that best matches your request below to get redirected to the right team.
                    </p>
                </div>

                {/* Interactive Contact Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {contactOptions.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <Link
                                key={index}
                                href={option.href}
                                className="group relative flex flex-col justify-between p-6 md:p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >
                                {/* Subtle Card Background Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0 opacity-60 group-hover:scale-110 transition-transform duration-500" />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className={`p-3.5 rounded-xl border ${option.color} transition-transform group-hover:scale-110 duration-300`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                                            {option.badge}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                                        {option.title}
                                    </h3>

                                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                        {option.description}
                                    </p>
                                </div>

                                <div className="relative z-10 flex items-center text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors pt-4 border-t border-slate-100">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Direct Contact Footer Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Need Immediate Assistance?</h2>
                        <p className="text-slate-600 text-sm md:text-base">
                            Feel free to reach out directly to our consumer support hotline or send us an email.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {email && (
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all hover:bg-slate-100 group"
                            >
                                <div className="p-3 bg-red-100 text-red-600 rounded-lg mr-4 group-hover:scale-105 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email Us</div>
                                    <div className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">{email}</div>
                                </div>
                            </a>
                        )}

                        {mobile && (
                            <div className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Consumer Helpline</div>
                                    <div className="text-sm font-bold text-slate-900">{mobile}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
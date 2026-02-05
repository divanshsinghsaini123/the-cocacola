"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const ChevronDown = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-270" : "rotate-90"}`}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

import { usePathname } from "next/navigation";

interface LinkItem {
    id: number;
    name: string;
    url: string;
}

interface FooterSection {
    id: number;
    LinkSectionName: string;
    links: LinkItem[];
}

interface FooterData {
    id: number;
    Section1: FooterSection;
    Section2: FooterSection;
    Section3: FooterSection;
    FooterImage: {
        url: string;
    };
}

interface SocialLink {
    id: number;
    name: string;
    url: string;
}

interface SocialLinks {
    id: number;
    Instagram: SocialLink;
    Youtube: SocialLink;
    X: SocialLink;
    Facebook: SocialLink;
}

interface FooterProps {
    footerData?: FooterData;
    socialLinks?: SocialLinks;
}

export default function Footer(props: FooterProps) {
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const isLocal = STRAPI_BASE_URL.includes("localhost");
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    if (pathname?.startsWith('/admin')) return null;

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const { footerData, socialLinks } = props;

    // Helper to safely get links with validation
    const getLinks = (section: FooterSection | undefined | null): LinkItem[] => {
        if (section && Array.isArray(section.links)) {
            return section.links;
        }
        return [];
    };

    // Helper for social links
    const getSocialUrl = (platform: SocialLink | undefined | null) => {
        return platform?.url || "#";
    };

    const socialIcons = [
        {
            name: "X",
            href: getSocialUrl(socialLinks?.X),
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            name: "Instagram",
            href: getSocialUrl(socialLinks?.Instagram),
            icon: (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            ),
        },
        {
            name: "YouTube",
            href: getSocialUrl(socialLinks?.Youtube),
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: getSocialUrl(socialLinks?.Facebook),
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
    ];

    const section1Links = getLinks(footerData?.Section1);
    const section2Links = getLinks(footerData?.Section2);
    const section3Links = getLinks(footerData?.Section3);
    const FooterImageUrl = footerData?.FooterImage?.url as string;

    const section1Name = footerData?.Section1?.LinkSectionName || "Help";
    const section2Name = footerData?.Section2?.LinkSectionName || "Shop & Visit";
    const section3Name = footerData?.Section3?.LinkSectionName || "Legal";

    return (
        <footer className="bg-black text-white pb-8 w-full">
            <div className="max-w-7xl px-[18px] lg:px-[70px] pt-12 lg:pt-[120px] mx-auto">
                {/* Logo Section */}
                <div className="mb-9">
                    <Link href="/">
                        <Image
                            // src="/assets/Home/logo-white-large.svg"
                            src={!isLocal ? FooterImageUrl : `${STRAPI_BASE_URL}${FooterImageUrl}`}
                            alt="The Coca-Cola Company"
                            width={249}
                            height={40}
                            className="h-[40px] w-[249px]"
                            unoptimized={isLocal}

                        />

                    </Link>
                </div>

                {/* Separator */}
                <div className="border-t border-white mb-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-10">
                    {/* HELP Column */}
                    <div className="md:col-span-2">
                        {/* Mobile Header (Accordion Button) */}
                        <button
                            onClick={() => toggleSection('section1')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">{section1Name}</h3>
                            <ChevronDown isOpen={openSections['section1']} />
                        </button>

                        {/* Desktop Header */}
                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">{section1Name}</h3>

                        {/* Link List */}
                        <ul className={`space-y-3 text-md font-bold ${openSections['section1'] ? 'block py-4 ml-5' : 'hidden'} md:block md:py-0`}>
                            {section1Links.map((link) => (
                                <li key={link.id || link.name}>
                                    <Link href={link.url || '#'} className="hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SHOP & VISIT Column */}
                    <div className="md:col-span-3">
                        <button
                            onClick={() => toggleSection('section2')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">{section2Name}</h3>
                            <ChevronDown isOpen={openSections['section2']} />
                        </button>

                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">{section2Name}</h3>

                        <ul className={`space-y-3 text-md font-bold ${openSections['section2'] ? 'block py-4 ml-5' : 'hidden'} md:block md:py-0`}>
                            {section2Links.map((link) => (
                                <li key={link.id || link.name}>
                                    <Link href={link.url || '#'} className="hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* LEGAL Column */}
                    <div className="md:col-span-4">
                        <button
                            onClick={() => toggleSection('section3')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">{section3Name}</h3>
                            <ChevronDown isOpen={openSections['section3']} />
                        </button>

                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">{section3Name}</h3>

                        <ul className={`space-y-3 text-md font-bold ${openSections['section3'] ? 'block py-4 ml-7' : 'hidden'} md:block md:py-0`}>
                            {section3Links.map((link) => (
                                <li key={link.id || link.name}>
                                    <Link href={link.url || '#'} className="hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Icons */}
                    <div className="md:col-span-3 flex justify-start md:justify-end items-start gap-4 mt-8 md:mt-0 pt-8 md:pt-0 border-t border-white md:border-t-0">
                        {socialIcons.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                className="w-10 h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white mt-16 pt-8 flex flex-col md:flex-row justify-end items-center text-xs">
                    <p>© 2025 The Cloud9 Beverages Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

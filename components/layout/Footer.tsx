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

export default function Footer() {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const toggleSection = (section: string) => {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const socialIcons = [
        {
            name: "X",
            href: "#",
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
        },
        {
            name: "Instagram",
            href: "#",
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
            href: "#",
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
        {
            name: "Facebook",
            href: "#",
            icon: (
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
            ),
        },
    ];

    const helpLinks = [
        { name: "Admin Login", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Sitemap", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Order Status", href: "#" },
        { name: "Shipping", href: "#" },
    ];

    const shopLinks = [
        { name: "Coca-Cola Store Online", href: "#" },
        { name: "Coca-Cola Int'l Store Online", href: "#" },
        { name: "Coca-Cola Store Atlanta", href: "#" },
        { name: "Coca-Cola Store Orlando", href: "#" },
        { name: "Coca-Cola Store Las Vegas", href: "#" },
        { name: "World of Coca-Cola Attraction", href: "#" },
        { name: "Android App", href: "#" },
        { name: "Apple App", href: "#" },
    ];

    const legalLinks = [
        { name: "Company", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Cookies Policy", href: "#" },
        { name: "All Promotion Official Rules", href: "#" },
        { name: "Notice At Collection", href: "#" },
        { name: "Do Not Sell or Share My Personal Information", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Cookie Settings", href: "#" },
        { name: "Consumer Health Data Privacy Policy", href: "#" },
    ];

    return (
        <footer className="bg-black text-white pb-8 w-full">
            <div className="max-w-7xl px-[18px] lg:px-[70px] pt-12 lg:pt-[120px] mx-auto">
                {/* Logo Section */}
                <div className="mb-9">
                    <Link href="/">
                        <Image
                            src="/assets/Home/logo-white-large.svg"
                            alt="The Coca-Cola Company"
                            width={249}
                            height={40}
                            className="h-[40px] w-[249px]"
                        />
                    </Link>
                </div>

                {/* Separator - Visible on Desktop only or kept as per original? Image has line after logo. */}
                <div className="border-t border-white mb-10"></div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-10">
                    {/* HELP Column */}
                    <div className="md:col-span-2">
                        {/* Mobile Header (Accordion Button) */}
                        <button
                            onClick={() => toggleSection('help')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">Help</h3>
                            <ChevronDown isOpen={openSections['help']} />
                        </button>

                        {/* Desktop Header */}
                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">Help</h3>

                        {/* Link List */}
                        <ul className={`space-y-3 text-md font-bold ${openSections['help'] ? 'block py-4 ml-5' : 'hidden'} md:block md:py-0`}>
                            {helpLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* SHOP & VISIT Column */}
                    <div className="md:col-span-3">
                        <button
                            onClick={() => toggleSection('shop')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">Shop & Visit</h3>
                            <ChevronDown isOpen={openSections['shop']} />
                        </button>

                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">Shop & Visit</h3>

                        <ul className={`space-y-3 text-md font-bold ${openSections['shop'] ? 'block py-4 ml-5' : 'hidden'} md:block md:py-0`}>
                            {shopLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:underline">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* LEGAL Column */}
                    <div className="md:col-span-4">
                        <button
                            onClick={() => toggleSection('legal')}
                            className="flex justify-between items-center w-full md:hidden py-2"
                        >
                            <h3 className="text-[20px] font-bold text-white">Legal</h3>
                            <ChevronDown isOpen={openSections['legal']} />
                        </button>

                        <h3 className="hidden md:block text-gray-400 text-xs font-bold tracking-widest mb-6 uppercase">Legal</h3>

                        <ul className={`space-y-3 text-md font-bold ${openSections['legal'] ? 'block py-4 ml-7' : 'hidden'} md:block md:py-0`}>
                            {legalLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="hover:underline">
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
                    <p>© 2025 The Coca-Cola Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="bg-component w-full h-20 px-8 flex items-center justify-between border-b border-gray-200 sticky top-0 z-50">
            {/* Logo Section */}
            <Link href="/" className="relative h-10 w-40">
                <Image
                    src="/assets/Home/Coke-company-logo-black.svg"
                    alt="Coca-Cola Company Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 font-medium text-sm tracking-wide">
                <Link
                    href="/about"
                    className="text-foreground hover:opacity-70 transition-opacity uppercase"
                >
                    About Us
                </Link>

                {/* Dropdown for "What We Do" */}
                <div
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <button className="flex items-center space-x-1 text-foreground hover:opacity-70 transition-opacity uppercase focus:outline-none">
                        <span>What We Do</span>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    <div
                        className={`absolute top-full right-0 mt-2 w-48 bg-foreground text-component rounded-md shadow-lg py-2 transition-all duration-200 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                            }`}
                    >
                        <Link href="/services" className="block px-4 py-2 hover:opacity-80 transition-opacity">
                            Our Services
                        </Link>
                        <Link href="/projects" className="block px-4 py-2 hover:opacity-80 transition-opacity">
                            Projects
                        </Link>
                        <Link href="/innovations" className="block px-4 py-2 hover:opacity-80 transition-opacity">
                            Innovations
                        </Link>
                    </div>
                </div>

                {/* Contact Us Button */}
                <Link
                    href="/contact"
                    className="bg-foreground text-component px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity uppercase text-sm"
                >
                    Contact Us
                </Link>
            </div>

            {/* Mobile Menu Button (Hamburger) */}
            <div className="md:hidden">
                <button className="text-foreground focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

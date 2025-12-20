"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { name: "Brands", href: "/brands" },
        { name: "Discover", href: "/discover", hasChevron: true },
        { name: "Impact", href: "/impact", hasChevron: true },
        { name: "Shop", href: "/shop" },
        { name: "Promos & Offers", href: "/promos" },
    ];

    return (
        <nav className="bg-white top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-3 lg:px-3">
                <div className="flex items-center justify-between md:justify-start gap-14 h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/assets/Coke-company-logo-black.svg"
                                alt="The Coca-Cola Company"
                                width={125}
                                height={20}
                                className="h-[43px] w-[125px]"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10 h-[100%]">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`pt-2 h-[100%] flex items-center text-black font-bold text-[15px] tracking-wide transition-all duration-200 border-b-4 ${isActive ? "border-black" : "border-transparent hover:border-black"
                                        }`}
                                >
                                    {link.name}
                                    {link.hasChevron && (
                                        <svg
                                            className="ml-1 w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-gray-700 focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full" id="mobile-menu">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`block px-3 py-4 text-base font-bold text-black border-b border-gray-100 ${isActive ? "bg-gray-50" : ""
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex justify-between items-center">
                                        {link.name}
                                        {link.hasChevron && (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}

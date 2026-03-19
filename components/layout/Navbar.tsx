"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, Fragment } from "react";
import { usePathname } from "next/navigation";
import { useGetExtraDataQuery } from "@/src/store/slices/api";

interface Store {
    _id: string;
    name: string;
    link: string;
}

interface NavbarProps {
    stores: Store[];
    navbarImage: string | undefined;
}
export default function Navbar({ stores, navbarImage }: NavbarProps) {
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState<string>("");
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string>("");
    const isAdmin = pathname?.startsWith('/admin');
    const isBecomeOurDisributor = pathname?.startsWith('/become-our-distributor');
    const isLocal = STRAPI_BASE_URL.includes("localhost");
    const { data, error } = useGetExtraDataQuery();
    const stickyNav = data?.data?.StickyNavbar;
    if (isAdmin || isBecomeOurDisributor) return null;

    // Derived image URL
    const imageUrl = navbarImage
        ? (!isLocal ? navbarImage : `${STRAPI_BASE_URL}${navbarImage}`)
        : "/assets/Home/Coke-company-logo-black.svg"; // Fallback

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    type NavLinkData = {
        href: string;
        hasChevron?: boolean;
        dropdownContent?: { name: string; link: string }[];
    };

    let navLinks: Record<string, NavLinkData> = {
        "Brands": { href: "/brands" },
        "Discover": { href: "/discover", hasChevron: true, dropdownContent: [{ name: "Coke Studio Bharat", link: "#" }, { name: "Sprite Joke In A Bottle", link: "#" }] },
        "Impact": { href: "/impact", hasChevron: true, dropdownContent: [{ name: "Sustainability", link: "#" }] },
        "Shop": { href: "#", hasChevron: true },
        "Promos & Offers": { href: "/promos&offers" }
    };

    if (navLinks["Shop"]) {
        navLinks["Shop"].dropdownContent = stores?.map((store) => {
            return {
                name: store.name,
                link: store.link,
            }
        });
    }
    console.log('DEBUG: stickyNav', stickyNav);
    return (
        <>
            {stickyNav && <div className="h-20" />}
            <nav className={`bg-[var(--component)] z-50 transition-all duration-300 ${stickyNav ? "fixed top-0 left-0 w-full shadow-md" : "relative"}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-3 lg:px-3">
                    <div className="flex items-center justify-between md:justify-start gap-14 h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center">
                                <Image
                                    // src="/assets/Home/Coke-company-logo-black.svg"
                                    src={process.env.NEXT_PUBLIC_STRAPICONTENT_PREFIX + imageUrl}
                                    // src={navbarImage}
                                    alt="The Coca-Cola Company"
                                    width={125}
                                    height={20}
                                    className="h-[43px] w-[125px]"
                                    priority
                                    unoptimized={isLocal}
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-10 h-[100%]">
                            {Object.entries(navLinks).map(([name, linkData]) => {
                                const link = { name, ...linkData };
                                const isActive = pathname === link.href;
                                return (
                                    <div
                                        key={name}
                                        className="relative h-full flex items-center"
                                        onMouseEnter={() => setActiveDropdown(link.name)}
                                        onMouseLeave={() => setActiveDropdown("")}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`pt-2 h-full flex items-center text-black font-bold text-[15px] tracking-wide transition-all duration-200 border-b-4 ${isActive ? "border-black" : "border-transparent hover:border-black"
                                                }`}
                                        >
                                            {link.name}
                                            {link.hasChevron && (
                                                <svg
                                                    className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? "rotate-90" : ""}`}
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
                                        {activeDropdown === link.name && link.dropdownContent && (
                                            <div
                                                className="absolute top-full left-0 bg-[var(--component)] shadow-xl border border-gray-100 p-2 flex flex-col gap-1 min-w-[220px] rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                                            >
                                                {link.dropdownContent.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.link}
                                                        className="block py-2.5 px-4 text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:text-black rounded-md transition-colors"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center md:hidden gap-4">
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
                    <div className="fixed inset-0 z-50 bg-[var(--component)]" id="mobile-menu">
                        <div className="flex justify-end p-4">
                            <button
                                onClick={toggleMenu}
                                className="p-2 text-black hover:text-gray-700"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 pt-2 space-y-4">
                            {Object.entries(navLinks).map(([name, linkData]) => {
                                const link = { name, ...linkData };
                                const isActiveMobile = activeMobileDropdown === name;

                                return (
                                    <div key={name} className="border-b border-gray-100 last:border-0 pb-4">
                                        {link.dropdownContent ? (
                                            <div onClick={() => setActiveMobileDropdown(isActiveMobile ? "" : name)}>
                                                <div className="flex justify-between items-center w-full text-[22px] font-bold text-black cursor-pointer">
                                                    {link.name}
                                                    {link.hasChevron && (
                                                        <svg
                                                            className={`w-5 h-5 transition-transform duration-300 ${isActiveMobile ? "rotate-90" : ""}`}
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
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isActiveMobile ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                                                        }`}
                                                >
                                                    <div className="flex flex-col space-y-3 pl-2 border-l-2 border-black ml-1">
                                                        {link.dropdownContent.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.link}
                                                                className="text-lg font-medium text-gray-600 hover:text-black block py-1"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="block text-[22px] font-bold text-black"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <div className="flex justify-between items-center w-full">
                                                    {link.name}
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

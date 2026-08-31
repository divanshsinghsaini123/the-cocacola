"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Megaphone, CheckCircle2, Map, Phone, Mail } from "lucide-react";
import Accordion from "./Accordion";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

export default function DistributorClientView({
    homeData,
    contactData,
}: {
    homeData: any;
    contactData: any;
}) {
    const [activeTab, setActiveTab] = useState<"home" | "contact">("home");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const hash = window.location.hash;
            if (hash === "#contact-form" || hash === "#contact") {
                setActiveTab("contact");
            }
        }
    }, []);

    const { Hero, Hero2, Footer, PageButton: buttonStyle, DisablePage } = homeData || {};
    const buttondata = Hero?.button;
    const showButton = buttondata ? !buttondata.disablebutton : false;

    // Render Home/Main View
    const renderHome = () => {
        if (DisablePage) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#070910] text-white font-medium text-lg">
                    Page Currently Disabled
                </div>
            );
        }

        return (
            <div className="w-full animation-fade-in pt-32 lg:pt-40">
                {/* Hero Section */}
                <section className="relative w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden pb-20">
                    <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
                        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8 backdrop-blur-md">
                            <span className="text-sm font-medium tracking-wide">👋 Welcome To Cloud9</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-[1.3] text-center max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-x-4 gap-y-3 lg:gap-y-4">
                            {Hero?.Heading ? Hero.Heading.split(" ").filter(Boolean).map((word: string, i: number) => {
                                if (word.toLowerCase().includes("Cloud9")) {
                                    return (
                                        <span key={i} className="bg-[#3FA2F6] text-white px-4 py-0 pb-1 rounded-2xl inline-block -rotate-2 transform hover:rotate-0 transition-transform cursor-pointer">
                                            {word}
                                        </span>
                                    );
                                }
                                if (word.toLowerCase().includes("apply")) {
                                    return (
                                        <span key={i} className="flex items-center gap-3">
                                            <span className="bg-[#A855F7] p-2 md:p-3 rounded-full inline-flex items-center justify-center transform -rotate-12">
                                                <Megaphone className="text-white w-5 h-5 md:w-7 md:h-7" fill="currentColor" />
                                            </span>
                                            {word}
                                        </span>
                                    );
                                }
                                return <span key={i}>{word}</span>;
                            }) : null}
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                            {Hero?.Description}
                        </p>
                        {showButton &&
                            <div className="flex items-center justify-center w-full">
                                <button onClick={() => setActiveTab("contact")} style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined} className="flex items-center space-x-3 bg-[#3FA2F6] hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-medium text-base transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:-translate-y-1">
                                    <span>{buttondata.buttonText}</span>
                                    <div className="bg-white rounded-full p-1.5 text-[#3FA2F6]">
                                        <ArrowRight size={18} strokeWidth={3} />
                                    </div>
                                </button>
                            </div>
                        }
                        {/* {Hero?.Logo && (
                        <div className="mt-16 relative opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <Image
                                src={getStrapiMediaUrl(Hero.Logo.url)}
                                alt="Hero Logo"
                                width={Hero.Logo.width || 150}
                                height={Hero.Logo.height || 50}
                                className="object-contain"
                            />
                        </div>
                    )} */}
                    </div>
                </section>

                {/* About / Expandable Section */}
                <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col gap-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
                        <div className="w-full">
                            <Accordion items={Hero2?.LeftExpendableSection || []} />
                        </div>

                        <div className="w-full flex flex-col bg-[#111424] rounded-3xl p-8 md:p-12 border border-gray-800/50 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10 pointer-events-none"></div>

                            <div className="text-gray-300 text-[13px] md:text-[15px] leading-[1.8] tracking-wide mb-10">
                                {Hero2?.Hero2Description?.split('\n').map((para: string, i: number) => (
                                    <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: para.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#3FA2F6] hover:underline">$1</a>') }} />
                                ))}
                            </div>

                            <div className="mb-2 mt-auto">
                                {/* <button style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined} className="inline-flex items-center space-x-3 bg-[#3FA2F6] hover:bg-blue-500 text-white px-7 py-3 rounded-full font-medium transition-colors shadow-lg shadow-blue-500/20">
                                <span>Learn More</span>
                                <div className="bg-white text-[#3FA2F6] rounded-full p-1.5">
                                    <ArrowRight size={16} strokeWidth={3} />
                                </div>
                            </button> */}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-800/80 mt-8">
                        <div className="flex flex-col items-center md:items-start md:pl-10">
                            <div className="flex items-baseline space-x-1 mb-3">
                                <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{Hero2?.YearsInBusiness}</span>
                                <span className="text-3xl md:text-4xl font-semibold text-[#3FA2F6]">Y</span>
                            </div>
                            <span className="text-gray-400 text-sm md:text-base tracking-widest font-medium">Years in business</span>
                        </div>
                        <div className="flex flex-col items-center md:items-start md:border-l border-gray-800/80 md:pl-16">
                            <div className="mb-3">
                                <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{Hero2?.SucessfulProjects}<span className="text-[#3FA2F6]">+</span></span>
                            </div>
                            <span className="text-gray-400 text-sm md:text-base tracking-widest font-medium">Successful Projects</span>
                        </div>
                        <div className="flex flex-col items-center md:items-start md:border-l border-gray-800/80 md:pl-16">
                            <div className="mb-3">
                                <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{Hero2?.HappyClients}<span className="text-[#3FA2F6]">%</span></span>
                            </div>
                            <span className="text-gray-400 text-sm md:text-base tracking-widest font-medium">Happy Clients</span>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="py-24 px-6 relative">
                    <div className="max-w-[85rem] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                            {Hero2?.Service?.map((service: any, index: number) => {
                                const isLast = index === Hero2.Service.length - 1;
                                return (
                                    <div key={service.id} className="flex flex-col group">
                                        <div className="inline-block border border-gray-700/80 bg-gray-800/20 text-gray-300 rounded-full px-4 py-1 text-xs md:text-[13px] w-max mb-6 font-medium">
                                            Our Services
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 tracking-tight">
                                            {service.Heading}
                                        </h2>
                                        <h3 className="text-[15px] md:text-[16px] text-gray-300 mb-5 font-normal leading-relaxed">
                                            {service.SubHeading}
                                        </h3>

                                        <ul className="space-y-3 text-gray-400 text-[13px] md:text-[15px] flex-grow mb-8 leading-relaxed">
                                            {service.BulletPoint?.map((bp: any) => {
                                                const formattedPoint = bp.Points.replace(/^([^:]+):/, '<strong class="text-white font-medium">$1:</strong>');
                                                return (
                                                    <li key={bp.id} className="flex gap-4 items-start">
                                                        <div className="mt-1.5 w-1.5 h-1.5 bg-gray-500 rounded-full shrink-0 group-hover:bg-[#3FA2F6] transition-colors duration-300"></div>
                                                        {bp.redirectlink ? (
                                                            <Link href={bp.redirectlink} className="leading-relaxed hover:underline hover:text-[#3FA2F6] transition-colors">
                                                                <span dangerouslySetInnerHTML={{ __html: formattedPoint }} />
                                                            </Link>
                                                        ) : (
                                                            <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedPoint }} />
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        {isLast && (
                                            <div className="mt-auto flex justify-end w-full">
                                                {/* <button style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined} className="inline-flex items-center space-x-3 bg-[#3FA2F6] hover:bg-blue-500 text-white px-6 py-3 rounded-full font-medium transition-transform hover:scale-105 shadow-lg shadow-blue-500/20">
                                                <span>All Services</span>
                                                <div className="bg-white text-[#3FA2F6] rounded-full p-1.5">
                                                    <ArrowRight size={16} strokeWidth={3} />
                                                </div>
                                            </button> */}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>


            </div>
        );
    };

    // Render Contact View Component
    const renderContact = () => (
        <div id="contact-form" className="w-full animation-fade-in pt-36 lg:pt-48 pb-20 px-4 sm:px-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-wide">Contact</h1>
            <p className="text-gray-400 text-center text-[17px] leading-[1.8] max-w-3xl mb-16">
                {contactData?.Description}
            </p>

            <div className="w-full max-w-[900px] rounded-[28px] overflow-hidden shadow-2xl relative">
                {/* Left Panel: Contact Info Card */}
                {/* <div className="bg-gradient-to-br from-[#1b509d] to-[#041d40] p-5 sm:p-8 md:p-14 flex flex-col justify-center border border-[#0d2a58]">
                    <div className="space-y-0">
                        {contactData?.Address && (
                            <div className="flex items-start gap-3 md:gap-5 border-b border-light pb-4 md:pb-8 mb-4 md:mb-8" style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}>
                                <div className="bg-[#4aa5f8] p-2 md:p-3 rounded-full text-white shrink-0 mt-0.5 md:mt-1 shadow-sm">
                                    <Map className="w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-base md:text-[22px] mb-0.5 md:mb-2 tracking-wide">Address</h4>
                                    <p className="text-white/90 text-[13px] md:text-[15px] leading-relaxed max-w-[200px]">{contactData.Address}</p>
                                </div>
                            </div>
                        )}
                        {contactData?.Phone && (
                            <div className="flex items-start gap-3 md:gap-5 border-b border-light pb-4 md:pb-8 mb-4 md:mb-8" style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}>
                                <div className="bg-white p-2 md:p-3 rounded-full text-black shrink-0 mt-0.5 md:mt-1 shadow-sm">
                                    <Phone className="w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-base md:text-[22px] mb-0.5 md:mb-2 tracking-wide">Phone</h4>
                                    <p className="text-white/90 text-[13px] md:text-[15px]">{contactData.Phone}</p>
                                </div>
                            </div>
                        )}
                        {contactData?.Email && (
                            <div className="flex items-start gap-3 md:gap-5 border-b border-light pb-4 md:pb-8 mb-4 md:mb-8" style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}>
                                <div className="bg-[#4aa5f8] p-2 md:p-3 rounded-full text-white shrink-0 mt-0.5 md:mt-1 shadow-sm">
                                    <Mail className="w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium text-base md:text-[22px] mb-0.5 md:mb-2 tracking-wide">Email</h4>
                                    <p className="text-white/90 text-[13px] md:text-[15px]">{contactData.Email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {contactData?.FollowUsOn && [contactData.FollowUsOn.Facebook, contactData.FollowUsOn.Twitter, contactData.FollowUsOn.Youtube, contactData.FollowUsOn.Instagram, contactData.FollowUsOn.Printest].some(link => link && link.trim() !== "") && (
                        <div className="mt-1 md:mt-4">
                            <h4 className="text-white font-medium text-[16px] md:text-[20px] mb-3 md:mb-6 tracking-wide">Follow Us On :</h4>
                            <div className="flex items-center gap-2 md:gap-3">
                                {contactData.FollowUsOn.Facebook && contactData.FollowUsOn.Facebook.trim() !== "" && (
                                    <a href={contactData.FollowUsOn.Facebook} target="_blank" rel="noreferrer" className="bg-[#4aa5f8] p-1.5 md:p-2 flex items-center justify-center rounded-full text-white hover:opacity-80 transition-opacity w-8 h-8 md:w-[34px] md:h-[34px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="md:w-[18px] md:h-[18px]"><path d="M14.53 22.92v-8.96h2.98l.45-3.48h-3.43V8.25c0-1.01.28-1.7 1.73-1.7h1.85V3.44c-.32-.04-1.42-.14-2.7-.14-2.67 0-4.5 1.63-4.5 4.63v2.55H7.94v3.48h2.97v8.96h3.62z" /></svg>
                                    </a>
                                )}
                                {contactData.FollowUsOn.Twitter && contactData.FollowUsOn.Twitter.trim() !== "" && (
                                    <a href={contactData.FollowUsOn.Twitter} target="_blank" rel="noreferrer" className="bg-white p-1.5 md:p-2 flex items-center justify-center rounded-full text-[#111] hover:opacity-80 transition-opacity w-8 h-8 md:w-[34px] md:h-[34px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="md:w-[16px] md:h-[16px]"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                    </a>
                                )}
                                {contactData.FollowUsOn.Youtube && contactData.FollowUsOn.Youtube.trim() !== "" && (
                                    <a href={contactData.FollowUsOn.Youtube} target="_blank" rel="noreferrer" className="bg-white p-1.5 md:p-2 flex items-center justify-center rounded-full text-[#111] hover:opacity-80 transition-opacity w-8 h-8 md:w-[34px] md:h-[34px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="md:w-[18px] md:h-[18px]"><path d="M21.582 6.186a2.636 2.636 0 0 0-1.856-1.868C18.087 3.864 12 3.864 12 3.864s-6.087 0-7.726.454A2.635 2.635 0 0 0 2.418 6.186C1.964 7.838 1.964 12 1.964 12s0 4.162.454 5.814a2.636 2.636 0 0 0 1.856 1.868c1.639.454 7.726.454 7.726.454s6.087 0 7.726-.454a2.635 2.635 0 0 0 1.856-1.868c.454-1.652.454-5.814.454-5.814s0-4.162-.454-5.814zM9.953 15.421V8.579L15.93 12l-5.977 3.421z" /></svg>
                                    </a>
                                )}
                                {contactData.FollowUsOn.Instagram && contactData.FollowUsOn.Instagram.trim() !== "" && (
                                    <a href={contactData.FollowUsOn.Instagram} target="_blank" rel="noreferrer" className="bg-white p-1.5 md:p-2 flex items-center justify-center rounded-full text-[#111] hover:opacity-80 transition-opacity w-8 h-8 md:w-[34px] md:h-[34px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    </a>
                                )}
                                {contactData.FollowUsOn.Printest && contactData.FollowUsOn.Printest.trim() !== "" && (
                                    <a href={contactData.FollowUsOn.Printest} target="_blank" rel="noreferrer" className="bg-white p-1.5 md:p-2 flex items-center justify-center rounded-full text-[#111] hover:opacity-80 transition-opacity w-8 h-8 md:w-[34px] md:h-[34px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="md:w-[16px] md:h-[16px]"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.624.002 12.017.002z" /></svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div> */}

                {/* Right Panel: Form Card */}
                <div className="bg-[#0b0f19] p-5 sm:p-8 md:p-12 border border-l-0 border-[#0b0f19]">
                    <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)}>
                        <input required name="name" type="text" placeholder="Name" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <input required name="phoneNumber" type="tel" placeholder="Phone Number" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <input required name="email" type="email" placeholder="E-mail" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <select required name="state" defaultValue="" className="bg-white text-black border-r-8 border-transparent rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#4aa5f8] transition-colors w-full text-[15px] shadow-sm font-medium appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                            <option value="" disabled>State</option>
                            <option value="Andaman and Nicobar Islands">Andaman & Nicobar Islands</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                            <option value="Assam">Assam</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Chandigarh">Chandigarh</option>
                            <option value="Chhattisgarh">Chhattisgarh</option>
                            <option value="Dadra and Nagar Haveli">Dadra & Nagar Haveli</option>
                            <option value="Daman and Diu">Daman & Diu</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Goa">Goa</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Himachal Pradesh">Himachal Pradesh</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Kerala">Kerala</option>
                            <option value="Lakshadweep">Lakshadweep</option>
                            <option value="Madhya Pradesh">Madhya Pradesh</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Manipur">Manipur</option>
                            <option value="Meghalaya">Meghalaya</option>
                            <option value="Mizoram">Mizoram</option>
                            <option value="Nagaland">Nagaland</option>
                            <option value="Odisha">Odisha</option>
                            <option value="Puducherry">Puducherry</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Sikkim">Sikkim</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Telangana">Telangana</option>
                            <option value="Tripura">Tripura</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                            <option value="Uttarakhand">Uttarakhand</option>
                            <option value="West Bengal">West Bengal</option>
                        </select>
                        <input required name="city" type="text" placeholder="City" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <input required name="pinCode" type="text" placeholder="Pin Code" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <input required name="address" type="text" placeholder="Address" className="bg-[#181a25] border border-[#2b2f4f] rounded-full px-6 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#4aa5f8] transition-colors w-full text-[15px]" />
                        <select required name="businessType" defaultValue="" className="bg-white text-black border-r-8 border-transparent rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#4aa5f8] transition-colors w-full text-[15px] shadow-sm font-medium appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                            <option value="" disabled>Business Type</option>
                            <option value="Dealership">Dealership</option>
                            <option value="Distributorship">Distributorship</option>
                            <option value="Super Stockist">Super Stockist</option>
                        </select>
                        <select required name="investmentPlan" defaultValue="" className="bg-white text-black border-r-8 border-transparent rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#4aa5f8] transition-colors w-full text-[15px] shadow-sm font-medium appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}>
                            <option value="" disabled>Investment Plan</option>
                            <option value="5-7 lakh">5-7 Lakh</option>
                            <option value="10-15 lakh">10-15 Lakh</option>
                            <option value="25-2 cr">25 Lakh - 2 Cr</option>
                        </select>

                        <div className="mt-2 flex justify-start">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined}
                                className="bg-[#4aa5f8] hover:bg-blue-400 text-white px-9 py-3 rounded-full font-medium transition-all shadow-md mt-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phoneNumber") as string,
            pinCode: formData.get("pinCode") as string,
            address: formData.get("address") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            businessType: formData.get("businessType") as string,
            investmentPlan: formData.get("investmentPlan") as string,
            isActive: true,
        };
        try {
            const res: any = await fetch("/api/Contactus/BecomeOurDistributor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ data }),
            });
            const response: any = await res.json();
            console.log(response);

            if (res.ok) {
                window.location.reload();
            } else {
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error("Error submitting distributor form:", err);
            setIsSubmitting(false);
        }

        // console.log(data);
    }
    return (
        <div className="w-full flex flex-col items-center">
            {/* Custom Navbar just for this page */}
            <nav className="absolute top-0 left-0 w-full z-50 flex flex-wrap lg:flex-nowrap items-center justify-between gap-y-4 px-4 py-4 md:px-6 md:py-6 lg:px-10">
                <div className="flex items-center shrink-0 gap-3 md:gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-`center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all shadow-lg backdrop-blur-md"
                        title="Back to Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                    </Link>
                    {/* The screenshot shows 'Cloud9 ENERGY DRINK' logo. We use the one from Hero or standard img. */}
                    {Hero?.Logo ? (
                        <Image
                            src={getStrapiMediaUrl(Hero.Logo.url)}
                            alt="Logo"
                            width={110}
                            height={40}
                            className="object-contain w-20 md:w-[110px]"
                        />
                    ) : (
                        <span className="text-xl md:text-2xl font-black text-red-600 tracking-tighter">Cloud9<span className="hidden sm:inline text-white text-sm font-medium ml-2">ENERGY DRINK</span></span>
                    )}
                </div>

                <div className="flex w-full order-3 lg:order-none lg:w-auto justify-center">
                    <div className="flex items-center space-x-1 bg-[#1a1c2e]/60 backdrop-blur-md rounded-full border border-gray-700/50 p-1 md:p-1.5 shadow-lg scale-95 md:scale-100">
                        {!DisablePage &&
                            <button
                                onClick={() => setActiveTab("home")}
                                className={`px-5 py-2 rounded-full text-[13px] md:text-sm font-medium transition-all duration-300 ${activeTab === "home" ? "bg-[#252a40] text-white shadow-md border border-gray-600/50" : "text-gray-300 hover:text-white"}`}
                            >
                                Home
                            </button>}
                        <button
                            onClick={() => setActiveTab("contact")}
                            className={`px-5 py-2 rounded-full text-[13px] md:text-sm font-medium transition-all duration-300 ${activeTab === "contact" ? "bg-[#343e5c] text-white shadow-md border border-gray-500/50" : "text-gray-300 hover:text-white"}`}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>

                <div className="flex shrink-0 order-2 lg:order-none">
                    <button
                        onClick={() => setActiveTab("contact")}
                        style={buttonStyle ? { backgroundColor: buttonStyle.BackgroundHexColor, color: buttonStyle.FontHexColor } : undefined}
                        className="flex items-center space-x-1.5 md:space-x-2 bg-[#3FA2F6] hover:bg-blue-500 text-white px-3 md:px-5 py-2 md:py-2.5 rounded-full font-medium transition-colors shadow-lg"
                    >
                        <span className="text-xs md:text-sm">Let's Talk</span>
                        <div className="bg-white rounded-full p-0.5 text-[#3FA2F6]">
                            <ArrowRight size={12} strokeWidth={3} className="md:w-[14px] md:h-[14px]" />
                        </div>
                    </button>
                </div>
            </nav>

            <style dangerouslySetInnerHTML={{
                __html: `
                .animation-fade-in {
                    animation: fadeIn 0.4s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />

            {/* Toggle Content */}
            <div className="w-full flex-grow">
                {activeTab === "home" ? renderHome() : renderContact()}
            </div>

            {/* Global Footer */}
            {Footer && Footer.Footer_Points?.length > 0 && (
                <section className="w-full bg-[#03040b] pt-20 pb-24 px-6 border-t border-[#131b31] relative z-10">
                    <div className="max-w-[85rem] mx-auto flex flex-col items-start px-2 lg:px-8">
                        {Hero?.Logo ? (
                            <div className="mb-10">
                                <Image
                                    src={getStrapiMediaUrl(Hero.Logo.url)}
                                    alt="Logo"
                                    width={120}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="mb-10 text-3xl font-black text-red-600 tracking-tighter">
                                Cloud9<span className="text-white text-sm font-medium ml-2">ENERGY DRINK</span>
                            </div>
                        )}

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-8 leading-[1.1] tracking-tight max-w-4xl">
                            {...(Footer.Heading ? [Footer.Heading] : [
                                <span key="1">
                                    Become An <br className="hidden md:block" />
                                    Authorized Cloud9 <br className="hidden md:block" />
                                    Energy <br className="hidden md:block" />
                                    Distributor!
                                </span>
                            ])}
                        </h2>

                        <ul className="space-y-3 md:space-y-4">
                            {Footer.Footer_Points?.map((pt: any) => (
                                <li key={pt.id} className="flex items-center gap-3 md:gap-4 group cursor-default">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-[#4aa5f8] transition-colors shrink-0"></div>
                                    <span className="text-[16px] md:text-[18px] text-[#708bc3] font-normal tracking-wide group-hover:text-blue-300 transition-colors leading-[1.4]">{pt.Points}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </div>
    );
}

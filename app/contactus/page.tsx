"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "../../components/ui/Modal";
import { GetContactUsPageData } from "../../src/lib/strapi"
export default async function ContactUs() {
    const [topic, setTopic] = useState("question");
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const data = await GetContactUsPageData();

    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            <main className="max-w-2xl mx-auto px-4 py-12 md:py-20 text-black">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4 font-sans">Contact Us</h1>
                    <p className="max-w-2xl mx-auto text-gray-700 text-lg">
                        Have a question that isn't answered by our <Link href="/aboutus/faq" className="font-bold underline">FAQ section</Link>? Send
                        us your question using the form below.
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-transparent">
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>

                        {/* Topic Selection */}
                        <div className="space-y-2">
                            <label
                                htmlFor="topic"
                                className="block text-sm font-medium text-gray-900"
                            >
                                What would you like to share with us?*
                            </label>
                            <div className="relative">
                                <select
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full p-4 pr-10 border border-black/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/50 text-lg transition-all"
                                >
                                    <option value="question">I have a question</option>
                                    <option value="issue">I have an issue with a drink i have purchased</option>
                                </select>
                                {/* Chevron Icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Question Logic: Note */}
                        {topic === "question" && (
                            <div className="text-sm text-gray-800 leading-relaxed">
                                Note: We receive many requests for sponsorship, and unfortunately we are unable
                                to respond to each and every one. Therefore, should you not receive a response to
                                your request within 2 weeks, this means we are unfortunately unable to assist at
                                this time.
                            </div>
                        )}

                        {/* Issue Logic: Specific Fields */}
                        {topic === "issue" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">

                                <div className="space-y-2">
                                    <label htmlFor="drink-size" className="block text-sm font-medium text-gray-900">
                                        Do you still have the affected product?*
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="drink-size"
                                            name="drinkSize"
                                            required
                                            className="w-full p-4 pr-10 border border-black/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/50 text-gray-600"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Do you still have the affected product?</option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-black">
                                    We may need to retrieve the product from you. If ‘YES’ is selected: Please keep your product stored cooled until further notice / until you have been in contact with one of our colleagues.                                </p>
                                {/* Drink Size */}
                                <div className="space-y-2">
                                    <label htmlFor="drink-size" className="block text-sm font-medium text-gray-900">
                                        What is the drink size?*
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="drink-size"
                                            name="drinkSize"
                                            required
                                            className="w-full p-4 pr-10 border border-black/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/50 text-gray-600"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>What is the drink size?</option>
                                            <option value="250ml">250ml</option>
                                            <option value="500ml">500ml</option>
                                            <option value="1L">1L</option>
                                            <option value="2L">2L</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Count */}
                                <div className="space-y-2">
                                    <label htmlFor="count" className="block text-sm font-medium text-gray-900">
                                        How many drinks in total are affected?* (Numbers only)
                                    </label>
                                    <input
                                        type="number"
                                        id="count"
                                        name="count"
                                        required
                                        placeholder="Enter the number"
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50 placeholder:text-gray-500"
                                    />
                                </div>

                                {/* Expiration Date */}
                                <div className="space-y-2">
                                    <label htmlFor="expiration" className="block text-sm font-medium text-gray-900">
                                        Expiration Date*
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text" // using text for custom placeholder control or date
                                            id="expiration"
                                            name="expiration"
                                            required
                                            placeholder="mm/dd/yyyy"
                                            onFocus={(e) => e.target.type = 'date'}
                                            onBlur={(e) => e.target.value === '' && (e.target.type = 'text')}
                                            className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50 placeholder:text-gray-500"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-sm text-black">
                                        Having trouble locating? This will either be on the neck of the bottle or on the base of the can.
                                    </p>
                                </div>

                                {/* Production Code */}
                                <div className="space-y-2">
                                    <label htmlFor="production-code" className="block text-sm font-medium text-gray-900">
                                        What is the production code of the drink?
                                    </label>
                                    <input
                                        type="text"
                                        id="production-code"
                                        name="productionCode"
                                        placeholder="Enter the code"
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50 placeholder:text-gray-500"
                                    />
                                    <p className="text-sm text-black">
                                        Having trouble locating? This code will also be on the neck or base (normally located near the best before end).
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Message Area */}
                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                                Please type your message*
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={6}
                                placeholder={topic === "question" ? "Your message please" : "Can you describe the issue in as much detail as possible?"}
                                className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50 placeholder:text-gray-500 resize-none"
                            ></textarea>
                        </div>

                        {/* Personal Details Section */}
                        <div className="pt-8 border-t border-transparent">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-bold text-gray-900">First Name*</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        placeholder="John"
                                        required
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>
                                {/* Last Name */}
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-bold text-gray-900">Last Name*</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Doe"
                                        required
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>

                                {/* DOB */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="dob" className="block text-sm font-bold text-gray-900">Date of Birth*</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="dob"
                                            name="dob"
                                            placeholder="mm/dd/yyyy"
                                            required
                                            onFocus={(e) => e.target.type = 'date'}
                                            onBlur={(e) => e.target.value === '' && (e.target.type = 'text')}
                                            className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-900">Email Address*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="example@email.com"
                                        required
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>

                                {/* Country Code & Phone */}
                                <div className="space-y-2">
                                    <label htmlFor="countryCode" className="block text-sm font-medium text-gray-900">Country Code</label>
                                    <div className="relative">
                                        <select
                                            id="countryCode"
                                            name="countryCode"
                                            className="w-full p-4 pr-10 border border-black/20 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                        >
                                            <option>India (+91)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-900">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="(XXX) XXX XXXX"
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>

                                {/* Pin Code */}
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="pincode" className="block text-sm font-bold text-gray-900">Pin Code*</label>
                                    <input
                                        type="text"
                                        id="pincode"
                                        name="pincode"
                                        required
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>
                            </div>

                            {/* Address Remaining */}
                            <div className="mt-6 space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-900">Address</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-900">City</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-900">State</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Checkbox and Submit */}
                        <div className="pt-6 space-y-8">
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    checked={agreed}
                                    className="mt-1 w-5 h-5 border-gray-300 rounded text-black focus:ring-black"
                                />
                                <label htmlFor="agree" className="text-gray-900">
                                    I agree with <button type="button" onClick={() => setShowTerms(true)} className="font-bold underline hover:text-gray-700">Terms of Use</button> and <button type="button" onClick={() => setShowPrivacy(true)} className="font-bold underline hover:text-gray-700">Privacy Policy</button>.
                                </label>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-12 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors text-lg"
                                    disabled={!agreed}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* Additional Contact Info */}
                        <div className="pt-12 text-center md:text-left">
                            <h3 className="text-3xl font-bold mb-8 text-center">More Ways To Contact Us</h3>

                            <div className="md:flex justify-between items-start">
                                <div>
                                    <h4 className="text-2xl font-bold mb-2">Coca-Cola India</h4>
                                    <p className="text-lg">For consumer related queries, please mail us at: <a href="mailto:indiahelpline@coca-cola.com" className="font-bold underline">indiahelpline@coca-cola.com</a></p>
                                    <p className="text-lg mt-1">Or contact the consumer helpline at: <span className="font-bold">1800-208-2653</span></p>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
            </main>

            {/* Terms of Use Modal */}
            <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Use">
                <div className="space-y-4 text-gray-700">
                    <p>Welcome to The Coca-Cola Company website. Please read these Terms of Use carefully before using this site.</p>
                    <h4 className="font-bold text-black mt-4">1. Acceptance of Terms</h4>
                    <p>By accessing and using this website, you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
                    <h4 className="font-bold text-black mt-4">2. Use of Content</h4>
                    <p>All content on this site, including text, graphics, logos, and images, is the property of The Coca-Cola Company and protected by copyright laws.</p>
                    <h4 className="font-bold text-black mt-4">3. User Conduct</h4>
                    <p>You agree not to use this website for any unlawful purpose or in any way that could damage, disable, or impair the site.</p>
                    <p className="text-sm text-gray-500 italic mt-6">Last Updated: January 2026</p>
                </div>
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
                <div className="space-y-4 text-gray-700">
                    <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                    <h4 className="font-bold text-black mt-4">1. Information Collection</h4>
                    <p>We collect information you provide directly to us, such as when you fill out a contact form, including your name, email address, and phone number.</p>
                    <h4 className="font-bold text-black mt-4">2. Use of Information</h4>
                    <p>We use the information we collect to respond to your inquiries, improve our services, and communicate with you about our products.</p>
                    <h4 className="font-bold text-black mt-4">3. Data Protection</h4>
                    <p>We implement appropriate security measures to protect your personal information against unauthorized access or disclosure.</p>
                    <p className="text-sm text-gray-500 italic mt-6">Last Updated: January 2026</p>
                </div>
            </Modal>
        </div>
    );
}

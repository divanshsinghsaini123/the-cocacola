'use client'

import React, { useState } from "react";
import Link from "next/link";
import { contactData } from '../_data/contact_data';
import { useRouter } from "next/navigation";

export default function ContactUs() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            companyName: formData.get('companyName'),
            companyWebsite: formData.get('companyWebsite'),
            officeAddress: formData.get('officeAddress'),
            country: formData.get('country'),
            hasTrademark: formData.get('hasTrademark') === 'on',
            productSize: formData.get('productSize') || "",
            yearlyVolume: formData.get('yearlyVolume'),
            message: formData.get('message'),
            brandName: formData.get('brandName'),
            agreedToPrivacy: formData.get('agreedToPrivacy') === 'on',
            IsActive: true,
        };
        const result = await fetch('/api/Contactus/Cofilling', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const response = await result.json();
        if (response.status == 400) {
            alert(response.error);
        }
        else {
            setIsSubmitted(true);
            // setTimeout(() => {
            //     router.push("/cofilling");
            // }, 3000);
            formRef.current?.reset();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
        }

    }
    return (
        <section className="w-full bg-black text-white " id="contact">
            <h2 className="w-full bg-[#E51D29] py-6 px-4 md:px-16 text-white text-3xl md:text-4xl font-black italic uppercase tracking-wider mb-4 md:mb-15">
                Contact Us
            </h2>
            <div className="px-4 md:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 pb-16">

                {/* LEFT COLUMN: LOCATION */}
                <div className="flex-1 flex flex-col gap-8">
                    <h2 className="text-2xl font-bold uppercase text-center mb-4">{contactData.location.mainTitle}</h2>

                    <div className="space-y-6 text-gray-300">
                        <div>
                            <h3 className="text-white font-bold uppercase mb-2">{contactData.location.detailsTitle}</h3>
                            <p className="font-bold">{contactData.location.addressLabel}</p>
                            {contactData.location.addressLines.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>

                        <div>
                            <p className="font-bold">{contactData.location.gpsLabel}</p>
                            {contactData.location.gpsLines.map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>

                    {/* Google Map Embed */}
                    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-700">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1576.4369766983058!2d20.91361208034444!3d48.17637171420108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4740a1b0b5b5b5b5%3A0x5b0b5b5b5b5b5b5b!2sHell%20Energy%20Magyarorsz%C3%A1g%20Kft.!5e0!3m2!1sen!2shu!4v1708111111111!5m2!1sen!2shu"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>

                {/* RIGHT COLUMN: GET IN TOUCH */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold uppercase mb-4">GET IN TOUCH</h2>
                        <h3 className="text-xl whitespace-pre-line">{contactData.enquirySubtitle}</h3>
                    </div>
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-500">
                            <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-lg w-full">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold mb-4 text-black">Thank You!</h2>
                                <p className="text-gray-600 text-lg mb-6">
                                    Your message has been sent successfully. We will get back to you shortly.
                                </p>
                                {/* <p className="text-sm text-gray-500">
                                    Redirecting to home page...
                                </p> */}
                            </div>
                        </div>
                    ) :
                        (
                            <form ref={formRef} onSubmit={(e) => handleSubmit(e)} className="space-y-6">

                                {/* Contact Section */}
                                <div>
                                    <h4 className="font-bold mb-2">Contact</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="fullName" placeholder="Your Name*" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" required />
                                        <input type="email" name="email" placeholder="Contact E-mail Address*" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" required />
                                    </div>
                                </div>

                                {/* Company Section */}
                                <div>
                                    <h4 className="font-bold mb-2">Company</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input type="text" name="companyName" placeholder="Company Name*" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" required />
                                        <input type="text" name="companyWebsite" placeholder="Company Website" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="officeAddress" placeholder="Office address" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
                                        <input type="text" name="country" placeholder="Your country" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
                                    </div>
                                </div>

                                {/* Brand & Production Section */}
                                <div>
                                    <h4 className="font-bold mb-2">Brand & Production</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" name="hasTrademark" id="trademark" className="w-5 h-5 accent-red-600" />
                                            <label htmlFor="trademark" className="text-sm cursor-pointer select-none">Do you have a trademark registration?</label>
                                        </div>
                                        <input type="text" name="brandName" placeholder="Your existing brand name" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="yearlyVolume" placeholder="Planned yearly volume in million cans" className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600" />
                                        <select name="productSize" className="w-full p-3 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-600 appearance-none" defaultValue="">
                                            <option value="" disabled>Product Size(s)</option>
                                            <option value="250ml">250 ml</option>
                                            <option value="330ml">330 ml</option>
                                            <option value="500ml">500 ml</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Enquiry Section */}
                                <div>
                                    <h4 className="font-bold mb-2">Your Enquiry</h4>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        placeholder="Message"
                                        className="w-full p-3 rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                                    ></textarea>
                                </div>

                                {/* Privacy Policy & Submit */}
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="agreedToPrivacy" id="privacy" className="w-5 h-5 accent-red-600" required />
                                    <label htmlFor="privacy" className="text-sm cursor-pointer select-none">
                                        {contactData.privacyPolicy.text}
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(true)}
                                            className="text-red-500 hover:underline font-bold ml-1"
                                        >
                                            {contactData.privacyPolicy.linkText}
                                        </button>.
                                    </label>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="bg-[#E51D29] text-white font-bold py-3 px-12 rounded uppercase hover:bg-red-700 transition-colors">
                                        SUBMIT
                                    </button>
                                </div>

                            </form>
                        )}
                </div>
            </div>

            {/* Privacy Policy Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                    <div className="bg-zinc-900 border border-red-600 p-8 rounded-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white hover:text-red-500 font-bold"
                        >
                            X
                        </button>
                        <h3 className="text-2xl font-bold mb-4 uppercase text-[#E51D29]">Privacy Policy</h3>
                        <div className="text-gray-300">
                            <p>{contactData.privacyPolicy.text}</p>
                            <Link href={contactData.privacyPolicy.linkUrl}>{contactData.privacyPolicy.linkText}</Link>

                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
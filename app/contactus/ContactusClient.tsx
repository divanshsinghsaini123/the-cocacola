

"use client";
import { BlocksRenderer } from "@strapi/blocks-react-renderer"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "../../components/ui/Modal";
import { SITE_CONFIG } from "@/src/config/site";

interface ContactData {
    Contact_email: string;
    Contact_number: string;
    Terms_of_use?: any; // BlocksContent type from Strapi, keeping as any for now or specific block type if available
    Privacy_policy_page?: any; // BlocksContent type from Strapi
    PageButton?: { BackgroundHexColor?: string; FontHexColor?: string };
}

interface ContactusProps {
    data: ContactData;
}


export default function ContactusClient({ data }: ContactusProps) {
    const [topic, setTopic] = useState("question");
    const [agreed, setAgreed] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const email = data?.Contact_email;
    const mobile = data?.Contact_number;

    const router = useRouter();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        // Common fields for both schemas
        const commonData = {
            FirstName: formData.get("firstName"),
            LastName: formData.get("lastName"),
            Email: formData.get("email"),
            PhoneNumber: formData.get("countryCode") + " " + formData.get("phone"),
            PinCode: formData.get("pincode"),
            Address: formData.get("address"),
            City: formData.get("city"),
            State: formData.get("state"),
            DOB: formData.get("dob"),
        };

        try {
            let bodyData;

            if (topic === "question") {
                bodyData = {
                    ...commonData,
                    QuestionMessage: formData.get("message"),
                };
            } else {
                bodyData = {
                    ...commonData,
                    ProductAvailability: formData.get("productAvailability") === "yes",
                    DrinkSize: formData.get("drinkSize"),
                    DefectiveQuantity: Number(formData.get("count")),
                    ExpirationDate: formData.get("expiration"),
                    ProductionCode: Number(formData.get("productionCode")),
                    IssueMessage: formData.get("message"),
                };
            }

            const response = await fetch("/api/Contactus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    topic, // Send topic so the API knows which model to use
                    ...bodyData
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error("Failed to send message");
            }

            const result = await response.json();
            console.log("Success:", result);

            setIsSubmitted(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);

        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to send message. Please try again.");
        }
    }
    return (
        <div className="min-h-screen bg-[#F4F4F4]">
            <main className="max-w-3xl mx-auto px-4 py-12 md:py-20 text-black">
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
                            <p className="text-sm text-gray-500">
                                Redirecting to home page...
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
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
                            <form className="space-y-8" onSubmit={(e) => handleSubmit(e)}>

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
                                            required
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
                                            <label htmlFor="product-availability" className="block text-sm font-medium text-gray-900">
                                                Do you still have the affected product?*
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="product-availability"
                                                    name="productAvailability"
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
                                                required
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
                                                    required
                                                    className="w-full p-4 border border-black/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="state" className="block text-sm font-medium text-gray-900">State</label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="state"
                                                    required
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
                                            required
                                            className="mt-1 w-5 h-5 border-gray-300 rounded text-black focus:ring-black"
                                        />
                                        <label htmlFor="agree" className="text-gray-900">
                                            I agree with <button type="button" onClick={() => setShowTerms(true)} className="font-bold underline hover:text-gray-700">Terms of Use</button> and <button type="button" onClick={() => setShowPrivacy(true)} className="font-bold underline hover:text-gray-700">Privacy Policy</button>.
                                        </label>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            style={data?.PageButton ? { backgroundColor: data.PageButton.BackgroundHexColor, color: data.PageButton.FontHexColor } : undefined}
                                            className="w-full md:w-auto px-12 py-4 bg-black text-white font-bold rounded-full hover:opacity-80 transition-all text-lg"
                                        // disabled={!agreed}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>

                                {/* Additional Contact Info */}
                                <div className="pt-7 text-center md:text-left">
                                    <h3 className="text-2xl font-bold mb-8 text-center">More Ways To Contact Us</h3>

                                    <div className="md:flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">{SITE_CONFIG.companyName}</h4>
                                            <p className="text-lg">For consumer related queries, please mail us at: <a href={`mailto:${email}`} className="font-bold underline">{email}</a></p>
                                            <p className="text-lg mt-1">Or contact the consumer helpline at: <span className="font-bold">{mobile}</span></p>
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </>
                )}
            </main>

            {/* Terms of Use Modal */}
            <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="Terms of Use">
                {data?.Terms_of_use ? (
                    <BlocksRenderer content={data.Terms_of_use} />
                ) : (
                    <p className="text-gray-500">Content not available.</p>
                )}
            </Modal>

            {/* Privacy Policy Modal */}
            <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
                {data?.Privacy_policy_page ? (
                    <BlocksRenderer content={data.Privacy_policy_page} />
                ) : (
                    <p className="text-gray-500">Content not available.</p>
                )}
            </Modal>
        </div>
    );
}
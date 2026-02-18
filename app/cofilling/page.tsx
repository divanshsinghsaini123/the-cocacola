// import Navbar from './_components/navbar';
import Hero from './_components/hero';
import Hero2 from './_components/hero2';
import AboutUs from './_components/aboutus';
import FactoryHighlights from './_components/factory-highlights';
import WhatWeDo from './_components/what_we_do';
import ContactUs from './_components/contactus';



import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Co-Filling Services",
    description: "Learn about our state-of-the-art beverage co-filling and manufacturing capabilities.",
};

export default function Page() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* <Navbar /> */}
            <Hero />
            <Hero2 />
            <AboutUs />
            <FactoryHighlights />
            <WhatWeDo />
            <ContactUs />
        </main>
    );
}

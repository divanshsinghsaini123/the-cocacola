import Hero from './_components/hero';
import Hero2 from './_components/hero2';
import AboutUs from './_components/aboutus';
import FactoryHighlights from './_components/factory-highlights';
import WhatWeDo from './_components/what_we_do';
import ContactUs from './_components/contactus';
import { GetCofillingData } from '@/src/lib/strapi';
import { notFound } from 'next/navigation';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Co-Filling Services",
    description: "Learn about our state-of-the-art beverage co-filling and manufacturing capabilities.",
};

export default async function Page() {
    const data = await GetCofillingData();
    if (!data) return notFound();

    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* <Navbar /> */}
            <Hero data={data.hero} />
            <Hero2 data={data.hero2} />
            <AboutUs data={data.aboutus} />
            <FactoryHighlights data={data.factoryhighlights} />
            <WhatWeDo data={data.whatwedoSection} />
            <ContactUs data={data.contactus} />
        </main>
    );
}


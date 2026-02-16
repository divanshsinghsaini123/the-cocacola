// import Navbar from './_components/navbar';
import Hero from './_components/hero';
import Hero2 from './_components/hero2';
import AboutUs from './_components/aboutus';
import FactoryHighlights from './_components/factory-highlights';
import WhatWeDo from './_components/what_we_do';



export default function Page() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* <Navbar /> */}
            <Hero />
            <Hero2 />
            <AboutUs />
            <FactoryHighlights />
            <WhatWeDo />
            <div className="container mx-auto px-8 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Latest News & Updates</h2>
                <p className="opacity-80">More content coming soon...</p>
            </div>
        </main>
    );
}

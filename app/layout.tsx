import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import NavbarServer from "@/components/layout/NavbarServer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Coca-Cola",
  description: "The Coca-Cola website",
};

import { GetHomePageData } from "@/src/lib/strapi";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await GetHomePageData();

  // Safely access data whether it's flat or nested in attributes
  const footerData = data?.footer || data?.attributes?.footer;
  const socialLinksData = data?.socialLinks || data?.attributes?.socialLinks;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NavbarServer />
        {children}
        <Footer
          footerData={footerData}
          socialLinks={socialLinksData}
        />
      </body>
    </html>
  );
}

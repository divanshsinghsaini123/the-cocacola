import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import NavbarServer from "@/components/layout/NavbarServer";
import StoreProvider from "@/src/providers/StoreProvider";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { GetHomePageData } from "@/src/lib/strapi";

export async function generateMetadata(): Promise<Metadata> {
  const data = await GetHomePageData();
  const faviconUrl = data?.Favicon?.url || data?.attributes?.Favicon?.url;
  const fullFaviconUrl = faviconUrl ? getStrapiMediaUrl(faviconUrl) : "/favicon.ico";

  return {
    metadataBase: new URL("https://thecoco-cola-e7tww.ondigitalocean.app"), // Replace with actual domain
    title: {
      default: "The Cloud9 Beverages Company",
      template: "%s | The Cloud9 Beverages Company",
    },
    description: "Powering the World's Favorite Beverage Brands. We are a leading beverage company dedicated to refreshing the world and making a difference.",
    keywords: ["beverages", "drinks", "soda", "coca-cola", "refreshment", "cloud9", "manufacturing", "distribution"],
    authors: [{ name: "The Cloud9 Beverages Company" }],
    creator: "The Cloud9 Beverages Company",
    icons: {
      icon: fullFaviconUrl,
      shortcut: fullFaviconUrl,
      apple: fullFaviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://thecoco-cola-e7tww.ondigitalocean.app",
      title: "The Cloud9 Beverages Company",
      description: "Powering the World's Favorite Beverage Brands.",
      siteName: "The Cloud9 Beverages Company",
      images: [
        {
          url: "/assets/Home/logo-white-large.svg", // Ideally use an absolute URL or a specific OG image
          width: 1200,
          height: 630,
          alt: "The Cloud9 Beverages Company",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Cloud9 Beverages Company",
      description: "Powering the World's Favorite Beverage Brands.",
      images: ["/assets/Home/logo-white-large.svg"], // Ideally use an absolute URL or a specific OG image
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await GetHomePageData();

  // Safely access data whether it's flat or nested in attributes
  const footerData = data?.footer || data?.attributes?.footer;
  const socialLinksData = data?.socialLinks || data?.attributes?.socialLinks;
  const navbarImage = data?.NavbarImage?.url || data?.attributes?.NavbarImage?.url;
  const navbarColor = data?.NavbarHexCode || data?.attributes?.NavbarHexCode || "#FFFFFF";
  const navbarFontColor = data?.NavbarFontColorHexCode || data?.attributes?.NavbarFontColorHexCode;

  // sameColorNavAndFoot logic:
  // if sameColorNavAndFoot == true then footer bg is navbarColor
  // else fallback to footerHexCode
  const sameColor = data?.sameColorNavAndFoot ?? data?.attributes?.sameColorNavAndFoot;
  const footerHexCode = footerData?.FooterHexColorCode || "black";
  const footerBgColor = (sameColor === true) ? navbarColor : footerHexCode;

  // Favicon dynamic resolution
  const faviconUrl = data?.Favicon?.url || data?.attributes?.Favicon?.url;
  const fullFaviconUrl = faviconUrl ? getStrapiMediaUrl(faviconUrl) : "/favicon.ico";
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={fullFaviconUrl} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <StoreProvider>

          <NavbarServer navbarImage={navbarImage} navbarColor={navbarColor} navbarFontColor={navbarFontColor} />
          {children}
          <Footer
            footerData={footerData}
            socialLinks={socialLinksData}
            footerBgColor={footerBgColor}
          />
        </StoreProvider>
      </body>
    </html>
  );
}

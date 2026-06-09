import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import Script from "next/script";
import NavbarServer from "@/components/layout/NavbarServer";
import StoreProvider from "@/src/providers/StoreProvider";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";
import { GetHomePageData } from "@/src/lib/strapi";

import { SITE_CONFIG } from "@/src/config/site";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export async function generateMetadata(): Promise<Metadata> {
  const data = await GetHomePageData();
  const faviconUrl = data?.Favicon?.url || data?.attributes?.Favicon?.url;
  const fullFaviconUrl = faviconUrl ? getStrapiMediaUrl(faviconUrl) : "/favicon.ico";

  return {
    metadataBase: new URL("https://cloud9website-x6hfd.ondigitalocean.app/"), // Replace with actual domain
    title: {
      default: SITE_CONFIG.companyName,
      template: `%s | ${SITE_CONFIG.companyName}`,
    },
    description: "Powering the World's Favorite Beverage Brands. We are a leading beverage company dedicated to refreshing the world and making a difference.",
    keywords: SITE_CONFIG.defaultKeywords,
    authors: [{ name: SITE_CONFIG.companyName }],
    creator: SITE_CONFIG.companyName,
    icons: {
      icon: fullFaviconUrl,
      shortcut: fullFaviconUrl,
      apple: fullFaviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://cloud9website-x6hfd.ondigitalocean.app/",
      title: SITE_CONFIG.companyName,
      description: "Powering the World's Favorite Beverage Brands.",
      siteName: SITE_CONFIG.companyName,
      images: [
        {
          url: "/assets/Home/logo-white-large.svg", // Ideally use an absolute URL or a specific OG image
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.companyName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_CONFIG.companyName,
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

          {/* Google Analytics Tracking */}
          {SITE_CONFIG.analytics.googleAnalyticsId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.analytics.googleAnalyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${SITE_CONFIG.analytics.googleAnalyticsId}');
                `}
              </Script>
            </>
          )}

          {/* Meta Pixel (Facebook) Tracking */}
          {SITE_CONFIG.analytics.metaPixelId && (
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${SITE_CONFIG.analytics.metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
          )}
        </StoreProvider>
      </body>
    </html>
  );
}

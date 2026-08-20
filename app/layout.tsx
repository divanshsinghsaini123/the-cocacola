import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";
import Script from "next/script";
import NavbarServer from "@/components/layout/NavbarServer";
import StoreProvider from "@/src/providers/StoreProvider";
import { getStrapiMediaUrl } from "@/src/lib/strapi-media";
import { GetHomePageData, GetExtraData } from "@/src/lib/strapi";
import { renderCustomScript } from "@/src/lib/render-custom-scripts";

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
  const extraData = await GetExtraData();
  const globalConfig = extraData?.globalConfig || extraData?.attributes?.globalConfig;

  const faviconUrl = data?.Favicon?.url || data?.attributes?.Favicon?.url;
  const fullFaviconUrl = faviconUrl ? getStrapiMediaUrl(faviconUrl) : "/favicon.ico";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://cloud9-webapp-8afob.ondigitalocean.app";

  const companyName = globalConfig?.companyName || SITE_CONFIG.companyName;
  const defaultKeywords = globalConfig?.defaultKeywords
    ? globalConfig.defaultKeywords.split(",").map((k: string) => k.trim())
    : SITE_CONFIG.defaultKeywords;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: companyName,
      template: `%s | ${companyName}`,
    },
    description: "Powering the World's Favorite Beverage Brands. We are a leading beverage company dedicated to refreshing the world and making a difference.",
    keywords: defaultKeywords,
    authors: [{ name: companyName }],
    creator: companyName,
    icons: {
      icon: fullFaviconUrl,
      shortcut: fullFaviconUrl,
      apple: fullFaviconUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: companyName,
      description: "Powering the World's Favorite Beverage Brands.",
      siteName: companyName,
      images: [
        {
          url: "/assets/Home/logo-white-large.svg", // Ideally use an absolute URL or a specific OG image
          width: 1200,
          height: 630,
          alt: companyName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: companyName,
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
  const extraData = await GetExtraData();
  const globalConfig = extraData?.globalConfig || extraData?.attributes?.globalConfig;

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

  // Dynamic IDs from Strapi extra config
  const googleAnalyticsId = globalConfig?.googleAnalyticsId || SITE_CONFIG.analytics.googleAnalyticsId;
  const metaPixelId = globalConfig?.metaPixelId || SITE_CONFIG.analytics.metaPixelId;
  const customScripts = globalConfig?.customScripts || [];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href={fullFaviconUrl} />
        {/* Render custom head scripts */}
        {customScripts.map((script: any, index: number) => {
          if (script.enabled && script.position === "Head") {
            return renderCustomScript(script.scriptCode, `head-script-${script.id || index}`, false);
          }
          return null;
        })}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Render custom BodyStart scripts */}
        {customScripts.map((script: any, index: number) => {
          if (script.enabled && script.position === "BodyStart") {
            return renderCustomScript(script.scriptCode, `bodystart-script-${script.id || index}`, true);
          }
          return null;
        })}

        <StoreProvider>

          <NavbarServer navbarImage={navbarImage} navbarColor={navbarColor} navbarFontColor={navbarFontColor} />
          {children}
          <Footer
            footerData={footerData}
            socialLinks={socialLinksData}
            footerBgColor={footerBgColor}
          />

          {/* Google Analytics Tracking */}
          {googleAnalyticsId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${googleAnalyticsId}');
                `}
              </Script>
            </>
          )}

          {/* Meta Pixel (Facebook) Tracking */}
          {metaPixelId && (
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
                fbq('init', '${metaPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
          )}
        </StoreProvider>

        {/* Render custom BodyEnd scripts */}
        {customScripts.map((script: any, index: number) => {
          if (script.enabled && script.position === "BodyEnd") {
            return renderCustomScript(script.scriptCode, `bodyend-script-${script.id || index}`, true);
          }
          return null;
        })}
      </body>
    </html>
  );
}

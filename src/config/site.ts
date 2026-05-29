export const SITE_CONFIG = {
  // Company info
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || "The Cloud9 Beverages Company",
  companyEmail: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@cloud9beverages.com",
  companyPhone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Cloud9 Beverages 101, Bhakti Park, R.H.B. Road, Mulund West, Mumbai, Maharashtra - 400080",
  
  // SEO
  defaultKeywords: process.env.NEXT_PUBLIC_DEFAULT_KEYWORDS?.split(",") || [
    "beverages",
    "drinks",
    "refreshment",
    "manufacturing",
    "distribution",
  ],
  
  // Copyright
  copyrightText: process.env.NEXT_PUBLIC_COPYRIGHT || "© 2025 The Cloud9 Beverages Company. All rights reserved.",
  
  // Analytics tracking options
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  },
  
  // Page defaults
  pages: {
    home: {
      title: process.env.NEXT_PUBLIC_HOME_TITLE || "Home",
      description: process.env.NEXT_PUBLIC_HOME_DESCRIPTION || "Experience the refreshing taste of our world-class beverages.",
    },
    about: {
      title: process.env.NEXT_PUBLIC_ABOUT_TITLE || "About Us",
      description: process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION || "Learn about our company, our history, and our mission to refresh the world.",
    },
    brands: {
      title: process.env.NEXT_PUBLIC_BRANDS_TITLE || "Our Brands",
      description: process.env.NEXT_PUBLIC_BRANDS_DESCRIPTION || "Explore our portfolio of world-class beverage brands.",
    },
    contact: {
      title: process.env.NEXT_PUBLIC_CONTACT_TITLE || "Contact Us",
      description: process.env.NEXT_PUBLIC_CONTACT_DESCRIPTION || "Get in touch with us. Find our contact information, location, and send us a message.",
    },
    events: {
      title: process.env.NEXT_PUBLIC_EVENTS_TITLE || "Events",
      description: process.env.NEXT_PUBLIC_EVENTS_DESCRIPTION || "Join us at our events. Stay updated with our latest happenings and community engagements.",
    },
    extension: {
      title: process.env.NEXT_PUBLIC_EXTENSION_TITLE || "Extension",
      description: process.env.NEXT_PUBLIC_EXTENSION_DESCRIPTION || "Explore our extensions and additional offerings.",
    },
    cobranding: {
      title: process.env.NEXT_PUBLIC_COBRANDING_TITLE || "Cobranding",
      description: process.env.NEXT_PUBLIC_COBRANDING_DESCRIPTION || "Partner with us for successful cobranding campaigns.",
    },
    manufacturing: {
      title: process.env.NEXT_PUBLIC_MANUFACTURING_TITLE || "Manufacturing",
      description: process.env.NEXT_PUBLIC_MANUFACTURING_DESCRIPTION || "Learn about our manufacturing processes, facilities, and the high standards we maintain.",
    },
  },
};

# Hardcoded Branding References Analysis

## Overview
This document maps all hardcoded references to "Cloud9", "Coca-Cola", and "Coco Cola" in the codebase. These should be moved to environment variables or configuration files for multi-brand flexibility.

---

## Critical Files with Hardcoded Text

### 1. **app/layout.tsx** (6 references)
**Severity:** CRITICAL - Root layout used on every page

```typescript
// Line 21
default: "The Cloud9 Beverages Company",

// Line 22
template: "%s | The Cloud9 Beverages Company",

// Line 25
keywords: ["beverages", "drinks", "soda", "coca-cola", "refreshment", "cloud9", "manufacturing", "distribution"],

// Line 26
authors: [{ name: "The Cloud9 Beverages Company" }],

// Line 27
creator: "The Cloud9 Beverages Company",

// Line 32
title: "The Cloud9 Beverages Company",

// Line 34
siteName: "The Cloud9 Beverages Company",

// Line 40
alt: "The Cloud9 Beverages Company",

// Line 46
title: "The Cloud9 Beverages Company",
```

**Impact:** Every page inherits these hardcoded values in metadata, social sharing, and SEO.

**Solution:** Move to config file
```typescript
// src/config/site.ts
export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "The Cloud9 Beverages Company",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Experience the refreshing taste of our world-class beverages.",
  keywords: process.env.NEXT_PUBLIC_SITE_KEYWORDS?.split(",") || ["beverages", "drinks", "soda", "refreshment"],
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR || "The Cloud9 Beverages Company",
};
```

Then in layout.tsx:
```typescript
import { SITE_CONFIG } from "@/src/config/site";

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author }],
  // ...
};
```

---

### 2. **app/page.tsx** (Home Page) - 3 references
**Severity:** HIGH

```typescript
// Line 5
import MoreFromCocaCola from "../components/home/MoreFromCocoCola";

// Line 15
title: seo?.metaTitle || "Home | Cloud9 Beverages",

// Line 17
keywords: seo?.keywords || "Cloud9, beverages, refreshing, brands, products, sustainability",

// Line 29
<MoreFromCocaCola data={data.moreFromCocaCola} />
```

**Solution:** Use SITE_CONFIG instead of hardcoding

```typescript
// app/page.tsx
import { SITE_CONFIG } from "@/src/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const strapioutput = await GetHomePageData();
  const seo = strapioutput?.SEO;

  return {
    title: seo?.metaTitle || `Home | ${SITE_CONFIG.name}`,
    description: seo?.metaDescription || "Experience refreshing beverages.",
    keywords: seo?.keywords || SITE_CONFIG.keywords,
  };
}
```

---

### 3. **app/aboutus/page.tsx** - 3 references
**Severity:** HIGH

```typescript
// Line 14
title: seo?.metaTitle || "About Us | Cloud9 Beverages",

// Line 15
description: seo?.metaDescription || "Learn about The Cloud9 Beverages Company, our history, and our mission to refresh the world.",

// Line 16
keywords: seo?.keywords || "about Cloud9, company history, our vision, corporate values, beverage industry",
```

**Solution:** Move defaults to SITE_CONFIG

---

### 4. **app/brands/page.tsx** - 1 reference
**Severity:** MEDIUM

```typescript
// Line 13
title: "Our Brands | Cloud9 Beverages",
```

---

### 5. **app/contactus/page.tsx** - 3 references
**Severity:** HIGH

```typescript
// Line 12
title: seo?.metaTitle || "Contact Us | Cloud9 Beverages",

// Line 13
description: seo?.metaDescription || "Get in touch with The Cloud9 Beverages Company. Find our contact information, location, and send us a message.",

// Line 14
keywords: seo?.keywords || "contact, Cloud9, beverages, inquiry, support",
```

---

### 6. **app/events/page.tsx** - 3 references
**Severity:** HIGH

```typescript
// Line 11
title: seo?.metaTitle || "Events | Cloud9 Beverages",

// Line 12
description: seo?.metaDescription || "Join us at Cloud9 Beverages events. Stay updated with our latest happenings and community engagements.",

// Line 13
keywords: seo?.keywords || "events, Cloud9, beverages, community, happenings",
```

---

### 7. **app/extension/page.tsx** - 3 references
**Severity:** HIGH

```typescript
// Line 11
title: seo?.metaTitle || "Extension | Cloud9 Beverages",

// Line 12
description: seo?.metaDescription || "Explore our extensions and additional offerings at Cloud9 Beverages.",

// Line 13
keywords: seo?.keywords || "extension, Cloud9, beverages, offerings, new products",
```

---

### 8. **app/manufacturing/page.tsx** - 4 references
**Severity:** HIGH

```typescript
// Line 14
title: seo?.metaTitle || "Manufacturing | Cloud9 Beverages",

// Line 15
description: seo?.metaDescription || "Learn about our manufacturing processes, facilities, and the high standards we maintain at Cloud9 Beverages.",

// Line 16
keywords: seo?.keywords || "manufacturing, facilities, Cloud9, beverages, standards, production",

// Line 50
alt: "Cloud9 Beverages"

// Line 64
Marketer Details: Cloud9 Beverages 101, Bhakti Park, R.H.B. Road, Mulund West, Mumbai, Maharashtra - 400080
```

---

### 9. **app/cobranding/page.tsx** - 3 references
**Severity:** MEDIUM

```typescript
// Line 11
title: seo?.metaTitle || "Cobranding | Cloud9 Beverages",

// Line 12
description: seo?.metaDescription || "Partner with Cloud9 Beverages for successful cobranding campaigns and dynamic brand building.",

// Line 13
keywords: seo?.keywords || "cobranding, Cloud9, beverages, partnerships, branding, design",
```

---

### 10. **app/cofilling/_components/hero2.tsx** - 1 reference (Long text block)
**Severity:** MEDIUM

```typescript
// Line 44
"The Cloud9 manufacturing complex is one of the region's most advanced integrated beverage production facilities. The plant operates on 8 high-speed filling lines with a total annual capacity exceeding 6 billion units. Every product passes through more than 100 automated inspection and quality control checkpoints during production. As active beverage brand owners with established products in the market, Cloud9 operates on infrastructure proven by real commercial demand."
```

**Solution:** Move to CMS or config file instead of hardcoding

---

### 11. **app/promos&offers/page.tsx** - 10+ references
**Severity:** MEDIUM (Mostly content from Coca-Cola promotional campaigns)

```typescript
// Line 40
"Coca-Cola Freestyle gives you the freedom to explore, pour, and enjoy your perfect drinks."

// Line 46
"Have you downloaded yet? The +one app brings the universe of Coca-Cola® Into the palm of your hand. Start earning rewards today!"

// Line 57
"New Exhibit at World of Coca-Cola"

// Line 58
"Experience the magic of Coca-Cola's history like never before—step into Coca-Cola Stories at World of Coca-Cola."

// Line 63
"Coca-Cola Refreshing Films"

// Line 64
"Coca-Cola® Refreshing Films provides students the opportunity to create content for the big screen."

// Line 69
"Coca-Cola Vending"

// Line 70
"Each time you make a purchase with your mobile wallet at select Coca-Cola vending machines, you'll be one step closer to earning a drink reward."

// Line 81
"Explore a World of Possibilities with Coca-Cola®"

// Line 84
"Welcome to your one-stop shop for promotions, sweepstakes, and fun across all your favorite Coca-Cola brands."

// Line 226
"Sign up to stay in the loop on promotions, new flavors, exclusive offers and more from the Coca-Cola brands you love."

// Line 249
"Coca-Cola® DAYTONA 500® Flyaway Sweepstakes"

// Line 326
"More from Coca-Cola"
```

**Note:** These appear to be promotional content pulled from Coca-Cola's official campaigns. Should be fetched from Strapi or a content management system rather than hardcoded.

---

### 12. **app/contactus/ContactusClient.tsx** - 1 reference
**Severity:** MEDIUM

```typescript
// Line 486
<h4 className="text-xl font-bold mb-2">Coca-Cola India</h4>
```

**Note:** This appears to be a company name/department reference. If this is dynamic data, it should come from Strapi.

---

### 13. **app/admin/login/page.tsx** - 1 reference (Image alt text)
**Severity:** LOW

```typescript
// Line 62
alt="Coca-Cola"
```

**Solution:** Make dynamic or use generic alt text

---

### 14. **app/admin/portal/page.tsx** - 1 reference (Image alt text)
**Severity:** LOW

```typescript
// Line 22
alt="Coca-Cola"
```

---

### 15. **app/admin/_components/BrandForm.tsx** - 1 reference (Placeholder)
**Severity:** LOW

```typescript
// Line 182
placeholder="e.g. Coca-Cola Zero"
```

---

### 16. **app/admin/_components/StoreForm.tsx** - 1 reference (Placeholder)
**Severity:** LOW

```typescript
// Line 115
placeholder="e.g. Coca-Cola Downtown"
```

---

### 17. **Strapi Backend** - 2 references
**Severity:** MEDIUM

```
types/generated/contentTypes.d.ts:745
Schema.Attribute.DefaultTo<'© 2025 The Cloud9 Beverages Company. All rights reserved.'>

types/generated/contentTypes.d.ts:788
moreFromCocaCola: Schema.Attribute.Component<'page.cardsection', false>
```

**Note:** These are auto-generated from Strapi schemas. Check the Strapi CMS to update the field names and content.

---

## Summary Table

| File | Location | References | Severity | Type |
|------|----------|-----------|----------|------|
| app/layout.tsx | Root metadata | 8 | CRITICAL | Site-wide branding |
| app/page.tsx | Home page | 3 | HIGH | Page metadata |
| app/aboutus/page.tsx | About page | 3 | HIGH | Page metadata |
| app/brands/page.tsx | Brands page | 1 | MEDIUM | Page metadata |
| app/contactus/page.tsx | Contact page | 3 | HIGH | Page metadata |
| app/events/page.tsx | Events page | 3 | HIGH | Page metadata |
| app/extension/page.tsx | Extension page | 3 | HIGH | Page metadata |
| app/manufacturing/page.tsx | Manufacturing page | 4 | HIGH | Page metadata + content |
| app/cobranding/page.tsx | Cobranding page | 3 | MEDIUM | Page metadata |
| app/cofilling/_components/hero2.tsx | Component | 1 | MEDIUM | Long text content |
| app/promos&offers/page.tsx | Promos page | 10+ | MEDIUM | Promotional content |
| app/contactus/ContactusClient.tsx | Component | 1 | MEDIUM | Company reference |
| app/admin/login/page.tsx | Admin page | 1 | LOW | Image alt text |
| app/admin/portal/page.tsx | Admin page | 1 | LOW | Image alt text |
| app/admin/_components/BrandForm.tsx | Component | 1 | LOW | Form placeholder |
| app/admin/_components/StoreForm.tsx | Component | 1 | LOW | Form placeholder |

**Total Hardcoded References: 50+**

---

## Recommended Configuration Structure

Create a centralized config:

```typescript
// src/config/site.ts
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
  
  // Page defaults
  pages: {
    home: {
      title: process.env.NEXT_PUBLIC_HOME_TITLE || "Home",
      description: process.env.NEXT_PUBLIC_HOME_DESCRIPTION || "Experience the refreshing taste of our world-class beverages.",
    },
    about: {
      title: process.env.NEXT_PUBLIC_ABOUT_TITLE || "About Us",
      description: process.env.NEXT_PUBLIC_ABOUT_DESCRIPTION || "Learn about our company.",
    },
    brands: {
      title: process.env.NEXT_PUBLIC_BRANDS_TITLE || "Our Brands",
      description: process.env.NEXT_PUBLIC_BRANDS_DESCRIPTION || "Explore our beverage portfolio.",
    },
    contact: {
      title: process.env.NEXT_PUBLIC_CONTACT_TITLE || "Contact Us",
      description: process.env.NEXT_PUBLIC_CONTACT_DESCRIPTION || "Get in touch with us.",
    },
    manufacturing: {
      title: process.env.NEXT_PUBLIC_MANUFACTURING_TITLE || "Manufacturing",
      description: process.env.NEXT_PUBLIC_MANUFACTURING_DESCRIPTION || "Learn about our facilities.",
    },
    // ... add others
  },
};
```

---

## Environment Variables to Add

```env
# Company Information
NEXT_PUBLIC_COMPANY_NAME=The Cloud9 Beverages Company
NEXT_PUBLIC_COMPANY_EMAIL=info@cloud9beverages.com
NEXT_PUBLIC_COMPANY_PHONE=
NEXT_PUBLIC_COMPANY_ADDRESS=Cloud9 Beverages 101, Bhakti Park, R.H.B. Road, Mulund West, Mumbai, Maharashtra - 400080

# SEO & Branding
NEXT_PUBLIC_DEFAULT_KEYWORDS=beverages,drinks,refreshment,manufacturing,distribution
NEXT_PUBLIC_COPYRIGHT=© 2025 The Cloud9 Beverages Company. All rights reserved.

# Page Titles & Descriptions
NEXT_PUBLIC_HOME_TITLE=Home | The Cloud9 Beverages Company
NEXT_PUBLIC_HOME_DESCRIPTION=Experience the refreshing taste of our world-class beverages.

NEXT_PUBLIC_ABOUT_TITLE=About Us | The Cloud9 Beverages Company
NEXT_PUBLIC_ABOUT_DESCRIPTION=Learn about The Cloud9 Beverages Company, our history, and our mission.

NEXT_PUBLIC_BRANDS_TITLE=Our Brands | The Cloud9 Beverages Company
NEXT_PUBLIC_BRANDS_DESCRIPTION=Explore our portfolio of beverage brands.

NEXT_PUBLIC_CONTACT_TITLE=Contact Us | The Cloud9 Beverages Company
NEXT_PUBLIC_CONTACT_DESCRIPTION=Get in touch with The Cloud9 Beverages Company.

NEXT_PUBLIC_MANUFACTURING_TITLE=Manufacturing | The Cloud9 Beverages Company
NEXT_PUBLIC_MANUFACTURING_DESCRIPTION=Learn about our advanced manufacturing facilities.

NEXT_PUBLIC_EVENTS_TITLE=Events | The Cloud9 Beverages Company
NEXT_PUBLIC_EVENTS_DESCRIPTION=Join us at our events and community engagements.

NEXT_PUBLIC_EXTENSION_TITLE=Extension | The Cloud9 Beverages Company
NEXT_PUBLIC_EXTENSION_DESCRIPTION=Explore our extensions and additional offerings.

NEXT_PUBLIC_COBRANDING_TITLE=Cobranding | The Cloud9 Beverages Company
NEXT_PUBLIC_COBRANDING_DESCRIPTION=Partner with us for successful cobranding campaigns.
```

---

## Implementation Priority

### Phase 1 (Critical)
1. Create `src/config/site.ts`
2. Update `app/layout.tsx` to use config
3. Add all env variables to `.env` and `.env.example`

### Phase 2 (High Priority)
4. Update all page metadata to use config
5. Move long content strings to Strapi or config

### Phase 3 (Medium Priority)
6. Move promotional content to Strapi
7. Make form placeholders dynamic

### Phase 4 (Low Priority)
8. Update image alt texts
9. Clean up unused hardcoded references

---

## Testing Checklist

After implementation:
- [ ] All environment variables load correctly
- [ ] Site title appears correctly on all pages
- [ ] Company name appears correctly in metadata
- [ ] Address displays correctly where needed
- [ ] Copyright text is correct
- [ ] SEO keywords are appropriate
- [ ] Different env files (dev/staging/prod) load different configs
- [ ] No console warnings about missing env vars
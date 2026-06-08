# Cloud9 Beverages - Comprehensive Image Dimensions & Specifications Guide

This document is a technical guide for content creators, designers, and administrators managing assets in Strapi or uploading image assets directly to the codebase. It details the required aspect ratios, container sizes, CSS fit styles, and recommended upload resolutions for every section of the application.

---

## Understanding Next.js `<Image>` & CSS Layouts

To ensure images "fit" without breaking layouts:
1. **`object-cover`** (Default for banners/cards): Aspect ratio is preserved. Excess borders are cropped dynamically depending on the screen size. *Recommended content layout: Keep the main subject centered.*
2. **`object-contain`** (Default for logos/product packs): The entire image is visible without cropping. Gaps are left on the sides if ratios do not match.
3. **`object-fill`** (Avoid unless specified): Image is forced to stretch or squash to fit the exact width/height of the container.

---

## Table of Contents
1. [Global Elements (Nav & Footer)](#1-global-elements-nav--footer)
2. [Home Page (/)](#2-home-page-)
3. [Explore Brands Page (/brands)](#3-explore-brands-page-brands)
4. [Brand Details Page (/brands/[slug])](#4-brand-details-page-brandsslug)
5. [Product Details Page (/brands/[slug]/[productSlug])](#5-product-details-page-brandsslugproductslug)
6. [About Us Page (/aboutus)](#6-about-us-page-aboutus)
7. [Promotions & Offers Page (/promos&offers)](#7-promotions--offers-page-promosoffers)
8. [Co-Filling Page (/cofilling)](#8-co-filling-page-cofilling)
9. [Manufacturing Page (/manufacturing)](#9-manufacturing-page-manufacturing)
10. [Co-Branding Page (/cobranding)](#10-co-branding-page-cobranding)
11. [Events & Gallery Pages (/events)](#11-events--gallery-pages-events)
12. [Become Our Distributor Page (/become-our-distributor)](#12-become-our-distributor-page-become-our-distributor)

---

## 1. Global Elements (Nav & Footer)

Used across all standard customer-facing pages.

### Navbar Logo
* **Associated Code:** [Navbar.tsx](file:///d:/the-cocacola/components/layout/Navbar.tsx)
* **Visual Size (Desktop):** 125px x 43px (approx. 3:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **250px x 86px** (Transparent PNG)

### Footer Logo
* **Associated Code:** [Footer.tsx](file:///d:/the-cocacola/components/layout/Footer.tsx)
* **Visual Size (Desktop):** 125px x 43px (approx. 3:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **250px x 86px** (Transparent PNG)

---

## 2. Home Page (/)
* **Associated Code:** [page.tsx](file:///d:/the-cocacola/app/page.tsx)

### Hero Section Banners
* **Associated Code:** [Hero.tsx](file:///d:/the-cocacola/components/home/Hero.tsx)
* **Container Size:**
  * **Desktop:** 1232px (width) x 570px (height) (approx. 2.16:1 / wide banner ratio)
  * **Mobile:** 100vw x 500px (approx. 2:3 vertical layout)
* **Fit Mode:** `object-cover`
* **Recommended Uploads:**
  * **Desktop Banner:** **1920px x 900px** (Landscape, subject centered)
  * **Mobile Banner:** **1000px x 1500px** (Portrait, subject centered)

### Promos & Offers Cards
* **Associated Code:** [Promos&Offers.tsx](file:///d:/the-cocacola/components/home/Promos%26Offers.tsx)
* **Container Size:**
  * **Desktop:** 604px (width) x 430px (height) (approx. 1.4:1 or 4:3 ratio)
  * **Mobile:** 85vw x 250px (approx. 4:3 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1200px x 900px** (4:3 Aspect Ratio)

### Features Section Cards
* **Associated Code:** [Features.tsx](file:///d:/the-cocacola/components/home/Features.tsx)
* **Container Size:**
  * **Desktop:** 660px (width) x 540px (height) (approx. 11:9 ratio)
  * **Mobile:** 100vw x 400px (approx. 1:1 ratio)
* **Fit Mode:** `object-contain` (Will show full image without cropping, with letterbox margin if ratio differs)
* **Recommended Upload:** **1320px x 1080px** (11:9 Aspect Ratio)

### More From Cloud9 (MoreFromCloud9 Carousel)
* **Associated Code:** [MoreFromCloud9.tsx](file:///d:/the-cocacola/components/home/MoreFromCloud9.tsx)
* **Container Size:**
  * **Desktop:** 376px (width) x 250px (height) (3:2 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1200px x 800px** (3:2 Aspect Ratio, subject centered)

### Explore Brands Section Cards
* **Associated Code:** [ExploreBrands.tsx](file:///d:/the-cocacola/components/home/ExploreBrands.tsx)
* **Container Size:** 230px (width) x 230px (height) (with padding)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **600px x 400px** or **500px x 500px** (Centered transparent logo)

---

## 3. Explore Brands Page (/brands)
* **Associated Code:** [BrandsPage](file:///d:/the-cocacola/app/brands/page.tsx)

### Brand Logo Cards
* **Container Size:** Same as Explore Brands Home section (230px height, variable responsive width).
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **600px x 400px** (Centered transparent brand logo)

---

## 4. Brand Details Page (/brands/[slug])
* **Associated Code:** [BrandDetailPage](file:///d:/the-cocacola/app/brands/[slug]/page.tsx)

### Gallery Banner Carousel (BrandImageCarousel)
* **Associated Code:** [BrandImageCarousel.tsx](file:///d:/the-cocacola/app/brands/[slug]/_components/BrandImageCarousel.tsx)
* **Container Size:**
  * **Desktop:** 1150px (width) x 575px (height) (2:1 ratio)
  * **Mobile:** 100vw (minus padding) x aspect-[2/1] (2:1 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **2300px x 1150px** (2:1 Aspect Ratio, subject centered)

### Product Cards
* **Container Size:** Grid columns (1:1 Square card with padding)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **800px x 800px** (Transparent product pack/bottle shot, square canvas)

---

## 5. Product Details Page (/brands/[slug]/[productSlug])
* **Associated Code:** [ProductDetailPage](file:///d:/the-cocacola/app/brands/[slug]/[productSlug]/page.tsx)

### Header Brand Logo Icon
* **Container Size:** 48px x 48px (1:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **200px x 200px** (Square transparent logo icon)

### Product Image Gallery Carousel (ProductImageCarousel)
* **Associated Code:** [ProductImageCarousel.tsx](file:///d:/the-cocacola/app/brands/[slug]/[productSlug]/_components/ProductImageCarousel.tsx)
* **Container Size:**
  * **Desktop:** 544px (width) x 544px (height) (1:1 ratio)
  * **Mobile:** 100vw x 350px (approx. 1:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **1088px x 1088px** (High-quality square transparent PNG of product packaging)

### Store / Buy Now Carousel Cards (StoreCarousel)
* **Associated Code:** [StoreCarousel.tsx](file:///d:/the-cocacola/app/brands/[slug]/[productSlug]/_components/StoreCarousel.tsx)
* **Container Size:**
  * **Desktop:** 286px (width) x 200px (height) (approx. 4:3 ratio)
  * **Mobile:** 216px (width) x 120px (height) (approx. 9:5 ratio)
* **Fit Mode:** `object-cover` *(Note: Since store logos are covers, ensure they have sufficient padding around the text).*
* **Recommended Upload:** **600px x 450px** (4:3 Aspect Ratio, store logo centered with generous safety margins)

---

## 6. About Us Page (/aboutus)
* **Associated Code:** [AboutUsPage](file:///d:/the-cocacola/app/aboutus/page.tsx)

### Hero Banner Background
* **Container Size:**
  * **Desktop:** 100vw x 500px (wide banner layout)
  * **Mobile:** 100vw x 400px (1:1 layout)
* **Fit Mode:** `object-cover md:object-fit`
* **Recommended Upload:** **1920px x 700px** (Landscape background banner)

### MainPage Card Cards (Mainpage_aboutus)
* **Associated Code:** [Mainpage_aboutus.tsx](file:///d:/the-cocacola/app/aboutus/_components/Mainpage_aboutus.tsx)
* **Container Size:**
  * **Desktop:** 660px (width) x 540px (height) (11:9 ratio)
  * **Mobile:** 100vw x 400px (1:1 ratio)
* **Fit Mode:** `object-fill`  
  > [!WARNING]
  > Because this uses `object-fill`, any uploaded image **will stretch or squash** if it does not match the exact proportions. You must upload images exactly at **11:9** ratio for desktop or **1:1** for mobile.
* **Recommended Upload:** **1320px x 1080px** (11:9 aspect ratio exactly)

### Related Content Cards
* **Container Size:** 350px (width) x 200px (height) (approx. 16:9 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1200px x 675px** (16:9 aspect ratio)

---

## 7. Promotions & Offers Page (/promos&offers)
* **Associated Code:** [PromosAndOffersPage](file:///d:/the-cocacola/app/promos%26offers/page.tsx)

### Sweeps Hero-like Banner
* **Container Size:** 1232px (width) x 570px (height)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1920px x 900px** (Landscape, text overlay covers left/bottom, main artwork on right)

### Card Grid & More from Coca-Cola Carousel Cards
* **Container Size:** 357px (width) x 277px (height) (approx. 1.3:1 or 4:3 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1200px x 900px** (4:3 aspect ratio)

---

## 8. Co-Filling Page (/cofilling)
* **Associated Code:** [CofillingPage](file:///d:/the-cocacola/app/cofilling/page.tsx)

### Hero Section (Main Video & Logo)
* **Associated Code:** [CofillingHero](file:///d:/the-cocacola/app/cofilling/_components/hero.tsx)
* **Background Video:** `/assets/Coffiling_page/main_video.webm` (Recommended format: 1920 x 1080 WebM, compressed, under 10MB)
* **Hell Logo:** 250px (width) x 120px (height) (approx. 2:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **500px x 240px** (Transparent PNG)

### Hero 2 (BG Texture & Square Grid)
* **Associated Code:** [CofillingHero2](file:///d:/the-cocacola/app/cofilling/_components/hero2.tsx)
* **BG Texture:** `/assets/Coffiling_page/annie-spratt-6a3nqQ1YwBw-unsplash-.png`
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **1920px x 1080px** (Slight overlay texture)
* **Grid Cards:** Square aspect ratio.
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **800px x 800px** (Square photos)

### About Us Section (Factory BG & HELL Logo)
* **Associated Code:** [CofillingAboutUs](file:///d:/the-cocacola/app/cofilling/_components/aboutus.tsx)
* **BG Factory Image:** `/assets/Coffiling_page/pexels-cottonbro-studio-5532660-1.png`
  * **Visual Container Size:** 100vw x 923px
  * **Fit Mode:** `md:object-fill object-cover`
  * **Recommended Upload:** **1920px x 923px**
* **Cofilling Logo:** 365px (width) x 211px (height) (approx. 1.73:1 or 16:9)
  * **Fit Mode:** `object-contain`
  * **Recommended Upload:** **730px x 422px** (Transparent PNG)

### What We Do - Products Subsection
* **Associated Code:** [WhatWeDoProduct](file:///d:/the-cocacola/app/cofilling/_components/_components_what_we_do/product.tsx)
* **BG Portfolio Image:** `/assets/Coffiling_page/zygra_ENERGY_DRINK_portfolio-1.png`
  * **Visual Container Size:** 100vw x 813px
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **1920px x 813px**

### What We Do - Individual Product Layouts (ProductComponent)
* **Associated Code:** [WhatWeDoProductComponent](file:///d:/the-cocacola/app/cofilling/_components/_components_what_we_do/__components/product_componet.tsx)
* **Section BG Image:** 100vw x 750px
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **1920px x 750px**
* **Product Can/Bottle Image:**
  * **Visual Size (Desktop):** 450px (width) x 600px (height) (3:4 aspect ratio)
  * **Fit Mode:** `object-contain`
  * **Recommended Upload:** **900px x 1200px** (High resolution transparent PNG of the can/bottle pack)
* **Feature Icons:** 16px x 16px visual size inside a rounded box.
  * **Fit Mode:** `object-contain invert`
  * **Recommended Upload:** **128px x 128px** (Square white transparent icon)

### What We Do - Packaging Subsection
* **Associated Code:** [WhatWeDoPackaging](file:///d:/the-cocacola/app/cofilling/_components/_components_what_we_do/packaging.tsx)
* **BG Packaging Image:** `/assets/Coffiling_page/BG1-4.png`
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **1920px x 1080px**
* **Can Sizes Image:** `/assets/Coffiling_page/250ml330ml500ml_CANs-copy-1.png`
  * **Recommended Size:** **500px x 130px** (Landscape 3-cans rendering)
* **Multipacks Images:** (4pack, 6pack, 8pack)
  * **Recommended Size:** **400px x 400px** (Square rendering)
* **Can Design Images:** (Cans + tab rings)
  * **Cans:** **300px x 130px**
  * **Tabs:** **150px x 130px**
* **Trays Images:** (3-tray mockup sizes)
  * **Recommended Size:** **200px x 130px** (Landscape mockup)
* **Transportation Pallet / Displays:**
  * **Pallet CHEP/DD:** **120px x 160px** (3:4 ratio)
  * **Display:** **80px x 160px** (1:2 ratio)

### What We Do - Logistics Subsection
* **Associated Code:** [WhatWeDoLogistics](file:///d:/the-cocacola/app/cofilling/_components/_components_what_we_do/logistics.tsx)
* **BG Logistics Image:** `/assets/Coffiling_page/DJI_0145_black-white-1.png`
  * **Fit Mode:** `object-cover`
  * **Recommended Upload:** **1920px x 800px**
* **Logistics Card Diagrams:**
  * **Standard items (can/pallet/tray):** **300px x 300px** (Square visual)
  * **Truck item (`id === "4"`):** **400px x 200px** (Landscape diagram)

---

## 9. Manufacturing Page (/manufacturing)
* **Associated Code:** [ManufacturingPage](file:///d:/the-cocacola/app/manufacturing/page.tsx)

### Header Logo
* **Visual Size (Desktop):** 140px x 60px (approx. 2.33:1 ratio)
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **280px x 120px** (Transparent logo ending)

---

## 10. Co-Branding Page (/cobranding)
* **Associated Code:** [CobrandingComponent.tsx](file:///d:/the-cocacola/app/cobranding/CobrandingComponent.tsx)

### Card 1 & Card 2 Partner Logos
* **Visual Size:** Height constrained, centered.
* **Fit Mode:** `object-contain mix-blend-multiply`
* **Recommended Upload:** **600px x 400px** (Logo on white background or transparent)

---

## 11. Events & Gallery Pages (/events)

### Event List Cards
* **Associated Code:** [EventComponent](file:///d:/the-cocacola/app/events/_components/event.tsx)
* **Visual Container Size:** aspect-video w-full (16:9 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **1200px x 675px** (16:9 aspect ratio)

### Event Gallery Grid Thumbnails
* **Associated Code:** [EventGalleryCarousel.tsx](file:///d:/the-cocacola/app/events/_components/EventGalleryCarousel.tsx)
* **Visual Container Size:** Grid column aspect-square (1:1 ratio)
* **Fit Mode:** `object-cover`
* **Recommended Upload:** **800px x 800px** (Square thumbnails)

### Event Gallery Carousel Slide Media
* **Visual Container Size:** h-full max-h-[90vh] full overlay mode
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **1920px** (on its longest dimension to avoid blurriness on full-screen displays)

---

## 12. Become Our Distributor Page (/become-our-distributor)
* **Associated Code:** [DistributorClientView.tsx](file:///d:/the-cocacola/app/become-our-distributor/_components/DistributorClientView.tsx)

### Header & Footer Distributor Logos
* **Visual Size:** 110px to 120px width.
* **Fit Mode:** `object-contain`
* **Recommended Upload:** **240px x 80px** (Transparent PNG logo)

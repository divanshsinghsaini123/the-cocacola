# 📸 Image & Video Upload Guidelines (Strapi)

To ensure the website looks perfect across all devices (mobile, tablet, desktop) without stretched or poorly cropped images, please follow these explicit layout rules when uploading assets into Strapi.

---

## 🥤 1. Products (Bottles, Cans, Packages)
**CSS Rule Used:** `aspect-square` with `object-contain`
* **Orientation:** Perfect Square **(1:1 Ratio)**.
* **Size Recommendation:** `1080 x 1080 pixels`.
* **Details:** The system forces product cards into a square. Always upload a `.PNG` file with a transparent background. Make sure the bottle/can is perfectly centered so that all products look uniform in size when displayed side-by-side in the grid.

## 🖼️ 2. Brand Banners (Top Carousel on Brand Pages)
**CSS Rule Used:** `aspect-[2/1]` with `object-cover`
* **Orientation:** Extra Wide Rectangle **(2:1 Ratio)**.
* **Size Recommendation:** `2000 x 1000 pixels` (or `1200 x 600 pixels`).
* **Details:** This area is panoramic. If you upload a square image, the website will ruthlessly slice off the top and bottom of the image to force it into the panoramic box!

## 🗓️ 3. Event Gallery Grid (Instagram-Style Box)
**CSS Rule Used:** `aspect-square` with `object-cover`
* **Orientation:** Perfect Square **(1:1 Ratio)**.
* **Size Recommendation:** `1080 x 1080 pixels`.
* **Details:** If you upload a standard wide photo here, the website will automatically chop off the left and right edges. Keep the most important visual focus directly in the center of the photo.

## 🌟 4. Hero Backgrounds
**CSS Rule Used:** Full Screen `object-cover`
* **Orientation:** Standard Widescreen **(16:9 Ratio)**.
* **Size Recommendation:** `1920 x 1080 pixels`.
* **Details:** Because these act as the background for entire pages, they will completely fill the screen. On mobile phones (which are tall), the sides of the image will be trimmed off. Always ensure faces, text, or key visuals are strictly in the center.

## 🎯 5. Logos & Small Icons (Navbar, Footer, Brand Emblems)
**CSS Rule Used:** `object-contain`
* **Orientation:** Any (Extremely Flexible).
* **Size Recommendation:** Standard web logo sizes (e.g. `300 x 100 pixels` or similar).
* **Details:** You can upload horizontal, vertical, or perfectly square logos here. The website will automatically scale them down flawlessly to fit exactly inside the navigation and footer bars. 

---

## 🎥 6. Video Upload Guidelines

### YouTube Videos (For "Follow The Bottle" Carousels)
* **Orientation:** Standard Website **(16:9 Ratio)**.
* **Details:** Simply paste the raw YouTube URL (`https://youtube.com/watch?v=...`) directly into Strapi. The system automatically fetches YouTube's native `hqdefault.jpg` fallback thumbnail, so you never have to manually upload a generic thumbnail for the carousel!

### Native MP4 Videos (For Hover Effects & Moving Backgrounds)
* **Orientation:** `object-cover` (Fills the screen).
* **Details:** Since these videos heavily impact the loading speed of your site, please extensively compress them before uploading them into Strapi. We recommend keeping them under **5MB to 8MB** and exclusively in `.MP4` format for maximum browser compatibility. Like Hero Images, keep the primary subject in the dead-center.

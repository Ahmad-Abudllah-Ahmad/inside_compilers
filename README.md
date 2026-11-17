# Inside Compilers — Web Development & Automation Agency

This project merges the complete brand, projects, services, about content, and assets of **[Inside Compilers](https://inside-compilers.vercel.app/)** into the exact layout, styling, and interactive GSAP / Lenis / Lottie / DrawSVG animations of the local studio template.

## What Was Merged & Customized

1. **Custom Vector SVG Logos (`INSIDE COMPILERS`)**:
   - **Full-Page Loader SVG (`.two26-logo-svg`)**: Custom `<path>` vector outlines for `IN` + `SIDE` and `COMP` + `ILERS` generated directly from `MDNichromeTest-Bold.woff`, preserving the 6-path serpentine ribbon `DrawSVG` and elastic pop-in timeline (`initTwo26PageLoader`).
   - **Navbar & Contact Drawer Logos (`.navbar-logo`, `.navbar-logo-contact`)**: Crisp vector `<path>` outlines of `INSIDE COMPILERS`.
   - **FAQ Badge Logo (`.faq-logo-svg`)**: Custom `IC` vector monogram.
   - **Elastic Footer Logo (`.footer-svg-logo`)**: Full-width `INSIDE COMPILERS` vector `<path>` that stretches and bounces elastically on scroll (`initTwo26FooterAnimation`).
   - **Favicons & Badges**: Custom `IC` favicons (`32x32` to `512x512`) and `1000×1000` project monogram badges (`/assets/images/ic_logo_*.png`).

2. **All Content & Assets from `inside-compilers.vercel.app`**:
   - **Home ([index.html](./index.html))**:
     - Hero (`TRANSFORMING IDEAS INTO REALITY`, `Digital Solutions`, `Web Dev & AI`, `Since 2023`) and curved SVG marquee (`WEB DEVELOPMENT • AUTOMATION • AI INTEGRATION • DIGITAL SOLUTIONS •`).
     - Pinned About scroll sequence (`ABOUT INSIDE COMPILERS`, `Next.js & React`, `AI Integration`, `Custom Automation`).
     - Showcase Marquee combining the background video loops with Inside Compilers project photography.
     - Featured Projects (`AI SCHOOL LMS`, `DAILY DELI CO`, `I. FRAGRANCES`, `BRAIN TUMOR AI`, `ESS LGS SYSTEM`, `CHUGTAI MEDICAL POS`) with local images and hover states.
     - Scroll-driven SVG Path Services (`WHAT WE BUILD`: `Web Development`, `Automation Solutions`, `AI Integration`, `Custom AI Models`, `E-Commerce Platforms`, `Enterprise Systems`, `Cloud & Architecture`) with Lottie animations.
     - Stacked Client Success Stories, 10 tailored FAQs, Contact Drawer (`inside.compiler@gmail.com`), and Animated Footer.
   - **About ([about/index.html](./about/index.html))**:
     - Inside Compilers' story (`Started in 2019`, `150+ Projects & R&D Innovation Lab`), team (`Ahmad Abdullah Ahmad`, `Engineering Core`, `AI Innovation Lab`), 4 Core Values (`Innovation First`, `Relentless Excellence`, `True Partnership`, `Measurable Impact`), and 25 tech/capability pills.
   - **Work ([work/index.html](./work/index.html)) & All 8 Case Studies (`/work/*`)**:
     - Full portfolio showcase and detailed case studies for `AI-Integrated School Management System`, `Daily Deli Co`, `I. Fragrances`, `Brain Tumor Masking & AI Diagnosis`, `ESS LGS`, `Chugtai Medical Store POS`, `Fourty1 & Mega Mall E-Commerce`, and `Crush Confessions`.

## Running Locally

```bash
npm start
# or
node server.js
```

Then open **http://localhost:3000** in your browser.

# Inside Compiler — 2026 Motion Portfolio

A cutting-edge portfolio website featuring advanced GSAP animations, smooth scrolling, and cinematic page transitions. Built with Next.js, TypeScript, and a comprehensive motion system inspired by the latest GSAP effects.

## ✨ Features

### 🎭 Advanced Motion Effects
- **Smooth Fullscreen Navigation** - GSAP-powered menu with staggered reveals and gradient drift
- **3D Scatter Animation** - Project grid items explode into 3D space and reassemble on scroll
- **Elastic Text Stretching** - Headlines with SplitText that stretch and snap back on hover
- **Scroll-Hijacked Video** - Video playback controlled by scroll position with progress indicators
- **Layer Peel Parallax** - Multi-layer parallax with different speeds and depth effects
- **Cinematic Page Transitions** - Zoom-warp and overlay morphing between pages
- **Interactive Footer** - Content compression with counter-rotating background stripes
- **Magnetic Cursor** - Elements attracted to cursor with smooth physics
- **Fluid Spotlight** - Dynamic cursor spotlight with blend modes
- **Animated Cards Exit** - Cards tilt and slide out as they leave viewport

### 🎨 Design System
- **Dark Cinematic Theme** - Professional color palette with neon accents
- **Fluid Typography** - Responsive text scaling with clamp functions
- **CSS Custom Properties** - 2026-grade CSS with @property animations
- **Gradient Animations** - Dynamic background gradients with noise overlay
- **Glow Effects** - Subtle outer glows on interactive elements

### 🚀 Performance & Accessibility
- **Smooth Scrolling** - Lenis integration with 60fps performance
- **Reduced Motion Support** - Respects prefers-reduced-motion settings
- **Mobile Optimized** - Touch-friendly interactions and responsive design
- **Code Splitting** - Dynamic imports for heavy animation libraries
- **SEO Optimized** - Proper metadata and semantic HTML

### 📱 Responsive Design
- **Mobile-First** - Optimized for all device sizes
- **Touch Interactions** - Alternative interactions for touch devices
- **Graceful Degradation** - Complex effects disabled on low-end devices
- **Progressive Enhancement** - Core functionality works without JavaScript

## 🛠 Tech Stack

### Core Framework
- **Next.js 15** - App Router with TypeScript
- **React 19** - Latest React features
- **Tailwind CSS 4** - Utility-first styling with design tokens

### Motion Libraries
- **GSAP** - Professional animations with ScrollTrigger, SplitText
- **Lenis** - Smooth scrolling with momentum
- **Framer Motion** - React animation library for UI states
- **React Spring** - Physics-based micro-interactions
- **Barba.js** - Page transition handling

### Development
- **TypeScript** - Type safety and developer experience
- **ESLint** - Code quality and consistency
- **CSS Custom Properties** - Modern CSS with @property support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inside-compiler
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout with motion providers
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles and design tokens
├── components/
│   ├── nav/                # Navigation components
│   │   ├── header.tsx      # Sticky header with hide/show
│   │   └── menu-overlay.tsx # Fullscreen navigation menu
│   ├── sections/           # Page sections
│   │   ├── hero-section.tsx         # Hero with SplitText and parallax
│   │   ├── services-section.tsx     # Animated service cards
│   │   ├── projects-section.tsx     # Filterable project grid
│   │   ├── scroll-video-section.tsx # Video scrubbing section
│   │   ├── about-section.tsx        # Timeline and stats
│   │   ├── contact-section.tsx      # Contact form with validation
│   │   └── interactive-footer.tsx   # Breaking scroll norms footer
│   ├── ui/                 # Reusable UI components
│   │   ├── cursor-spotlight.tsx     # Custom cursor
│   │   ├── scroll-progress.tsx      # Page progress indicator
│   │   └── project-card.tsx         # Interactive project cards
│   └── providers/          # Context providers
│       └── motion-provider.tsx      # Motion system initialization
├── lib/                    # Utility libraries
│   ├── gsap.ts            # GSAP configuration and helpers
│   ├── lenis.ts           # Smooth scrolling setup
│   ├── barba.ts           # Page transition system
│   └── cms.ts             # Content management utilities
└── public/                # Static assets
    ├── images/            # Project images
    └── videos/            # Video assets
```

## 🎮 Motion System

### GSAP Helpers

The motion system includes reusable GSAP helpers:

```typescript
import { gsapHelpers } from '@/lib/gsap';

// Split text reveal
gsapHelpers.splitReveal(element, {
  stagger: 0.1,
  yStart: 100,
  ease: 'back.out(1.7)'
});

// Elastic text effect
const elastic = gsapHelpers.elasticText(element);
elastic.stretch(); // On hover
elastic.snap();    // On leave

// 3D scatter animation
const scatter = gsapHelpers.scatterGrid(container, 0.8, 300);
scatter.scatter(); // Explode items
scatter.gather();  // Reassemble items

// Magnetic attraction
gsapHelpers.magnetic(element, 80, 0.3);
```

### Motion Tokens

Consistent animation values defined in CSS custom properties:

```css
:root {
  --duration-xs: 0.18s;
  --duration-sm: 0.28s;
  --duration-md: 0.45s;
  --duration-lg: 0.75s;
  --duration-xl: 1.2s;
  
  --ease-power3: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-back: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## 🎨 Design Tokens

### Color System
```css
:root {
  --background: #0A0A0C;     /* Deep dark background */
  --surface: #111216;        /* Card/surface color */
  --text: #E6E7EB;          /* Primary text */
  --text-secondary: #B2B6C3; /* Secondary text */
  
  /* Neon Accent Palette */
  --accent-cyan: #23D1F8;    /* Primary accent */
  --accent-purple: #9F6BFF;  /* Secondary accent */
  --accent-lime: #9BFF4D;    /* Tertiary accent */
}
```

### Typography
- **Display Font**: Space Grotesk (headings)
- **Body Font**: Inter (content)
- **Fluid Scale**: clamp() functions for responsive sizing

## 🔧 Customization

### Adding New Projects

Edit `src/lib/cms.ts` to add project data:

```typescript
export const projects: Project[] = [
  {
    id: 'your-project',
    title: 'Project Title',
    category: 'Web Development',
    description: 'Project description...',
    image: '/images/project-cover.jpg',
    tags: ['Next.js', 'TypeScript'],
    metrics: { performance: '98%', users: '1000+' }
  }
];
```

### Motion Effects

Customize animations by modifying the GSAP helpers in `src/lib/gsap.ts` or create new ones following the existing patterns.

### Design System

Update design tokens in `src/app/globals.css` under the `:root` selector and `@theme` directive.

## 📊 Performance

### Optimization Features
- **Code Splitting** - Motion libraries loaded dynamically
- **Image Optimization** - Next.js Image component with responsive sizing
- **Font Loading** - Optimized Google Fonts loading
- **CSS Optimization** - Purged unused styles
- **Bundle Analysis** - Webpack bundle analyzer integration

### Performance Targets
- **Lighthouse Performance**: ≥90 (mobile)
- **Accessibility**: ≥95
- **Best Practices**: ≥95
- **SEO**: ≥95
- **LCP**: <2.5s (4G)
- **JavaScript Bundle**: <300KB gzipped

## 🌐 Browser Support

### Desktop
- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Mobile
- iOS Safari 14+
- Chrome Android 88+
- Samsung Internet 15+

### Progressive Enhancement
- **CSS Grid**: Graceful fallback to flexbox
- **CSS Custom Properties**: Fallback values provided
- **View Transitions API**: Fallback to GSAP transitions
- **Scroll Timeline**: Fallback to ScrollTrigger

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
```bash
npm run build
npm start
```

The site is statically generated and works on any hosting platform that supports Node.js or static files.

## 🎯 Acceptance Criteria

✅ **All GSAP Reference Effects Implemented**
- Fullscreen Navigation with GSAP timeline
- 3D Scatter Scroll animation 
- Animated Cards Exit behavior
- Elastic Text stretching effect
- Video Scrub with scroll control
- Layer Peel/Unlock parallax
- Cinematic Page Transitions
- Interactive Footer finale
- Carousel with SplitText
- Parallax Zoom scrolling
- Fluid Mouse/Spotlight cursor
- Magnetic button attractions

✅ **Technical Requirements Met**
- Next.js App Router with TypeScript
- Dark cinematic theme
- Responsive design (xs-4k breakpoints)
- Lenis smooth scrolling
- ScrollTrigger integration
- Reduced motion support
- Performance optimization
- SEO metadata
- Accessibility features

✅ **Motion System Architecture**
- Reusable GSAP helpers
- Motion tokens and design system
- Client-side motion providers
- Page transition system
- Cleanup on route changes

## 📝 License

This project is for demonstration purposes. Please respect GSAP's licensing requirements for commercial use.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch  
5. Open a Pull Request

---

**Built with ❤️ using Next.js, GSAP, and modern web technologies**

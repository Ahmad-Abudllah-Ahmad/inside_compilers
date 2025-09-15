import { gsap } from 'gsap';
import { gsapHelpers } from '@/components/motion/gsap-helpers';

// Barba.js configuration for cinematic page transitions
export class PageTransitions {
  private static instance: PageTransitions;
  private isTransitioning = false;

  static getInstance(): PageTransitions {
    if (!PageTransitions.instance) {
      PageTransitions.instance = new PageTransitions();
    }
    return PageTransitions.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Use View Transitions API if supported, otherwise use GSAP
    if ('startViewTransition' in document) {
      this.initViewTransitions();
    } else {
      this.initGSAPTransitions();
    }
  }

  private initViewTransitions() {
    // Modern browser View Transitions API
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (this.isTransitioning) {
          e.preventDefault();
          return;
        }

        const href = (link as HTMLAnchorElement).href;
        if (window.location.href === href) return;

        e.preventDefault();
        this.performViewTransition(href);
      });
    });
  }

  private async performViewTransition(url: string) {
    this.isTransitioning = true;

    try {
      const transition = document.startViewTransition(async () => {
        await this.updateDOM(url);
      });

      await transition.finished;
    } catch (error) {
      // Fallback to normal navigation
      window.location.href = url;
    } finally {
      this.isTransitioning = false;
    }
  }

  private initGSAPTransitions() {
    // GSAP-based transitions for older browsers
    const links = document.querySelectorAll('a[href^="/"]');
    
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (this.isTransitioning) {
          e.preventDefault();
          return;
        }

        const href = (link as HTMLAnchorElement).href;
        if (window.location.href === href) return;

        e.preventDefault();
        this.performGSAPTransition(href, link as HTMLElement);
      });
    });
  }

  private async performGSAPTransition(url: string, triggerElement: HTMLElement) {
    this.isTransitioning = true;

    // Create transition overlay
    const overlay = this.createTransitionOverlay();
    document.body.appendChild(overlay);

    // Get trigger position for zoom-warp effect
    const rect = triggerElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Set overlay initial position
    gsap.set(overlay, {
      scale: 0,
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
    });

    // Exit animation
    await this.exitAnimation(overlay);

    // Clean up current page
    gsap.killTweensOf("*");

    // Update DOM
    await this.updateDOM(url);

    // Enter animation
    await this.enterAnimation(overlay);

    // Clean up
    overlay.remove();
    this.isTransitioning = false;

    // Re-initialize motion system - simplified
    this.reinitializeEffects();
  }

  private createTransitionOverlay(): HTMLElement {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #0A0A0C 0%, #111216 50%, #0A0A0C 100%);
      z-index: 10000;
      pointer-events: none;
    `;
    return overlay;
  }

  private exitAnimation(overlay: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      // Zoom-warp expansion
      tl.to(overlay, {
        scale: Math.max(window.innerWidth, window.innerHeight) / 100,
        duration: 0.6,
        ease: 'power2.inOut',
      });

      // Add glitch effect
      tl.to(overlay, {
        scaleX: 1.02,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
      }, '-=0.3');
    });
  }

  private enterAnimation(overlay: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      // Reveal new content
      tl.to(overlay, {
        scale: 0,
        duration: 0.8,
        ease: 'expo.out',
      });
    });
  }

  private async updateDOM(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Parse new document
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      
      // Update title
      document.title = newDoc.title;
      
      // Update main content (assuming it's in a main element or specific container)
      const oldMain = document.querySelector('main') || document.querySelector('[data-barba="container"]');
      const newMain = newDoc.querySelector('main') || newDoc.querySelector('[data-barba="container"]');
      
      if (oldMain && newMain) {
        oldMain.innerHTML = newMain.innerHTML;
      }

      // Update URL
      history.pushState({}, '', url);
      
    } catch (error) {
      console.error('Failed to update DOM:', error);
      // Fallback to normal navigation
      window.location.href = url;
    }
  }

  private reinitializeEffects() {
    // Reinitialize any page-specific effects
    // This will be called after each transition
    const event = new CustomEvent('page:loaded');
    document.dispatchEvent(event);
  }
}

// Initialize page transitions
export const initPageTransitions = () => {
  if (typeof window !== 'undefined') {
    const transitions = PageTransitions.getInstance();
    transitions.init();
  }
};

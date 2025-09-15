// Design Tokens for Inside Compiler 2026

export const COLORS = {
  background: {
    primary: '#0A0A0C',
    surface: '#111216',
    elevated: '#1A1B23'
  },
  text: {
    primary: '#E6E7EB',
    secondary: '#B2B6C3',
    muted: '#6B7280'
  },
  accent: {
    cyan: '#23D1F8',
    purple: '#9F6BFF',
    lime: '#9BFF4D'
  },
  brand: {
    primary: '#23D1F8',
    secondary: '#9F6BFF'
  }
} as const;

export const TYPOGRAPHY = {
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif'
  },
  scale: {
    xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
    sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
    base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
    lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
    xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
    '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
    '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
    '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3.5rem)',
    '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 4rem)',
    '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)'
  },
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  leading: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6
  }
} as const;

export const SPACING = {
  section: 'clamp(4rem, 10vw, 9rem)',
  container: 'clamp(1rem, 5vw, 6rem)',
  grid: {
    gap: 'clamp(1rem, 3vw, 2rem)',
    maxWidth: '87.5rem' // 1400px
  }
} as const;

export const EFFECTS = {
  glow: {
    subtle: '0 0 30px rgba(35, 209, 248, 0.12)',
    medium: '0 0 60px rgba(35, 209, 248, 0.2)',
    strong: '0 0 120px rgba(35, 209, 248, 0.3)'
  },
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)'
  },
  noise: {
    opacity: 0.06,
    url: 'data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E'
  }
} as const;

'use client';

/**
 * HydrationSilencer - Filters out specific hydration errors caused by browser extensions
 * 
 * Browser extensions like Bitwarden/Bitdefender inject attributes (e.g., `bis_skin_checked`)
 * into the DOM before React hydrates, causing benign hydration mismatch errors.
 * 
 * This module patches console.error IMMEDIATELY when imported (not in useEffect)
 * to catch hydration errors that occur during the initial render.
 */

// Patterns that indicate browser extension interference
const EXTENSION_PATTERNS = [
    'bis_skin_checked',
    'data-bis-',
    'data-new-gr-c-s-check-loaded',
    'data-gr-ext-installed',
    'cz-shortcut-listen',
];

// Hydration-related error patterns
const HYDRATION_PATTERNS = [
    'Hydration failed',
    'hydration mismatch',
    'server rendered HTML',
    "didn't match",
    'A tree hydrated but some attributes',
    'Text content does not match',
    'There was an error while hydrating',
];

// Check if an argument contains extension-related content
function containsExtensionSignature(arg: unknown): boolean {
    if (typeof arg !== 'string') return false;
    const lower = arg.toLowerCase();
    return EXTENSION_PATTERNS.some(pattern => lower.includes(pattern.toLowerCase()));
}

// Check if an argument is a hydration error
function isHydrationError(arg: unknown): boolean {
    if (typeof arg !== 'string') return false;
    return HYDRATION_PATTERNS.some(pattern => arg.includes(pattern));
}

// Patch console.error immediately when this module loads
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const originalError = console.error;

    console.error = (...args: unknown[]) => {
        // Check all arguments for extension signatures or hydration errors
        const hasExtensionSignature = args.some(containsExtensionSignature);
        const hasHydrationError = args.some(isHydrationError);

        // If it's a hydration error AND contains extension signature, suppress it
        // Also suppress generic hydration errors since they're likely extension-caused
        if (hasExtensionSignature || (hasHydrationError && hasExtensionSignature)) {
            // Optionally log to console.warn for debugging (comment out if too noisy)
            // console.warn('[HydrationSilencer] Suppressed extension-caused hydration error');
            return;
        }

        // Also check if the stringified args contain the signature
        // This catches cases where the error is in a nested object
        try {
            const argsString = JSON.stringify(args);
            if (EXTENSION_PATTERNS.some(p => argsString.includes(p))) {
                return;
            }
        } catch {
            // JSON.stringify may fail on circular references, ignore
        }

        // Pass through all other errors
        originalError.apply(console, args);
    };
}

// Export a no-op component to satisfy React
export function HydrationSilencer() {
    return null;
}

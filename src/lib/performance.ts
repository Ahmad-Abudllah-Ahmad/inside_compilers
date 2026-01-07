// Performance detection utilities for optimizing rendering on different devices

export interface DeviceCapabilities {
    isLowEndDevice: boolean;
    isMobile: boolean;
    hasReducedMotion: boolean;
    maxDPR: number;
    shouldDisableWebGL: boolean;
    shouldReduceAnimations: boolean;
    gpuTier: 'low' | 'medium' | 'high';
}

// Cache the result to avoid repeated checks
let cachedCapabilities: DeviceCapabilities | null = null;

export function detectDeviceCapabilities(): DeviceCapabilities {
    if (cachedCapabilities) return cachedCapabilities;

    if (typeof window === 'undefined') {
        // SSR fallback - assume medium device
        return {
            isLowEndDevice: false,
            isMobile: false,
            hasReducedMotion: false,
            maxDPR: 2,
            shouldDisableWebGL: false,
            shouldReduceAnimations: false,
            gpuTier: 'medium'
        };
    }

    // Check for reduced motion preference
    const hasReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Check if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth < 768;

    // Check device memory (if available)
    const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
    const lowMemory = deviceMemory < 4;

    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency ?? 4;
    const lowCores = cores < 4;

    // Check connection speed
    const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
    const slowConnection = connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g';

    // Calculate GPU tier based on available info
    let gpuTier: 'low' | 'medium' | 'high' = 'medium';

    // Try to detect GPU
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                const rendererLower = renderer.toLowerCase();

                // Low-end GPU indicators
                if (rendererLower.includes('intel') &&
                    (rendererLower.includes('hd') || rendererLower.includes('uhd')) &&
                    !rendererLower.includes('iris')) {
                    gpuTier = 'low';
                } else if (rendererLower.includes('mali') ||
                    rendererLower.includes('adreno 3') ||
                    rendererLower.includes('adreno 4') ||
                    rendererLower.includes('powervr')) {
                    gpuTier = 'low';
                } else if (rendererLower.includes('nvidia') ||
                    rendererLower.includes('amd') ||
                    rendererLower.includes('radeon') ||
                    rendererLower.includes('apple')) {
                    gpuTier = 'high';
                }
            }
        }
    } catch {
        // WebGL not available or error
        gpuTier = 'low';
    }

    // Determine if low-end device
    const isLowEndDevice = lowMemory || lowCores || gpuTier === 'low' || slowConnection;

    // Should disable WebGL on very low-end devices
    const shouldDisableWebGL = (lowMemory && lowCores) || (isMobile && gpuTier === 'low');

    // Should reduce animations
    const shouldReduceAnimations = hasReducedMotion || isLowEndDevice;

    // Calculate max DPR based on device capabilities
    let maxDPR = window.devicePixelRatio || 1;
    if (isLowEndDevice) maxDPR = Math.min(maxDPR, 1);
    else if (isMobile) maxDPR = Math.min(maxDPR, 1.5);
    else maxDPR = Math.min(maxDPR, 2);

    cachedCapabilities = {
        isLowEndDevice,
        isMobile,
        hasReducedMotion,
        maxDPR,
        shouldDisableWebGL,
        shouldReduceAnimations,
        gpuTier
    };

    return cachedCapabilities;
}

// Hook for React components
import { useState, useEffect } from 'react';

export function useDeviceCapabilities(): DeviceCapabilities {
    const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => ({
        isLowEndDevice: false,
        isMobile: false,
        hasReducedMotion: false,
        maxDPR: 2,
        shouldDisableWebGL: false,
        shouldReduceAnimations: false,
        gpuTier: 'medium'
    }));

    useEffect(() => {
        setCapabilities(detectDeviceCapabilities());
    }, []);

    return capabilities;
}

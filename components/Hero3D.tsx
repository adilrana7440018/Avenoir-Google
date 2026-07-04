'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Lazy load the R3F Canvas component to keep initial JS bundle small and avoid SSR issues
const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => <CanvasLoadingSkeleton />,
});

// A clean loading state matching the Soft Aura color space
function CanvasLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[450px] flex items-center justify-center bg-bg-elevated/50 border border-border-subtle rounded-3xl animate-pulse">
      <span className="text-xs font-mono tracking-widest text-text-secondary">
        COMPILING 3D ORBITAL ASSETS...
      </span>
    </div>
  );
}

// 2D fallback component in case WebGL is disabled or crashes
function WebGLFallback() {
  return (
    <div className="w-full h-full min-h-[350px] md:min-h-[450px] relative bg-bg-surface border border-border-subtle rounded-3xl overflow-hidden shadow-sm flex items-center justify-center p-6">
      {/* Decorative Aura background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#E0E7FF_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#CCFBF1_0%,transparent_60%)] animate-pulse" />
      
      {/* 2D shapes representing the 3D items */}
      <div className="relative flex items-center gap-6 justify-center">
        <div className="w-24 h-24 rounded-full bg-accent-primary opacity-20 blur-xl absolute -translate-x-12" />
        <div className="w-20 h-20 rounded-full bg-accent-primary border border-accent-primary/20 shadow-md flex items-center justify-center text-accent-primary">
          <span className="w-6 h-6 rounded-full bg-white/40 border border-white/60 animate-ping" />
        </div>
        <div className="w-16 h-16 rounded-xl bg-accent-secondary border border-accent-secondary/20 shadow-sm rotate-12 flex-shrink-0" />
      </div>
      
      <span className="absolute bottom-4 text-[9px] font-mono tracking-widest text-text-tertiary">
        2D VECTOR SYSTEM ACTIVE [WEBGL_FALLBACK]
      </span>
    </div>
  );
}

export default function Hero3D() {
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Check WebGL availability on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGLSupported(support);
    } catch (e) {
      setWebGLSupported(false);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <ErrorBoundary fallback={<WebGLFallback />}>
        {webGLSupported ? (
          <Suspense fallback={<CanvasLoadingSkeleton />}>
            <Hero3DCanvas />
          </Suspense>
        ) : (
          <WebGLFallback />
        )}
      </ErrorBoundary>
    </div>
  );
}

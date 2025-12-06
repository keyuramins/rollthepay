"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface AdSenseAdProps {
  /**
   * Ad slot ID from Google AdSense
   * Format: numbers like "3972064826"
   */
  adSlot: string;
  /**
   * Ad format - responsive by default
   */
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "autorelaxed" | "fluid";
  /**
   * Ad layout (for in-article ads)
   */
  layout?: "in-article";
  /**
   * Whether to use full-width responsive
   */
  fullWidthResponsive?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Optional label for accessibility
   */
  "aria-label"?: string;
  /**
   * Optional ID for the ad container
   */
  id?: string;
  /**
   * Additional inline styles
   */
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseAd({ 
  adSlot, 
  format = "auto",
  layout,
  fullWidthResponsive = true,
  className,
  "aria-label": ariaLabel = "Advertisement",
  id,
  style
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const hasInitialized = useRef(false);

  const initializeAd = useCallback(() => {
    // Prevent double initialization
    if (hasInitialized.current) return;
    
    try {
      // Ensure window exists
      if (typeof window === "undefined") return;
      
      // Ensure the element exists
      if (!adRef.current) return;
      
      // Initialize adsbygoogle array if it doesn't exist
      if (!window.adsbygoogle) {
        window.adsbygoogle = [];
      }
      
      // Push empty object to initialize the ad
      window.adsbygoogle.push({});
      hasInitialized.current = true;
    } catch (err) {
      console.error("AdSense initialization error:", err);
    }
  }, []);

  useEffect(() => {
    // Wait for both the script and the element to be ready
    const tryInitialize = () => {
      if (window.adsbygoogle && adRef.current && !hasInitialized.current) {
        initializeAd();
        return true;
      }
      return false;
    };

    // Try immediately if both are ready
    if (tryInitialize()) return;

    // If script is not loaded, wait for it
    if (!window.adsbygoogle) {
      let retries = 0;
      const maxRetries = 100; // 10 seconds max
      
      const checkInterval = setInterval(() => {
        retries++;
        if (tryInitialize() || retries >= maxRetries) {
          clearInterval(checkInterval);
          if (retries >= maxRetries && !hasInitialized.current) {
            console.warn("AdSense script failed to load within timeout");
          }
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    // If element is not ready, wait a bit and try again
    const elementTimer = setTimeout(() => {
      tryInitialize();
    }, 100);

    return () => clearTimeout(elementTimer);
  }, [initializeAd, adSlot]);

  return (
    <div 
      id={id}
      className={cn(
        "w-full flex justify-center items-center",
        className
      )}
      aria-label={ariaLabel}
      role="region"
    >
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{
          display: "block",
          width: "100%",
          maxWidth: "100%",
          ...style
        }}
        data-ad-client="ca-pub-4388164731251182"
        data-ad-slot={adSlot}
        data-ad-format={format}
        {...(fullWidthResponsive && { "data-full-width-responsive": "true" })}
        {...(layout && { "data-ad-layout": layout })}
      ></ins>
    </div>
  );
}

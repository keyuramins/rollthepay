"use client";

import { useEffect, useRef } from "react";
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
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseAd({ 
  adSlot, 
  format = "auto",
  className,
  "aria-label": ariaLabel = "Advertisement",
  id
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Wait for AdSense script to load
    if (hasInitialized.current) return;
    
    const initializeAd = () => {
      if (typeof window !== "undefined" && window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
          hasInitialized.current = true;
        } catch (err) {
          console.error("AdSense initialization error:", err);
        }
      }
    };

    // Check if script is already loaded
    if (window.adsbygoogle) {
      initializeAd();
    } else {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.adsbygoogle) {
          clearInterval(checkInterval);
          initializeAd();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }, []);

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
        }}
        data-ad-client="ca-pub-4388164731251182"
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

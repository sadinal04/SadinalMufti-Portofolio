"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

export default function TransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathname = usePathname();

  // Animation OUT: Reveal the new page (Bubble sweeps UP and vanishes)
  useEffect(() => {
    if (!pathRef.current || !overlayRef.current) return;
    
    // Using a 100x100 viewBox makes the animation immune to screen resize or scroll bugs
    const filledPath = `M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z`;
    
    // As it sweeps up, the bottom edge curves downwards due to inertia
    const bubbleAwayPath = `M 0 0 Q 50 0 100 0 L 100 0 Q 50 150 0 0 Z`;
    
    // Flattens out at the top
    const emptyTopPath = `M 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z`;
    
    // Handle hidden scroll state for returning to specific sections
    if (pathname === "/") {
      const scrollTarget = sessionStorage.getItem('scrollTarget');
      if (scrollTarget) {
        sessionStorage.removeItem('scrollTarget');
        // Instantly scroll before the page reveals
        setTimeout(() => {
          const el = document.querySelector(scrollTarget);
          if (el) el.scrollIntoView();
        }, 50); // slight delay to ensure DOM is ready
      }
    }
    
    gsap.set(overlayRef.current, { display: "block" });
    gsap.set(pathRef.current, { attr: { d: filledPath } });
    
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, { display: "none" });
      }
    });
    
    // Bottom edge bubbles up
    tl.to(pathRef.current, {
      attr: { d: bubbleAwayPath },
      duration: 0.5,
      ease: "power2.in"
    });
    
    // Flattens out at the top
    tl.to(pathRef.current, {
      attr: { d: emptyTopPath },
      duration: 0.4,
      ease: "power2.out"
    });
    
  }, [pathname]);

  // Animation IN: Cover the current page (Bubble sweeps UP from bottom)
  useEffect(() => {
    const handlePageOut = (e: any) => {
      const { href, router } = e.detail;
      
      // Start completely empty at the bottom
      const emptyBottomPath = `M 0 100 Q 50 100 100 100 L 100 100 Q 50 100 0 100 Z`;

      // Top edge bubbles UP massively while corners are still at the bottom
      const bubbleUpPath = `M 0 100 Q 50 -50 100 100 L 100 100 Q 50 100 0 100 Z`;

      // Screen fully covered
      const filledPath = `M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z`;

      gsap.set(overlayRef.current, { display: "block" });
      gsap.set(pathRef.current, { attr: { d: emptyBottomPath } });

      const tl = gsap.timeline({
        onComplete: () => {
          // Navigate once the screen is fully pitch black
          router.push(href);
        }
      });

      // Top middle surges upwards
      tl.to(pathRef.current, {
        attr: { d: bubbleUpPath },
        duration: 0.5,
        ease: "power2.in"
      });

      // Top corners catch up, filling the screen
      tl.to(pathRef.current, {
        attr: { d: filledPath },
        duration: 0.4,
        ease: "power2.out"
      });
    };

    window.addEventListener("page-transition-out", handlePageOut);
    return () => window.removeEventListener("page-transition-out", handlePageOut);
  }, []);

  return (
    <div 
      ref={overlayRef} 
      className="fixed left-0 top-0 w-full h-[100vh] z-[999] pointer-events-none hidden"
    >
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref={pathRef} className="fill-[#1C1D20]" />
      </svg>
    </div>
  );
}

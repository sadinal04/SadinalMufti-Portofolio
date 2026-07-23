"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const stopScroll = () => lenis.stop();
    const startScroll = () => lenis.start();
    
    window.addEventListener("stop-scroll", stopScroll);
    window.addEventListener("start-scroll", startScroll);

    return () => {
      window.removeEventListener("stop-scroll", stopScroll);
      window.removeEventListener("start-scroll", startScroll);
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  return children ? <>{children}</> : null;
}

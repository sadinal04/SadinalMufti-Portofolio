"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Text reveal
    tl.fromTo(
      textRefs.current,
      { yPercent: 100 },
      { yPercent: 0, duration: 1.2, stagger: 0.1, delay: 0.2 }
    );

    // Infinite Marquee Slider using GSAP
    let xPercent = 0;
    let direction = -1;

      const animateSlider = () => {
        if (!sliderRef.current) return;
        if (xPercent < -50) { // Reset point is exactly at 50% of the container (which equals 1 block)
          xPercent = 0;
        } else if (xPercent > 0) {
          xPercent = -50;
        }
        gsap.set(sliderRef.current, { xPercent: xPercent });
        xPercent += 0.015 * direction;
        requestAnimationFrame(animateSlider);
      };
      requestAnimationFrame(animateSlider);

    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (e) => {
        direction = e.direction === 1 ? -1 : 1;
      }
    });

    // Parallax background
    const bg = container.current?.querySelector('[data-speed="0.5"]');
    if (bg) {
      gsap.to(bg, {
        y: "30%",
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, { scope: container });

  const addToRefs = (el: HTMLSpanElement | null) => {
    if (el && !textRefs.current.includes(el)) {
      textRefs.current.push(el);
    }
  };

  return (
    <section id="hero" ref={container} className="relative h-screen w-full bg-[#1C1D20] overflow-hidden text-[#E3E3E3]">
      
      {/* Parallax Background Image */}
      <div className="absolute inset-0 z-0" data-speed="0.5">
        <Image src="/background_4.png" alt="Hero Background" fill sizes="100vw" priority className="object-cover" quality={100} />
      </div>

      {/* Main Content Wrapper (Middle of the screen) */}
      <div className="absolute top-[40%] sm:top-[50%] -translate-y-1/2 w-full px-4 sm:px-12 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center left-0 right-0 gap-16 sm:gap-0">
        {/* Left: Main Typography */}
        <div className="flex flex-col relative z-10 pl-2 sm:pl-8">
          {/* Arrow */}
          <div className="mb-4 sm:mb-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="7" x2="17" y2="17"></line>
              <polyline points="8 17 17 17 17 8"></polyline>
            </svg>
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Data Analyst</span>
            </h1>
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Data Scientist</span>
            </h1>
            <h1 className="font-inter text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Machine Learning Engineer</span>
            </h1>
          </div>
        </div>

        {/* Right: Location Widget (The Black Pill) */}
        <div className="flex bg-[#1C1D20] rounded-l-full rounded-r-none p-2 pl-2 pr-8 sm:pr-12 items-center gap-6 shadow-2xl relative z-10 transition-transform origin-right hover:scale-105 duration-300 self-end sm:self-auto -mr-4 sm:-mr-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#999999] relative flex items-center justify-center transition-all duration-500">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
          <p 
            className="text-right text-sm sm:text-base font-medium leading-tight text-[#E3E3E3]"
            dangerouslySetInnerHTML={{ __html: t('hero.location') }}
          />
        </div>
      </div>

      {/* Sliding Marquee (Absolute Bottom of Screen, Massive text) */}
      <div className="absolute bottom-2 sm:bottom-6 left-0 w-full z-20 flex pointer-events-none overflow-hidden">
        <div ref={sliderRef} className="flex whitespace-nowrap text-[15vw] sm:text-[12vw] font-medium tracking-tighter leading-none text-white drop-shadow-2xl relative">
          <div className="flex shrink-0">
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
          </div>
          <div className="flex shrink-0">
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
            <p className="pr-12">Sadinal Mufti —</p>
          </div>
        </div>
      </div>
    </section>
  );
}

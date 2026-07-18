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
      <div className="absolute top-[40%] md:top-[50%] -translate-y-1/2 w-full px-4 sm:px-8 md:px-12 z-10 flex flex-col md:flex-row justify-between items-start md:items-center left-0 right-0 gap-16 md:gap-0">
        {/* Left: Main Typography */}
        <div className="flex flex-col relative z-10 md:pl-8">
          {/* Arrow */}
          <div className="mb-4 md:mb-6">
            <svg className="w-10 h-10 md:w-12 md:h-12 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="7" x2="17" y2="17"></line>
              <polyline points="8 17 17 17 17 8"></polyline>
            </svg>
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-inter text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Data Analyst</span>
            </h1>
            <h1 className="font-inter text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Data Scientist</span>
            </h1>
            <h1 className="font-inter text-3xl sm:text-4xl md:text-3xl lg:text-5xl font-medium leading-[1.2] tracking-tight text-white">
              <span ref={addToRefs} className="inline-block">Machine Learning Engineer</span>
            </h1>
          </div>
        </div>

        {/* Right: Location Widget (The Black Pill) */}
        <div className="flex bg-[#1C1D20] rounded-l-full rounded-r-none p-2 pl-2 pr-6 md:pr-12 items-center gap-4 md:gap-6 shadow-2xl relative z-10 transition-transform origin-right hover:scale-105 duration-300 self-end md:self-auto md:-mr-12">
          <div className="w-12 h-12 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#999999] relative flex items-center justify-center transition-all duration-500">
            <svg 
              className="w-6 h-6 md:w-10 md:h-10 text-white" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#globeClip)">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="white" />
              </g>
              <defs>
                <clipPath id="globeClip">
                  <path fill="white" d="M0 0h16v16H0z" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <p 
            className="text-right text-xs md:text-base font-medium leading-tight text-[#E3E3E3]"
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

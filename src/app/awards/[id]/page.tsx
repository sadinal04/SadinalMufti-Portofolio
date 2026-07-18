"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPortfolioData } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable, ScrollTrigger);
}

export default function AwardDetail() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const container = useRef<HTMLDivElement>(null);

  const award = portfolioData.awards.find((a) => a.id === params.id);
  
  // Ensure the images array has enough items to cover ultra-wide screens for a seamless GSAP loop
  const minItems = 6;
  let repeatedImages = [...(award?.images || [])];
  if (repeatedImages.length > 0) {
    while (repeatedImages.length < minItems) {
      repeatedImages = [...repeatedImages, ...(award?.images || [])];
    }
  }

  const descriptionText = (award as any)?.fullDesc || award?.description || "";
  const paragraphs = descriptionText.split('\n\n').filter((p: string) => p.trim() !== "");

  useGSAP(() => {
    if (container.current) {
      gsap.fromTo(
        ".reveal-element",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );

      // Animate each story paragraph independently on scroll
      const storyParagraphs = gsap.utils.toArray(".story-paragraph");
      storyParagraphs.forEach((para: any) => {
        gsap.fromTo(para,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: para,
              start: "top 90%", // Reveal when it's 10% up from the bottom
            }
          }
        );
      });

      // Deck of Cards (Applied to all awards)
      ScrollTrigger.create({
        trigger: ".narrative-container",
        start: "top 75%", // Starts earlier
        end: "top 15%",   // Ends much quicker (highly sensitive)
        scrub: 1, // smooth scrubbing
        animation: gsap.timeline()
          .to(".card-0", { rotation: -22, x: -70, y: 40 }, 0)
          .to(".card-1", { rotation: 0, x: 0, y: -20 }, 0)
          .to(".card-2", { rotation: 22, x: 70, y: 40 }, 0)
      });

      gsap.fromTo(
        ".gallery-container",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 }
      );

      const marquee = document.querySelector(".gallery-marquee") as HTMLElement;
      const marqueeContainer = document.querySelector(".gallery-container") as HTMLElement;
      const proxy = document.createElement("div");
      let marqueeTween: gsap.core.Tween;

      if (!marquee || !marqueeContainer) return;

      const handleMouseEnter = () => marqueeTween?.pause();
      const handleMouseLeave = () => {
        if (Draggable.get(proxy)?.isPressed) return;
        marqueeTween?.play();
      };

      marqueeContainer.addEventListener("mouseenter", handleMouseEnter);
      marqueeContainer.addEventListener("mouseleave", handleMouseLeave);

      const buildMarquee = () => {
        // Kill existing instances to prevent conflicts
        if (marqueeTween) marqueeTween.kill();
        const existingDrag = Draggable.get(proxy);
        if (existingDrag) existingDrag.kill();

        // Temporarily reset x to 0 to get the true, unshifted scrollWidth
        gsap.set(marquee, { x: 0 });
        
        const wrapWidth = marquee.scrollWidth / 2;
        
        // If images haven't loaded yet, wrapWidth will be very small.
        if (wrapWidth < 100) return; 

        const speedPixelsPerSecond = 50; 
        const calculatedDuration = wrapWidth / speedPixelsPerSecond;
        
        marqueeTween = gsap.fromTo(marquee, 
          { x: 0 },
          {
            x: -wrapWidth,
            ease: "none",
            duration: calculatedDuration,
            repeat: -1
          }
        );

        Draggable.create(proxy, {
          type: "x",
          trigger: marqueeContainer,
          onPressInit: function() {
            marqueeTween.pause();
            const currentX = gsap.getProperty(marquee, "x") as number;
            gsap.set(this.target, { x: currentX });
            this.update();
          },
          onDrag: function() {
            const wrappedX = gsap.utils.wrap(-wrapWidth, 0, this.x);
            gsap.set(marquee, { x: wrappedX });
            
            const progress = Math.abs(wrappedX) / wrapWidth;
            marqueeTween.progress(progress);
          },
          onRelease: function() {
            if (!marqueeContainer.matches(':hover')) {
              marqueeTween.play();
            }
          }
        });
      };

      // Watch for image loads / window resizes that change the marquee width
      const ro = new ResizeObserver(() => {
        buildMarquee();
      });
      ro.observe(marquee);

      return () => {
        ro.disconnect();
        marqueeContainer.removeEventListener("mouseenter", handleMouseEnter);
        marqueeContainer.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, { scope: container });

  if (!award) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#E3E3E3] text-[#1C1D20]">
        <h1 className="text-4xl font-bold mb-4">Award Not Found</h1>
        <button onClick={() => router.push("/")} className="underline text-lg">Back to Home</button>
      </div>
    );
  }

  return (
    <main ref={container} className="w-full min-h-screen bg-[#E3E3E3] text-[#1C1D20] flex flex-col pt-20 pb-16 overflow-hidden">
      
      {/* Content Wrapper with Padding */}
      <div className="max-w-screen-2xl mx-auto w-full mt-4 px-4 sm:px-12">
        
        {/* Editorial Layout: Sticky Title + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 relative">
          
          {/* Left Column: Sticky Title & Summary */}
          <div className="lg:col-span-5 flex flex-col gap-4 items-start relative">
            <div className="sticky top-24 flex flex-col gap-8 w-full pr-4">
              <div className="flex flex-col gap-4">
                <h3 className="reveal-element text-sm font-semibold uppercase tracking-[0.2em] text-[#1C1D20]/50">
                  {award.event}
                </h3>
                <h1 className="reveal-element text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tighter uppercase w-full">
                  {award.title}
                </h1>
              </div>

              {/* Editorial Summary / Pull Quote */}
              <div className="reveal-element pl-6 border-l-2 border-[#1C1D20]/20 max-w-md mt-2">
                <p className="text-lg font-medium text-[#1C1D20]/70 leading-relaxed">
                  {award.description}
                </p>
              </div>

              {/* Deck of Cards Interactive Element */}
              <div className="deck-of-cards-container reveal-element mt-16 hidden lg:flex justify-center relative w-full h-64 perspective-[1200px]">
                <div className="relative w-48 h-64">
                  {repeatedImages.slice(0, 3).map((img, i) => (
                    <div 
                      key={i} 
                      className={`card-${i} absolute inset-0 w-48 h-64`}
                      style={{ zIndex: 3 - i, transformOrigin: "bottom center" }}
                    >
                      <div className="w-full h-full rounded-xl shadow-xl border-[6px] border-white overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] grayscale-[50%] opacity-90 hover:grayscale-0 hover:opacity-100 hover:scale-[1.15] hover:-translate-y-4 hover:-rotate-3 hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] cursor-pointer">
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="gallery-preview" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-10 pt-4 lg:pt-16 narrative-container">
            {paragraphs.map((para: string, index: number) => (
              <p 
                key={index}
                className={`story-paragraph text-lg sm:text-xl font-light leading-relaxed text-[#1C1D20]/90 text-justify ${
                  index === 0 ? "first-letter:text-8xl first-letter:font-bold first-letter:text-[#1C1D20] first-letter:mr-3 first-letter:float-left first-letter:leading-[0.85] first-letter:mt-2" : ""
                }`}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Gallery - FULL BLEED */}
      <div className="w-full flex flex-col gap-8 mt-12">
        <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-12">
          <h2 className="reveal-element text-2xl font-medium tracking-tight border-b border-[#1C1D20]/10 pb-4">
            {t('awards.doc_gallery')}
          </h2>
        </div>
        
        {/* GSAP Marquee Container (No padding, touches screen edges) */}
        <div className="gallery-container w-full overflow-hidden pb-12 cursor-grab active:cursor-grabbing">
            <div className="gallery-marquee flex w-max">
              {/* Block 1 (Original, expanded to fill screen) */}
              <div className="marquee-block flex gap-6 pr-6">
                {repeatedImages.map((imgSrc, index) => (
                  <div 
                    key={`original-${index}`} 
                    className="flex-shrink-0 relative overflow-hidden rounded-xl shadow-md flex items-center justify-center hover:scale-[1.08] hover:shadow-2xl hover:z-10 transition-all duration-500"
                    style={{ backgroundColor: award.color, height: "380px" }}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${award.title} Documentation ${index}`} 
                      className="h-full w-auto object-contain p-4" 
                    />
                  </div>
                ))}
              </div>
              {/* Block 2 (Duplicate for Seamless Loop) */}
              <div className="marquee-block flex gap-6 pr-6">
                {repeatedImages.map((imgSrc, index) => (
                  <div 
                    key={`duplicate-${index}`} 
                    className="flex-shrink-0 relative overflow-hidden rounded-xl shadow-md flex items-center justify-center hover:scale-[1.08] hover:shadow-2xl hover:z-10 transition-all duration-500"
                    style={{ backgroundColor: award.color, height: "380px" }}
                  >
                    <img 
                      src={imgSrc} 
                      alt={`${award.title} Documentation ${index}`} 
                      className="h-full w-auto object-contain p-4" 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

    </main>
  );
}

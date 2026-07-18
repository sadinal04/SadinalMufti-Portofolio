"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPortfolioData } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal animation for rows
    const rows = gsap.utils.toArray('.skill-row');
    
    rows.forEach((row: any, i) => {
      gsap.fromTo(
        row,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
          }
        }
      );
    });
    
    // Reveal animation for the title
    gsap.fromTo(
      ".skills-title",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".skills-title",
          start: "top 90%",
        }
      }
    );
  }, { scope: container });

  return (
    <section ref={container} className="w-full bg-white text-[#1C1D20] pt-12 sm:pt-20 pb-[50vh] sm:pb-[30vh] px-4 sm:px-12 relative z-20">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col">
        
        {/* Header */}
        <div className="skills-title w-full border-b border-[#1C1D20]/20 pb-4 mb-12 flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-widest uppercase">
            {language === 'id' ? 'Keahlian & Teknologi' : 'Skills & Tech Stack'}
          </h2>
        </div>

        {/* List Layout (Brutalist Table Style matching reference) */}
        <div className="flex flex-col w-full border-t border-[#1C1D20]/20">
          {(Array.isArray(portfolioData.skills) ? portfolioData.skills : []).map((skillGroup, index) => (
            <div 
              key={index} 
              className="skill-row group flex flex-col lg:flex-row items-start lg:items-center py-0.5 sm:py-1 border-b border-[#1C1D20]/20 hover:bg-[#1C1D20] transition-colors duration-300 cursor-default"
            >
              {/* Number Column */}
              <div className="w-full lg:w-[10%] mb-2 lg:mb-0 px-4">
                <span className="text-xs font-mono text-[#1C1D20]/40 group-hover:text-white transition-colors duration-300">
                  ({String.fromCharCode(97 + index)}.)
                </span>
              </div>

              {/* Category Column */}
              <div className="w-full lg:w-[30%] mb-4 lg:mb-0 px-4">
                <span className="text-sm sm:text-base font-bold font-mono tracking-wider text-[#1C1D20]/80 group-hover:text-white transition-colors duration-300">
                  {skillGroup.category}
                </span>
              </div>
              
              {/* Items Column (Comma separated) */}
              <div className="w-full lg:w-[60%] px-4 text-left lg:text-right">
                <p className="text-xs sm:text-sm font-mono font-medium tracking-wider text-[#1C1D20]/70 leading-tight group-hover:text-white transition-colors duration-300">
                  {skillGroup.items.join(', ')}
                </p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}

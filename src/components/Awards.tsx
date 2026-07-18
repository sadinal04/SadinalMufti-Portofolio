"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getPortfolioData } from "@/data/portfolio";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const AwardCard = ({ award, onClick, t }: { award: any, onClick: () => void, t: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && award.images && award.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % award.images.length);
      }, 400); // Fast slideshow interval
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, award.images]);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="award-card group cursor-pointer flex flex-col"
    >
      {/* Premium Card with Fixed Frame */}
      <div 
        className="w-full aspect-[4/3] sm:aspect-[16/11] relative flex items-center justify-center p-8 sm:p-16 mb-6 overflow-hidden rounded-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ backgroundColor: award.color }}
      >
        <div className="relative w-full h-full shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-md overflow-hidden group-hover:scale-[1.05] group-hover:shadow-[0_40px_70px_rgba(0,0,0,0.3)]">
          {award.images && award.images.length > 0 ? (
            award.images.map((src: string, idx: number) => (
              <Image 
                key={idx}
                src={src} 
                alt={`${award.title} - ${idx}`}
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={idx === 0}
                className={`object-cover absolute inset-0 transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${idx === currentImageIndex ? 'opacity-100 scale-100 group-hover:scale-[1.03]' : 'opacity-0 scale-95 z-[-1]'}`}
              />
            ))
          ) : (
            <Image 
              src={award.coverImage!} 
              alt={award.title}
              fill 
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
            />
          )}
        </div>

        {/* Floating Action Pill */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/95 backdrop-blur-md text-[#1C1D20] text-sm font-bold tracking-widest uppercase rounded-full shadow-2xl opacity-0 translate-y-10 transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2 z-20">
          {t('awards.read_story')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
      
      {/* Meta Information */}
      <div className="flex flex-col">
        <h4 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 flex items-center gap-2 transition-colors duration-300 group-hover:text-[#455CE9]">
          {award.title}
          <span className="opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">↗</span>
        </h4>
        <p className="text-sm sm:text-base font-medium text-[#1C1D20]/60 mb-3 uppercase tracking-wider">
          {award.event}
        </p>
        <p className="text-base sm:text-lg font-light leading-relaxed text-[#1C1D20]/80 transition-opacity duration-300 group-hover:opacity-70">
          {award.description}
        </p>
      </div>
    </div>
  );
};

// A micro-component for the Hacker Glitch Effect on Hover
const CertRow = ({ cert }: { cert: any }) => {
  const { t } = useLanguage();
  const [displayText, setDisplayText] = useState(cert.name);
  const intervalRef = useRef<any>(null);

  const startGlitch = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText((prev: string) => 
        cert.name.split("").map((letter: string, index: number) => {
          // Keep spaces intact to avoid layout shifts
          if (letter === " ") return " ";
          if (index < iteration) return cert.name[index];
          const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (iteration >= cert.name.length) clearInterval(intervalRef.current);
      iteration += 1; // Speed of decode
    }, 25);
  };

  const stopGlitch = () => {
    clearInterval(intervalRef.current);
    setDisplayText(cert.name);
  };

  return (
    <a 
      href={cert.link || "#"}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      className="cert-item group relative flex flex-col justify-center py-6 sm:py-8 border-b border-[#1C1D20]/10 overflow-hidden cursor-pointer"
    >
      {/* Background Hover Effect: Matrix Grid */}
      <div className="absolute inset-0 bg-[#455CE9] translate-y-[101%] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 -z-20" />
      <div 
        className="absolute inset-0 translate-y-[101%] transition-transform duration-500 delay-75 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 z-10 transition-colors duration-500 group-hover:text-white">
        
        {/* Left: Name & Issuer */}
        <div className="flex flex-col gap-1 w-full lg:w-5/12 overflow-hidden">
          <h4 className="text-xl sm:text-2xl font-medium tracking-tight font-mono lg:font-sans lg:min-h-[auto] block truncate" title={cert.name}>{displayText}</h4>
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C1D20]/60 group-hover:text-white/90 transition-colors duration-300 block truncate">{cert.issuer}</span>
        </div>

        {/* Center: Skills */}
        <div className="flex flex-col gap-1 w-full lg:w-4/12 lg:text-center text-[#1C1D20]/80 group-hover:text-white/90">
          <span className="text-xs uppercase tracking-widest opacity-50">{t('awards.skills')}</span>
          <span className="text-sm sm:text-base font-light">{cert.skills}</span>
        </div>

        {/* Right: Date, ID, and Arrow */}
        <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-2 w-full lg:w-3/12">
          <div className="flex flex-col text-left lg:text-right">
            <span className="text-sm font-medium">{cert.date}</span>
            {cert.credentialId && <span className="text-xs uppercase tracking-wider opacity-60">ID: {cert.credentialId}</span>}
          </div>
          {cert.link && (
            <div className="w-10 h-10 rounded-full border border-[#1C1D20]/20 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:-rotate-45 group-hover:bg-white group-hover:text-[#0A0A0A]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default function Awards() {
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [row1, setRow1] = useState<{img: string, color: string}[]>([]);
  const [row2, setRow2] = useState<{img: string, color: string}[]>([]);

  useEffect(() => {
    // Extract and shuffle on client-side to prevent hydration mismatch
    const allImages = portfolioData.awards.flatMap(a => (a.images || []).map(img => ({ img, color: a.color })));
    const shuffled = [...allImages].sort(() => Math.random() - 0.5);
    setRow1(shuffled.slice(0, Math.ceil(shuffled.length / 2)));
    setRow2(shuffled.slice(Math.ceil(shuffled.length / 2)));
  }, []);

  useGSAP(() => {
    // Fade up sections
    gsap.utils.toArray(".award-section").forEach((section: any) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%"
          }
        }
      );
    });

    // Staggered entrance for cert items
    gsap.fromTo(".cert-item",
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: ".cert-container",
          start: "top 80%"
        }
      }
    );

    // Slower Marquee animations
    const mq1 = gsap.to(".marquee-track-1", {
      xPercent: -50,
      ease: "none",
      duration: 60, // Slower
      repeat: -1
    });

    const mq2 = gsap.fromTo(".marquee-track-2", 
      { xPercent: -50 },
      { 
        xPercent: 0,
        ease: "none",
        duration: 70, // Slower
        repeat: -1
      }
    );

    // Hover interactive GSAP
    const marqueeContainer = document.querySelector('.marquee-container');
    if (marqueeContainer) {
      marqueeContainer.addEventListener('mouseenter', () => {
        gsap.to([mq1, mq2], { timeScale: 0.2, duration: 0.5 }); // Slow down drastically on hover
      });
      marqueeContainer.addEventListener('mouseleave', () => {
        gsap.to([mq1, mq2], { timeScale: 1, duration: 0.5 }); // Resume normal speed
      });
    }

    // Animate grid items
    gsap.fromTo(".award-card",
      { opacity: 0, y: 40 },
      { 
        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: {
          trigger: ".award-grid",
          start: "top 75%"
        }
      }
    );
  }, { scope: container });

  const handleAwardClick = (id: string) => {
    sessionStorage.setItem('backTarget', '#awards');
    const { transitionPageOut } = require("@/utils/transition");
    transitionPageOut(`/awards/${id}`, router);
  };

  return (
    <section id="awards" ref={container} className="relative w-full py-24 sm:py-32 bg-[#F3F3F3] text-[#1C1D20] z-10 overflow-hidden rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
      
      <div className="max-w-screen-2xl mx-auto flex flex-col px-4 sm:px-12">
        
        {/* Title Section */}
        <div className="award-section w-full mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-inter text-4xl sm:text-6xl font-medium tracking-tight whitespace-pre-line">{t('awards.title')}</h2>
            <p className="text-[#1C1D20]/60 max-w-sm text-base sm:text-lg">
              {t('awards.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Moving Marquee Preview (Moved Below Title) */}
      <div className="marquee-container w-full flex flex-col gap-6 sm:gap-8 mb-32 opacity-80 hover:opacity-100 transition-opacity duration-500 overflow-hidden">
        
        {/* Row 1 (Moves Left) */}
        <div className="w-full flex">
          <div className="marquee-track-1 flex gap-6 sm:gap-8 w-max">
            {[...row1, ...row1, ...row1].map((item, i) => (
              <div 
                key={`r1-${i}`} 
                className="w-48 sm:w-72 h-32 sm:h-48 flex-shrink-0 flex items-center justify-center p-4 sm:p-6 rounded-md relative group/marquee-item"
                style={{ backgroundColor: item.color }}
              >
                <div className="relative w-full h-full shadow-lg transition-transform duration-500 ease-out group-hover/marquee-item:scale-[1.15] group-hover/marquee-item:shadow-2xl z-0 group-hover/marquee-item:z-10">
                  <Image src={item.img} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover grayscale group-hover/marquee-item:grayscale-0 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Moves Right) */}
        <div className="w-full flex">
          <div className="marquee-track-2 flex gap-6 sm:gap-8 w-max">
            {[...row2, ...row2, ...row2].map((item, i) => (
              <div 
                key={`r2-${i}`} 
                className="w-48 sm:w-72 h-32 sm:h-48 flex-shrink-0 flex items-center justify-center p-4 sm:p-6 rounded-md relative group/marquee-item"
                style={{ backgroundColor: item.color }}
              >
                <div className="relative w-full h-full shadow-lg transition-transform duration-500 ease-out group-hover/marquee-item:scale-[1.15] group-hover/marquee-item:shadow-2xl z-0 group-hover/marquee-item:z-10">
                  <Image src={item.img} alt="Preview" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover grayscale group-hover/marquee-item:grayscale-0 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto flex flex-col px-4 sm:px-12">
        
        {/* Awards & Documentation Gallery Grid */}
        <div className="award-section w-full mb-32">
          <div className="award-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {portfolioData.awards.map((award, i) => (
              <AwardCard 
                key={i}
                award={award}
                onClick={() => handleAwardClick(award.id!)}
                t={t}
              />
            ))}
          </div>
        </div>


        {/* fications - Full Width Interactive List */}
        <div className="award-section cert-container w-full border-t border-[#1C1D20]/20 pt-16 sm:pt-24 mb-24">
          <div className="overflow-hidden mb-10 sm:mb-16">
            <h2 className="font-inter text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight leading-[1.1] max-w-none">
              {t('awards.cert_title')}
            </h2>
          </div>
          <div className="flex flex-col border-t border-[#1C1D20]/10">
            {portfolioData.certifications.map((cert: any, i: number) => (
              <CertRow key={i} cert={cert} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

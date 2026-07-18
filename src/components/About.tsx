"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { getPortfolioData } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Magnetic from "./Magnetic";
import { useRouter } from "next/navigation";

const roles = ["Data Analyst", "Data Scientist", "Machine Learning Engineer"];

const ResumeRow = ({ title, subtitle, description, period, onClick }: { title: string, subtitle: string, description?: string, period: string, onClick: () => void }) => {
  const [displayText, setDisplayText] = useState(title);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<any>(null);

  const startGlitch = () => {
    setIsHovered(true);
    let iteration = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayText((prev: string) => 
        title.split("").map((letter: string, index: number) => {
          if (letter === " ") return " ";
          if (index < iteration) return title[index];
          const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]";
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (iteration >= title.length) clearInterval(intervalRef.current);
      iteration += 1;
    }, 25);
  };

  const stopGlitch = () => {
    setIsHovered(false);
    clearInterval(intervalRef.current);
    setDisplayText(title);
  };

  return (
    <div 
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      onTouchStart={startGlitch}
      onTouchEnd={stopGlitch}
      onClick={onClick}
      className="group relative flex flex-col justify-center py-2 sm:py-3 border-b border-[#1C1D20]/10 overflow-hidden cursor-pointer"
    >
      {/* Background Hover Effect: Matrix Grid */}
      <div className={`absolute inset-0 bg-[#455CE9] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isHovered ? 'translate-y-0' : 'translate-y-[101%]'}`} />
      <div 
        className={`absolute inset-0 transition-transform duration-500 delay-75 ease-[cubic-bezier(0.76,0,0.24,1)] ${isHovered ? 'translate-y-0' : 'translate-y-[101%]'}`}
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      <div className={`relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pr-4 transition-colors duration-500 ${isHovered ? 'text-white' : ''}`}>
        
        {/* Left: Role / Degree & Institution */}
        <div className={`flex flex-col gap-0.5 w-full lg:w-8/12 overflow-hidden pl-4 border-l-2 transition-colors ${isHovered ? 'border-white/50' : 'border-[#1C1D20]/20'}`}>
          <h4 className={`text-base sm:text-lg tracking-tight font-mono lg:font-sans lg:min-h-[auto] block truncate ${isHovered ? 'font-bold' : 'font-normal'}`} title={title}>{displayText}</h4>
            <span className={`text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 block truncate ${isHovered ? 'font-bold text-white/90' : 'font-normal text-[#1C1D20]/60'}`}>{subtitle}</span>
            {description && (
            <span className={`text-xs transition-all mt-1 ${isHovered ? 'font-bold text-white/60' : 'font-normal text-[#1C1D20]/50'}`}>{description}</span>
          )}
        </div>

        {/* Right: Date and Arrow */}
        <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-2 w-full lg:w-4/12">
          <div className="flex flex-col text-left lg:text-right">
            <span className={`text-sm transition-all ${isHovered ? 'font-bold' : 'font-normal'}`}>{period}</span>
          </div>
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isHovered ? 'border-white -rotate-45 bg-white text-[#0A0A0A]' : 'border-[#1C1D20]/20'}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function About() {
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const extraRefs = useRef<HTMLDivElement[]>([]);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const state1Ref = useRef<HTMLDivElement>(null);
  const state2Ref = useRef<HTMLDivElement>(null);
  const contentRowRef = useRef<HTMLDivElement>(null);

  const addToExtraRefs = (el: HTMLDivElement | null) => {
    if (el && !extraRefs.current.includes(el)) extraRefs.current.push(el);
  };

  const [roleIndex, setRoleIndex] = useState(0);
  const [selectedDetail, setSelectedDetail] = useState<{type?: 'education', title: string, subtitle: string, description?: string, period: string, link?: string, organizations?: any} | null>(null);
  const [showCVPdf, setShowCVPdf] = useState(false);

  // Width-expand animation for typewriter
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 });

      roles.forEach((_, i) => {
        tl.call(() => setRoleIndex(i));
        // Start from 0 width
        tl.set(".dynamic-box", { width: 0 });
        // Reveal text by expanding the box
        tl.to(".dynamic-box", { width: "100%", duration: 1.2, ease: "power2.out" });
        // Hold to read
        tl.to({}, { duration: 2 });
        // Hide by shrinking
        tl.to(".dynamic-box", { width: 0, duration: 0.8, ease: "power2.in" });
      });
    }, container);
    return () => ctx.revert();
  }, []);

  useGSAP(() => {
    // GSAP Pin animation — desktop only via matchMedia
    if (container.current && state1Ref.current && state2Ref.current) {
      let mm = gsap.matchMedia();
      
      // Desktop (lg+): Pin + crossfade between State 1 & State 2
      mm.add("(min-width: 1024px)", () => {
        // Initialize visibility for GSAP (only on desktop)
        gsap.set(state1Ref.current, { autoAlpha: 1 });
        gsap.set(state2Ref.current, { autoAlpha: 0, scale: 1.05, filter: "blur(8px)", y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container.current,
            start: "top top",
            end: "+=1200",
            pin: true,
            scrub: 1,
          }
        });

        // Frame 1: pause so user reads State 1
        tl.to({}, { duration: 1 });

        // Frame 2: fade State 1 out
        tl.to(state1Ref.current, {
          y: -40,
          scale: 0.95,
          filter: "blur(8px)",
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
        }, "transition");

        // Frame 3: fade State 2 in
        tl.to(state2Ref.current, {
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
        }, "transition+=0.1");

        // Frame 4: pause so user reads State 2
        tl.to({}, { duration: 1 });

        return () => {
          // Cleanup: reset on leave
          gsap.set(state1Ref.current, { clearProps: "all" });
          gsap.set(state2Ref.current, { clearProps: "all" });
        };
      });

      // Mobile/Tablet portrait: no animation, both states visible naturally
      mm.add("(max-width: 1023px)", () => {
        gsap.set(state1Ref.current, { clearProps: "all" });
        gsap.set(state2Ref.current, { clearProps: "all", autoAlpha: 1 });
      });
    }


    // Fade in text and extra elements (badge, buttons)
    gsap.fromTo(
      [textRef.current, ...extraRefs.current],
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      }
    );

    // Number counting animations
    const ints = container.current?.querySelectorAll(".stat-number-int");
    if (ints) {
      ints.forEach((el) => {
        const val = parseInt(el.getAttribute("data-val") || "0");
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: val,
          snap: { innerText: 1 },
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
          }
        });
      });
    }

    const floats = container.current?.querySelectorAll(".stat-number-float");
    if (floats) {
      floats.forEach((el) => {
        const val = parseFloat(el.getAttribute("data-val") || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: val,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
          },
          onUpdate: () => {
            el.innerHTML = obj.val.toFixed(2);
          }
        });
      });
    }

    // Photo & Border reveal animation
    if (photoContainerRef.current) {
      const img = photoContainerRef.current.querySelector('img');
      
      // Border offset animation
      if (borderRef.current) {
        gsap.fromTo(
          borderRef.current,
          { x: 0, y: 0, opacity: 0 },
          {
            x: -24,
            y: 24,
            opacity: 1,
            duration: 1.5,
            delay: 0.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: photoContainerRef.current,
              start: "top 75%",
            }
          }
        );
      }

      gsap.fromTo(
        photoContainerRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: photoContainerRef.current,
            start: "top 80%",
          }
        }
      );
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.5 },
          {
            scale: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: photoContainerRef.current,
              start: "top 75%",
            }
          }
        );
      }
    }


  }, { scope: container });

  return (
    <section id="about" ref={container} className="relative w-full py-12 lg:min-h-screen lg:py-8 lg:flex lg:flex-col lg:justify-center px-4 sm:px-12 bg-white text-[#1C1D20] rounded-t-[40px]">
      {/* Native CSS Sticky Background - Uses clipPath to avoid breaking sticky with overflow-hidden */}
      <div 
        className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        style={{ clipPath: "inset(0 0 0 0 round 40px 40px 0 0)" }}
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-white">
          {/* <video 
            className="w-full h-full object-cover opacity-[0.10]"
            style={{ filter: "invert(1) sepia(1) hue-rotate(200deg) saturate(300%)" }}
            muted autoPlay loop playsInline
          >
            <source src="/Plexus-Tech-Background-With-Glowing.mp4" type="video/mp4" />
          </video> */}
        </div>
      </div>

      <div className="relative z-10 max-w-screen-2xl mx-auto w-full">
        <div ref={contentRowRef} className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16 w-full">
          
          {/* Left Column: Profile Card */}
          <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 mb-4 lg:mb-0 z-20">
            <div 
              ref={photoContainerRef}
              className="w-full h-full bg-white rounded-[1.5rem] p-4 sm:p-5 flex flex-row lg:flex-col justify-between gap-4 shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-[#1C1D20]/5 relative overflow-hidden group"
            >
              {/* Animated Left Edge Glow */}
              <div className="absolute top-0 left-0 bottom-0 w-[5px] z-50 overflow-hidden">
                <div className="w-full h-[40%] bg-gradient-to-b from-transparent via-[#455CE9] to-transparent opacity-90 edge-glow-effect" />
              </div>

              {/* CSS Shimmer Sweep Effect (Animated) */}
              <div 
                className="absolute top-0 left-0 w-[60%] h-full bg-gradient-to-r from-transparent via-[#455CE9]/10 to-transparent pointer-events-none shimmer-effect z-40"
              />

              {/* Photo — compact circle on mobile, large centered on desktop */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-3/4 lg:h-auto lg:mx-auto lg:aspect-square flex-shrink-0 rounded-full overflow-hidden relative shadow-sm lg:mt-1">
                <Image src="/profil_photo.jpeg" alt="Sadinal Mufti" fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
              
              {/* Info — beside photo on mobile, below photo centered on desktop */}
              <div className="flex-1 flex flex-col lg:items-center lg:text-center gap-1 justify-center">
                <h3 className="font-inter text-base sm:text-lg lg:text-2xl font-bold tracking-tight text-[#1C1D20]">Sadinal Mufti</h3>
                <p className="text-[10px] sm:text-xs lg:text-sm font-semibold tracking-widest text-[#455CE9] uppercase">{language === 'id' ? 'Sarjana Komputer' : 'Bachelor of Computer Science'}</p>
                {/* Email shown only on mobile */}
                <a href="mailto:muftisadinal@gmail.com" className="text-[10px] sm:text-xs font-medium text-[#1C1D20]/60 hover:text-[#455CE9] transition-colors mt-0.5 block lg:hidden truncate">muftisadinal@gmail.com</a>
                <span className="text-[10px] text-[#1C1D20]/40 lg:hidden">{t('about.based')}</span>
              </div>

              {/* Contact Line — desktop only */}
              <div className="hidden lg:flex flex-col items-center gap-1 w-full border-t border-b border-[#1C1D20]/10 py-5">
                <a href="mailto:muftisadinal@gmail.com" className="text-base font-medium text-[#1C1D20] hover:text-[#455CE9] transition-colors">muftisadinal@gmail.com</a>
                <span className="text-sm text-[#1C1D20]/50">{t('about.based')}</span>
              </div>

              {/* Socials — desktop only full row, mobile hidden (shown in action buttons area) */}
              <div className="hidden lg:flex justify-center gap-4">
                <a href="mailto:muftisadinal@gmail.com" className="w-12 h-12 rounded-full bg-[#f4f4f4] border border-[#1C1D20]/10 text-[#1C1D20] flex items-center justify-center hover:bg-[#1C1D20] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </a>
                <a href="https://www.linkedin.com/in/sadinal-mufti/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f4f4f4] border border-[#1C1D20]/10 text-[#1C1D20] flex items-center justify-center hover:bg-[#1C1D20] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com/sadinal04" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f4f4f4] border border-[#1C1D20]/10 text-[#1C1D20] flex items-center justify-center hover:bg-[#1C1D20] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://www.instagram.com/sadinal_mufti/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-[#f4f4f4] border border-[#1C1D20]/10 text-[#1C1D20] flex items-center justify-center hover:bg-[#1C1D20] hover:text-white hover:scale-110 transition-all duration-300 shadow-sm">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>

              {/* Action Buttons — desktop only full stack, mobile shows as row */}
              <div className="hidden lg:flex flex-col gap-2 w-full mt-1">
                <button onClick={() => setShowCVPdf(true)} className="w-full flex items-center justify-center gap-2 bg-transparent border border-[#1C1D20]/20 text-[#1C1D20] py-2.5 rounded-xl font-medium hover:bg-[#1C1D20] hover:text-white transition-colors duration-300 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  {t('about.cv')}
                </button>
                <a href="#contact" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="w-full flex items-center justify-center gap-2 bg-[#455CE9] text-white py-2.5 rounded-xl font-medium shadow-md shadow-[#455CE9]/30 hover:bg-[#1C1D20] transition-colors duration-300 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {t('about.contact')}
                </a>
              </div>
              {/* Mobile action buttons row */}
              <div className="flex lg:hidden gap-2 w-full mt-1 flex-col">
                <button onClick={() => setShowCVPdf(true)} className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#1C1D20]/20 text-[#1C1D20] py-2 rounded-xl font-medium hover:bg-[#1C1D20] hover:text-white transition-colors duration-300 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  {t('about.cv')}
                </button>
                <a href="#contact" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }} className="flex-1 flex items-center justify-center gap-2 bg-[#455CE9] text-white py-2 rounded-xl font-medium hover:bg-[#1C1D20] transition-colors duration-300 text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  {t('about.contact')}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Content */}
          <div className="flex-1 w-full flex flex-col justify-start">
            <div ref={rightColRef} className="w-full flex flex-col lg:grid lg:[grid-template-areas:'stack'] relative gap-10 lg:gap-0 lg:h-full">
              
              {/* --- STATE 1: Intro & Stats --- */}
              <div ref={state1Ref} className="lg:[grid-area:stack] w-full flex flex-col justify-between z-10 origin-top">
                <div>
                  {/* Top Label */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#455CE9] animate-pulse"></span>
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1C1D20]/70">{t('about.title')}</span>
                  </div>

                  {/* Typewriter Text */}
                  <div className="w-full leading-tight min-h-[3rem] mb-5 flex items-center">
                     <h3 className="font-inter text-3xl sm:text-[2.25rem] font-medium text-[#1C1D20] flex items-center whitespace-nowrap">
                        {t('about.hello')}&nbsp;
                        <span className="relative inline-flex flex-col items-start overflow-visible ml-1">
                          {/* Invisible text to reserve width and avoid layout shift */}
                          <span className="opacity-0 px-3 py-1 font-bold invisible">{roles[roleIndex]}</span>
                          
                          {/* The animating box */}
                          <span className="dynamic-box absolute top-0 left-0 h-full whitespace-nowrap border-[1.5px] border-[#455CE9] text-[#455CE9] font-bold flex items-center bg-white/50 z-10">
                            <span className="w-full h-full overflow-hidden flex items-center px-3 py-1">
                              {roles[roleIndex]}
                            </span>
                            
                            {/* Corner Dots - Centered on the border, perfectly squared */}
                            <span className="absolute -top-[4px] -left-[4px] w-2 h-2 border-[1.5px] border-[#455CE9] bg-white"></span>
                            <span className="absolute -top-[4px] -right-[4px] w-2 h-2 border-[1.5px] border-[#455CE9] bg-white"></span>
                            <span className="absolute -bottom-[4px] -left-[4px] w-2 h-2 border-[1.5px] border-[#455CE9] bg-white"></span>
                            <span className="absolute -bottom-[4px] -right-[4px] w-2 h-2 border-[1.5px] border-[#455CE9] bg-white"></span>
                          </span>
                        </span>
                     </h3>
                  </div>

                  {/* Huge Headline */}
                  <h2 className="font-inter text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15] mb-6 text-[#1C1D20] break-words">
                    {t('about.headline')}
                  </h2>

                  {/* Description Paragraph */}
                  <p ref={textRef} className="text-base sm:text-lg font-light leading-[1.6] text-[#1C1D20]/70 mb-10 w-full text-justify hyphens-auto">
                    {portfolioData.profile.summary}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                     {/* Card 1 */}
                     <div ref={addToExtraRefs} className="bg-[#f4f4f4]/80  rounded-2xl p-6 sm:p-8 flex flex-col gap-2 hover:bg-[#1C1D20] transition-colors duration-300 group border border-[#1C1D20]/5">
                       <span className="text-4xl sm:text-5xl font-bold text-[#1C1D20] group-hover:text-white transition-colors duration-300">
                         <span className="stat-number-float" data-val="3.70">0.00</span>
                       </span>
                       <span className="text-sm font-medium tracking-wide text-[#1C1D20]/60 group-hover:text-white/60 transition-colors duration-300">{t('about.stats.gpa')}</span>
                     </div>
                     
                     {/* Card 2 */}
                     <div ref={addToExtraRefs} className="bg-[#f4f4f4]/80  rounded-2xl p-6 sm:p-8 flex flex-col gap-2 hover:bg-[#1C1D20] transition-colors duration-300 group border border-[#1C1D20]/5">
                       <span className="text-4xl sm:text-5xl font-bold text-[#1C1D20] group-hover:text-white transition-colors duration-300">
                         <span className="stat-number-int" data-val="15">0</span>+
                       </span>
                       <span className="text-sm font-medium tracking-wide text-[#1C1D20]/60 group-hover:text-white/60 transition-colors duration-300">{t('about.stats.projects')}</span>
                     </div>
                     
                     {/* Card 3 */}
                     <div ref={addToExtraRefs} className="bg-[#f4f4f4]/80  rounded-2xl p-6 sm:p-8 flex flex-col gap-2 hover:bg-[#1C1D20] transition-colors duration-300 group border border-[#1C1D20]/5">
                       <span className="text-4xl sm:text-5xl font-bold text-[#1C1D20] group-hover:text-white transition-colors duration-300">
                         <span className="stat-number-int" data-val="15">0</span>+
                       </span>
                       <span className="text-sm font-medium tracking-wide text-[#1C1D20]/60 group-hover:text-white/60 transition-colors duration-300">{t('about.stats.certs')}</span>
                     </div>
                  </div>
              </div>

              {/* --- STATE 2: Resume (Experience, Education, Coding Camp) --- */}
              {/* On mobile: always visible in normal flow. On desktop: hidden initially, revealed via GSAP */}
              <div ref={state2Ref} className="lg:[grid-area:stack] w-full flex flex-col justify-between z-0 origin-bottom" style={{}}>
                
                <div>
                  {/* Top Label */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#455CE9] animate-pulse"></span>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#1C1D20]/70">{t('about.resume')}</span>
                </div>

                <div className="flex flex-col gap-10">
                  {/* Experience */}
                  <div className="group/list relative">
                    <h3 className="font-inter anim-item text-sm sm:text-base font-bold uppercase tracking-widest text-[#1C1D20] mb-3 flex items-center gap-4">
                      {t('about.experience')}
                      <span className="flex-1 h-[1px] bg-[#1C1D20]/10 block"></span>
                    </h3>
                    <div className="flex flex-col">
                      {portfolioData.experience.map((exp: any, i) => (
                        <ResumeRow 
                          key={i} 
                          title={exp.role} 
                          subtitle={exp.company} 
                          period={exp.period} 
                          onClick={() => {
                            setSelectedDetail({
                              title: exp.role, 
                              subtitle: exp.company, 
                              description: exp.description, 
                              period: exp.period,
                              link: exp.link
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Coding Camp */}
                  <div className="group/list relative">
                    <h3 className="font-inter anim-item text-sm sm:text-base font-bold uppercase tracking-widest text-[#1C1D20] mb-3 flex items-center gap-4">
                      {t('about.bootcamp')}
                      <span className="flex-1 h-[1px] bg-[#1C1D20]/10 block"></span>
                    </h3>
                    <div className="flex flex-col">
                      {portfolioData.coding_camp?.map((camp: any, i) => (
                        <ResumeRow 
                          key={i} 
                          title={camp.program} 
                          subtitle={camp.institution} 
                          period={camp.period} 
                          onClick={() => {
                            setSelectedDetail({
                              title: camp.program, 
                              subtitle: camp.institution, 
                              description: camp.description, 
                              period: camp.period,
                              link: camp.link
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Education */}
                  <div className="group/list relative">
                    <h3 className="font-inter anim-item text-sm sm:text-base font-bold uppercase tracking-widest text-[#1C1D20] mb-3 flex items-center gap-4">
                      {t('about.education')}
                      <span className="flex-1 h-[1px] bg-[#1C1D20]/10 block"></span>
                    </h3>
                    <div className="flex flex-col">
                      {portfolioData.education.map((edu, i) => (
                        <ResumeRow 
                          key={i} 
                          title={edu.degree} 
                          subtitle={edu.institution} 
                          description={`GPA: ${edu.gpa}`} 
                          period={edu.period} 
                          onClick={() => setSelectedDetail({
                            type: 'education',
                            title: edu.degree, 
                            subtitle: edu.institution, 
                            description: `GPA: ${edu.gpa}`, 
                            period: edu.period,
                            organizations: edu.organizations
                          })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Section 3: Scroll Indicator (Desktop only) --- */}
                <div className="hidden lg:flex flex-col items-center justify-center mt-6 mb-4 group cursor-pointer w-full">
                  <div className="w-[30px] h-[46px] rounded-[15px] border-2 border-[#1C1D20]/20 flex justify-center p-1.5 mb-2 relative overflow-hidden group-hover:border-[#455CE9] transition-colors duration-500 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1C1D20]/40 group-hover:bg-[#455CE9] animate-[bounce_1.5s_infinite] transition-colors duration-500"></div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1C1D20]/40 group-hover:text-[#455CE9] transition-colors duration-500">
                    Scroll to Explore
                  </span>
                  <span className="text-[9px] mt-2 font-medium tracking-widest text-[#1C1D20]/30 text-center">
                    Projects &bull; Achievements &bull; Certifications
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* --- Detail Popup Modal --- */}
      {selectedDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
            onClick={() => setSelectedDetail(null)}
          />
          
          {selectedDetail.link ? (
            <div 
              className="relative group bg-[#1C1D20] text-white w-full max-w-5xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl animate-[fadeInUp_0.4s_ease-out_forwards] flex flex-col md:flex-row transition-transform duration-700 hover:scale-[1.02] cursor-pointer"
              onClick={() => {
                sessionStorage.setItem('backTarget', '#about');
                router.push(selectedDetail.link!);
              }}
            >
              <button 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 group/close"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetail(null);
                }}
              >
                <svg className="transition-transform duration-300 group-hover/close:rotate-90" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              
              {/* Left Side: Title & Info */}
              <div className="flex flex-col justify-between p-6 sm:p-12 md:w-5/12 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-6 sm:mb-8">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#455CE9] animate-pulse" />
                    {selectedDetail.subtitle}
                  </div>
                  <h4 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4 sm:mb-6 group-hover:text-[#455CE9] transition-colors duration-500">
                    {selectedDetail.title}
                  </h4>
                  <p className="text-sm sm:text-lg font-light text-white/70 leading-relaxed">
                    {selectedDetail.period}
                  </p>
                </div>
                
                <div className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-white/50 group-hover:text-white transition-colors cursor-pointer">
                  {t('about.explore')}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#1C1D20]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>

              {/* Right Side: Metrics Grid */}
              <div className="flex flex-col justify-center p-6 sm:p-12 md:w-7/12 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 group-hover:bg-white/10 transition-colors duration-500">
                {(() => {
                  const isProject = selectedDetail.link.startsWith('/work/');
                  const id = selectedDetail.link.split('/').pop();
                  
                  if (isProject) {
                    const proj = portfolioData.projects.find(p => p.id === id);
                    if (proj?.metrics) {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                          {proj.metrics.map((m: any, i: number) => (
                            <div key={i} className="flex flex-col gap-1.5">
                              <span className="text-base sm:text-lg font-medium text-white leading-tight">{m.value}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  } else if (selectedDetail.link.startsWith('/training/')) {
                    const course = portfolioData.courses.find(c => c.id === id);
                    if (course) {
                      return (
                        <>
                          <div className="grid grid-cols-2 gap-8 sm:gap-12">
                            <div className="flex flex-col gap-2">
                              <span className="text-2xl sm:text-3xl font-medium text-white leading-tight">{course.duration}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('about.duration')}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-2xl sm:text-3xl font-medium text-white leading-tight">{course.learningHours}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('about.learning_hours')}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-2xl sm:text-3xl font-medium text-white leading-tight">{course.mentoringSessions}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('about.mentoring')}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-2xl sm:text-3xl font-medium text-white leading-tight">{course.capstone}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('about.capstone')}</span>
                            </div>
                          </div>
                          <div className="mt-12 pt-8 border-t border-white/10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-4">{t('about.core_learning')}</span>
                            <p className="text-sm sm:text-base font-medium text-white/80 leading-relaxed">
                              {course.learningAreas}
                            </p>
                          </div>
                        </>
                      );
                    }
                  }
                  
                  return (
                    <p className="text-white/60">{t('about.no_details')}</p>
                  );
                })()}
              </div>
            </div>
          ) : selectedDetail.type === 'education' ? (
            <div className="relative group bg-[#1C1D20] text-white w-full max-w-5xl rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl animate-[fadeInUp_0.4s_ease-out_forwards] flex flex-col md:flex-row transition-transform duration-700 hover:scale-[1.02]">
              <button 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 group/close"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetail(null);
                }}
              >
                <svg className="transition-transform duration-300 group-hover/close:rotate-90" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              
              {/* Left Side: Title & Info */}
              <div className="flex flex-col justify-between p-6 sm:p-12 md:w-5/12 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 text-white text-[10px] sm:text-xs font-semibold tracking-widest uppercase mb-6 sm:mb-8">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#455CE9] animate-pulse" />
                    {selectedDetail.subtitle}
                  </div>
                  <h4 className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4 sm:mb-6 group-hover:text-[#455CE9] transition-colors duration-500">
                    {selectedDetail.title}
                  </h4>
                  <p className="text-sm sm:text-lg font-light text-white/70 leading-relaxed mb-4 sm:mb-6">
                    {selectedDetail.period}
                  </p>
                  <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 border border-white/20 rounded-xl bg-white/5 shadow-inner">
                    <span className="text-lg sm:text-2xl font-bold text-white tracking-widest">
                      {selectedDetail.description?.replace('GPA: ', '')}
                    </span>
                    <span className="ml-3 sm:ml-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#455CE9]">Cum Laude</span>
                  </div>
                </div>
                
                <div 
                  className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-white/50 hover:text-white transition-colors cursor-pointer group/btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDetail(null);
                    const el = document.querySelector('#awards');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('about.view_awards')}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 group-hover/btn:border-white group-hover/btn:bg-white group-hover/btn:text-[#1C1D20]">
                    <svg className="rotate-45" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>

              {/* Right Side: Organizations Timeline */}
              <div className="flex flex-col justify-center p-6 sm:p-12 md:w-7/12 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 group-hover:bg-white/10 transition-colors duration-500 max-h-[85vh] overflow-y-auto custom-scrollbar">
                {selectedDetail.organizations && (
                  <div className="flex flex-col">
                    <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#455CE9] mb-4">{t('about.org_experience')}</h5>
                    <h3 className="text-2xl sm:text-3xl font-medium text-white mb-3 leading-tight pr-4">{selectedDetail.organizations.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 font-medium tracking-wide mb-10">
                      <span>{selectedDetail.organizations.type}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>{selectedDetail.organizations.location}</span>
                    </div>

                    <div className="flex flex-col gap-10 relative">
                      {selectedDetail.organizations.roles.map((role: any, i: number) => (
                        <div key={i} className="flex flex-col relative pl-6 sm:pl-8">
                          {/* Dot */}
                          <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10" />
                          
                          {/* Disconnected Line Segment */}
                          <div className="absolute left-[3px] top-8 bottom-0 w-[2px] bg-white/10 rounded-full" />
                          
                          <h4 className="text-base sm:text-lg lg:text-xl font-medium text-white mb-2 leading-snug">{role.title}</h4>
                          <span className="text-xs font-bold tracking-[0.15em] uppercase text-[#455CE9]">{role.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative bg-[#f4f4f4] w-full max-w-2xl rounded-[1.5rem] sm:rounded-2xl p-5 sm:p-10 shadow-2xl animate-[fadeInUp_0.4s_ease-out_forwards]">
              <button 
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors group/close"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDetail(null);
                }}
              >
                <svg className="transition-transform duration-300 group-hover/close:rotate-90" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              
              <h2 className="font-inter text-2xl sm:text-3xl font-bold text-[#1C1D20] mb-2 pr-12">{selectedDetail.title}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                <span className="text-[#455CE9] font-semibold uppercase tracking-wider">{selectedDetail.subtitle}</span>
                <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#1C1D20]/20"></span>
                <span className="text-sm font-medium text-[#1C1D20]/60">{selectedDetail.period}</span>
              </div>
              
              <div className="w-full h-[1px] bg-[#1C1D20]/10 mb-6" />
              
              {selectedDetail.description && (
                <p className="text-base sm:text-lg text-[#1C1D20]/80 leading-relaxed font-light whitespace-pre-line text-justify hyphens-auto">
                  {selectedDetail.description}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {/* CV PDF Popup Modal */}
      {showCVPdf && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1D20]/90 backdrop-blur-md p-4 sm:p-8 md:p-12">
          <div className="relative w-full max-w-4xl h-[90vh] md:h-[95vh] bg-white rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl flex flex-col animate-[fadeInUp_0.4s_ease-out_forwards]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#1C1D20]/10 bg-[#F8F9FA]">
              <div className="flex flex-col">
                <h3 className="text-[#1C1D20] font-semibold tracking-wide text-lg">Curriculum Vitae</h3>
                <span className="text-xs text-[#1C1D20]/50 uppercase tracking-widest">Sadinal Mufti</span>
              </div>
              <button 
                onClick={() => setShowCVPdf(false)} 
                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[#1C1D20]/5 hover:bg-red-500 hover:text-white transition-all group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 w-full bg-[#E5E7EB] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
              <iframe 
                src="/CV/CV_ATS_SADINAL_MUFTI_ATS.pdf#view=FitH" 
                className="w-full h-full min-h-[80vh] border-none" 
                title="CV PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Magnetic from "./Magnetic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Menu({ isScrolled }: { isScrolled: boolean }) {
  const { language, setLanguage, t } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGPathElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();

  useEffect(() => {
    if(isActive) setIsActive(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Handle Hamburger Scale In/Out on Scroll
  useEffect(() => {
    if (isScrolled) {
      gsap.to(buttonContainerRef.current, { scale: 1, duration: 0.3, ease: "power3.out" });
    } else {
      gsap.to(buttonContainerRef.current, { scale: 0, duration: 0.3, ease: "power3.in" });
      if (isActive) setIsActive(false); // Close menu if scrolling back to top
    }
  }, [isScrolled, isActive]);

  useEffect(() => {
    const tl = gsap.timeline();

    if (isActive) {
      tl.to(menuRef.current, { right: 0, duration: 0.8, ease: "power3.inOut" })
        .fromTo(linksRef.current?.children || [], { x: 50, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, duration: 0.5 }, "-=0.3");
    } else {
      tl.to(menuRef.current, { right: "-100%", duration: 0.8, ease: "power3.inOut" });
    }
  }, [isActive]);

  const router = require("next/navigation").useRouter();

  const scrollTo = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setIsActive(false); // Close menu
    
    // Allow a tiny delay for menu to start closing before scrolling
    setTimeout(() => {
      if (pathname !== "/") {
        const { transitionPageOut } = require("@/utils/transition");
        transitionPageOut("/" + target, router);
        return;
      }

      if (target === '#contact') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (target === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400); // Increased delay slightly to allow sliding out
  };

  return (
    <>
      {/* Floating Button Container */}
      <div ref={buttonContainerRef} className="fixed top-8 right-8 z-[70] scale-0 origin-center">
        <Magnetic>
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-20 h-20 bg-[#1C1D20] hover:bg-[#455CE9] transition-colors duration-500 rounded-full flex flex-col items-center justify-center gap-1.5 overflow-hidden group shadow-lg"
          >
            <div className={`w-6 h-[2px] bg-white transition-transform duration-500 ${isActive ? 'rotate-45 translate-y-[8px]' : ''}`} />
            <div className={`w-6 h-[2px] bg-white transition-opacity duration-500 ${isActive ? 'opacity-0' : ''}`} />
            <div className={`w-6 h-[2px] bg-white transition-transform duration-500 ${isActive ? '-rotate-45 -translate-y-[8px]' : ''}`} />
          </button>
        </Magnetic>
      </div>

      {/* Side Drawer Menu Panel */}
      <div
        ref={menuRef}
        className="fixed top-0 right-[-100%] h-screen w-full md:w-[450px] bg-[#1C1D20] z-[60] text-white flex flex-col px-10 sm:px-16 shadow-2xl border-l border-white/10 overflow-y-auto"
      >
        {/* Top Header Area for Language Toggle (Aligned with Close Button) */}
        <div className="flex-none h-32 flex items-center mt-4">
          <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-sm">
            <button 
              onClick={() => { setLanguage('en'); setIsActive(false); }}
              className={`transition-colors duration-300 text-sm tracking-wide ${language === 'en' ? 'text-white font-semibold' : 'text-white/40 hover:text-white/80'}`}
            >
              EN
            </button>
            <span className="text-white/20 text-xs">|</span>
            <button 
              onClick={() => { setLanguage('id'); setIsActive(false); }}
              className={`transition-colors duration-300 text-sm tracking-wide ${language === 'id' ? 'text-white font-semibold' : 'text-white/40 hover:text-white/80'}`}
            >
              ID
            </button>
          </div>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex flex-col justify-center pb-8">
          <div className="flex flex-col items-start mb-8 w-full">
            <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">{t('nav.navigation')}</p>
          </div>
        
        <div ref={linksRef} className="flex flex-col gap-3 text-4xl sm:text-5xl font-light tracking-tight mb-12">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} className="hover:pl-4 transition-all duration-300 cursor-pointer">Home</a>
          <a href="#about" onClick={(e) => scrollTo(e, '#about')} className="hover:pl-4 transition-all duration-300 cursor-pointer">{t('nav.about')}</a>
          <a href="#work" onClick={(e) => scrollTo(e, '#work')} className="hover:pl-4 transition-all duration-300 cursor-pointer">{t('nav.work')}</a>
          <a href="#awards" onClick={(e) => scrollTo(e, '#awards')} className="hover:pl-4 transition-all duration-300 cursor-pointer">{t('nav.awards')}</a>
          <a href="#contact" onClick={(e) => scrollTo(e, '#contact')} className="hover:pl-4 transition-all duration-300 cursor-pointer">{t('nav.contact')}</a>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold text-gray-500 tracking-widest uppercase">{t('nav.socials')}</p>
          <div className="flex gap-4">
            <a href="mailto:muftisadinal@gmail.com" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#1C1D20] hover:scale-110 transition-all duration-300 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <a href="https://www.linkedin.com/in/sadinal-mufti/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#1C1D20] hover:scale-110 transition-all duration-300 shadow-sm">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://github.com/sadinal04" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#1C1D20] hover:scale-110 transition-all duration-300 shadow-sm">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.instagram.com/sadinal_mufti/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-[#1C1D20] hover:scale-110 transition-all duration-300 shadow-sm">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

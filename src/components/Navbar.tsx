"use client";

import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Magnetic from "./Magnetic";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import gsap from "gsap";

const NavItem = ({ title, target, onClick }: { title: string, target: string, onClick: (e: React.MouseEvent, target: string) => void }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const letterSpans = e.currentTarget.querySelectorAll('.letter');
    const chars = "!<>-_\\\\/[]{}—=+*^?#________";
    
    letterSpans.forEach((span, index) => {
      if (title[index] === ' ') return; // skip spaces
      
      const original = title[index];
      let obj = { value: 0 };
      
      gsap.to(obj, {
        value: 1,
        duration: 0.3 + (Math.random() * 0.2), // Random speed per letter
        ease: "none",
        onUpdate: () => {
          if (obj.value < 0.8) {
            span.innerHTML = chars[Math.floor(Math.random() * chars.length)];
          } else {
            span.innerHTML = original;
          }
        },
        onComplete: () => {
          span.innerHTML = original;
        }
      });
    });
  };

  return (
    <Magnetic>
      <a href={target} onClick={(e) => onClick(e, target)} onMouseEnter={handleMouseEnter} className="nav-link cursor-pointer relative flex items-center justify-center text-white hover:text-white/80 transition-colors duration-300">
        {/* Invisible clone to hold the exact stable width */}
        <span className="opacity-0 pointer-events-none flex">
          {title.split("").map((char, i) => (
            <span key={`clone-${i}`} className="inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', minWidth: char !== ' ' ? '9px' : 'auto', textAlign: 'center' }}>
              {char}
            </span>
          ))}
        </span>
        
        {/* Visible animated letters */}
        <span className="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none">
          {title.split("").map((char, i) => (
            <span key={i} className="letter inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal', minWidth: char !== ' ' ? '9px' : 'auto', textAlign: 'center' }}>
              {char}
            </span>
          ))}
        </span>
      </a>
    </Magnetic>
  );
};

export default function Navbar() {
  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [isLightSection, setIsLightSection] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Intro animation
    const tl = gsap.timeline();
    
    if (document.querySelector(".nav-logo")) {
      tl.fromTo(".nav-logo", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2, clearProps: "all" }
      );
    }
    
    if (document.querySelector(".nav-link")) {
      tl.fromTo(".nav-link", 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.6"
      );
    }

    const handleScroll = () => {
      // Hide text links when scrolled down slightly
      if (window.scrollY > 50) {
        setIsMenuHidden(true);
      } else {
        setIsMenuHidden(false);
      }

      // Change logo color when past the Hero section (which is 100vh)
      if (window.scrollY > window.innerHeight - 80) {
        setIsLightSection(true);
      } else {
        setIsLightSection(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const [backTarget, setBackTarget] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const storedBackTarget = sessionStorage.getItem('backTarget');

      if (searchParams.get("from") === "about" || storedBackTarget === "#about") {
        setBackTarget("#about");
        window.history.replaceState(null, '', window.location.pathname);
      } else {
        setBackTarget("");
      }
    }
  }, [pathname]);

  const handleBack = () => {
    let target = backTarget;
    if (!target) {
      if (pathname.startsWith("/work/")) target = "#work";
      else if (pathname.startsWith("/awards/")) target = "#awards";
      else if (pathname.startsWith("/training/")) target = "#about";
    }
    if (target) {
      sessionStorage.setItem('scrollTarget', target);
    }
    router.back();
  };

  const scrollTo = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (pathname !== "/") {
      if (target) {
        sessionStorage.setItem('scrollTarget', target);
      }
      const { transitionPageOut } = require("@/utils/transition");
      transitionPageOut("/", router);
      return;
    }
    
    if (target) {
      if (target === '#contact') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (target === '#hero') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-start z-[60] pointer-events-none transition-all duration-500">
        
        {/* Left Side: Logo OR Back Button */}
        <div 
          className={`font-semibold text-lg tracking-tight pointer-events-auto group cursor-pointer overflow-hidden flex flex-col relative h-[28px] ${pathname !== "/" ? 'w-[100px]' : 'w-[180px]'} transition-all duration-300 ${pathname === "/" ? (isLightSection ? 'text-[#1C1D20]' : 'text-white drop-shadow-md') : 'text-[#1C1D20]'}`}
          style={{ opacity: isMenuHidden && pathname === "/" ? 0 : 1, pointerEvents: isMenuHidden && pathname === "/" ? 'none' : 'auto' }}
        >
          <div className="nav-logo w-full h-full flex flex-col relative">
            {pathname === "/" ? (
              <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} className="w-full h-full block">
                <span className="absolute top-0 left-0 transition-transform duration-500 ease-out group-hover:-translate-y-full">
                  &copy; Portofolio Sadinal
                </span>
                <span className="absolute top-full left-0 transition-transform duration-500 ease-out group-hover:-translate-y-full">
                  &copy; Sadinal Mufti
                </span>
              </a>
            ) : (
              <button onClick={handleBack} className="w-full h-full block flex items-center gap-2 hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
                <span>{language === 'id' ? 'Kembali' : 'Back'}</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Inline Links (Visible only at the top of the homepage) */}
        {pathname === "/" && (
          <div className={`pointer-events-auto flex items-center gap-8 lg:gap-12 font-inter font-semibold text-xs lg:text-sm tracking-widest transition-opacity duration-300 drop-shadow-md ${isMenuHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <NavItem title="Home" target="#hero" onClick={scrollTo} />
            <NavItem title={t('nav.about')} target="#about" onClick={scrollTo} />
            <NavItem title={t('nav.work')} target="#work" onClick={scrollTo} />
            <NavItem title={t('nav.awards')} target="#awards" onClick={scrollTo} />
            <NavItem title={t('nav.contact')} target="#contact" onClick={scrollTo} />
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 ml-2">
              <button 
                onClick={() => setLanguage('en')}
                className={`transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
              >
                EN
              </button>
              <span className="text-white/30">|</span>
              <button 
                onClick={() => setLanguage('id')}
                className={`transition-colors duration-300 ${language === 'id' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
              >
                ID
              </button>
            </div>
          </div>
        )}
      </nav>
      <Menu isScrolled={pathname === "/" ? isMenuHidden : true} />
    </>
  );
}

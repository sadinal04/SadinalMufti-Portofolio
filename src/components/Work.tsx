"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getPortfolioData } from "@/data/portfolio";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Work() {
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const triggerRef = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const [modalData, setModalData] = useState({ active: false, index: 0 });
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const router = useRouter();

  const categories = ["All", "Data & AI Solution", "Web Development"];
  const displayCategories = {
    "All": t('work.all'),
    "Data & AI Solution": t('work.data'),
    "Web Development": t('work.web')
  };
  
  const filteredProjects = portfolioData.projects.filter(proj => {
    if (filter === "All") return true;
    if (Array.isArray(proj.category)) {
      return proj.category.includes(filter);
    }
    return proj.category === filter;
  });

  useGSAP(() => {
    // Center the fixed elements initially using GSAP to avoid Tailwind transform conflicts
    gsap.set([modalRef.current, cursorRef.current, cursorLabelRef.current], { xPercent: -50, yPercent: -50 });

    // QuickTo for mouse followers using x/y (hardware accelerated) instead of left/top
    const moveModalX = gsap.quickTo(modalRef.current, "x", { duration: 0.8, ease: "power3" });
    const moveModalY = gsap.quickTo(modalRef.current, "y", { duration: 0.8, ease: "power3" });
    const moveCursorX = gsap.quickTo(cursorRef.current, "x", { duration: 0.5, ease: "power3" });
    const moveCursorY = gsap.quickTo(cursorRef.current, "y", { duration: 0.5, ease: "power3" });
    const moveLabelX = gsap.quickTo(cursorLabelRef.current, "x", { duration: 0.45, ease: "power3" });
    const moveLabelY = gsap.quickTo(cursorLabelRef.current, "y", { duration: 0.45, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      moveModalX(clientX);
      moveModalY(clientY);
      moveCursorX(clientX);
      moveCursorY(clientY);
      moveLabelX(clientX);
      moveLabelY(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useGSAP(() => {
    if (modalRef.current && cursorRef.current && cursorLabelRef.current) {
      if (modalData.active) {
        if (viewMode === "list") {
          // Show both modal and bubble
          gsap.to([modalRef.current, cursorRef.current, cursorLabelRef.current], { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
        } else {
          // Show ONLY bubble in Grid mode
          gsap.to([cursorRef.current, cursorLabelRef.current], { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
          gsap.to(modalRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
        }
      } else {
        // Hide all
        gsap.to([modalRef.current, cursorRef.current, cursorLabelRef.current], { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
      }
    }
  }, [modalData.active, viewMode]);

  useGSAP(() => {
    // Parallax Entrance Effect for the whole section
    gsap.fromTo(container.current,
      { y: 150 },
      { 
        y: 0, 
        ease: "none",
        scrollTrigger: { 
          trigger: triggerRef.current, 
          start: "top bottom", 
          end: "top top", 
          scrub: true,
          invalidateOnRefresh: true
        } 
      }
    );

    // Parallax Curtain Reveal (Exit Effect)
    gsap.to(container.current, {
      y: () => window.innerHeight * 0.15, // Move down slightly without scaling to maintain margins
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "bottom bottom",
        end: "+=150%", // Increased pin duration for wider distance after work
        pin: true,
        pinSpacing: false, // Critical to allow Awards to overlap
        scrub: true,
        invalidateOnRefresh: true, // Forces recalculation on resize/monitor switch
      }
    });

    // Concave curve animation (SVG)
    gsap.fromTo(".work-curve",
      { attr: { d: "M 0 0 Q 50 200 100 0 L 100 100 L 0 100 Z" } },
      { 
        attr: { d: "M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z" },
        ease: "none",
        scrollTrigger: { 
          trigger: triggerRef.current, 
          start: "top bottom", 
          end: "top top", 
          scrub: true,
          invalidateOnRefresh: true
        } 
      }
    );

    // Title entrance animation
    gsap.fromTo(".work-title",
      { y: 100, opacity: 0, rotate: 3 },
      { y: 0, opacity: 1, rotate: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: container.current, start: "top 80%" } }
    );

    // Filters entrance
    gsap.fromTo(".work-filter",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: container.current, start: "top 70%" } }
    );
  }, { scope: container });

  // Animate items when filter or viewMode changes
  useEffect(() => {
    gsap.fromTo(".work-item", 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [filter, viewMode]);

  const handleProjectClick = (id: string) => {
    sessionStorage.setItem('backTarget', '#work');
    const { transitionPageOut } = require("@/utils/transition");
    transitionPageOut(`/work/${id}`, router);
  };

  return (
    <>
    <div ref={triggerRef} className="relative w-full z-20 -mt-20">
      <section id="work" ref={container} className="relative w-full pt-20 sm:pt-28 pb-48 sm:pb-[30vh] px-4 sm:px-12 bg-white text-[#1C1D20] drop-shadow-[0_-20px_25px_rgba(0,0,0,0.05)]">
      {/* Concave Curve SVG */}
      <svg 
        className="absolute top-0 left-0 w-full h-[70px] sm:h-[120px] -translate-y-[calc(100%-1px)] pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
          className="work-curve" 
          d="M 0 0 Q 50 200 100 0 L 100 100 L 0 100 Z" 
          fill="#ffffff" 
        />
      </svg>
      <div className="max-w-screen-2xl mx-auto flex flex-col">
        {/* Massive Headline */}
        <div className="overflow-hidden mb-8 sm:mb-16">
          <h2 className="font-inter work-title text-4xl sm:text-7xl lg:text-[90px] font-medium tracking-tight leading-[1.1] max-w-4xl text-[#1C1D20] break-words">
            {t('work.title')}
          </h2>
        </div>

        {/* Filters and View Toggles */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 sm:mb-16">
          {/* Filter pills: scrollable on mobile, wrapping on desktop */}
          <div className="flex items-center gap-3 overflow-x-auto md:overflow-x-visible md:flex-wrap pb-1 md:pb-0 w-full md:w-auto scroll-smooth" style={{ scrollbarWidth: 'none' }}>
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setFilter(cat)}
                className={`work-filter flex-shrink-0 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 border ${
                  filter === cat
                    ? "bg-[#1C1D20] text-white border-[#1C1D20]"
                    : "bg-transparent text-[#1C1D20] border-[#1C1D20]/20 hover:border-[#1C1D20]"
                }`}
              >
                {displayCategories[cat as keyof typeof displayCategories]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={() => setViewMode("list")}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 border ${viewMode === 'list' ? 'bg-[#1C1D20] text-white border-[#1C1D20]' : 'bg-transparent text-[#1C1D20] border-[#1C1D20]/20 hover:border-[#1C1D20]'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
              </svg>
            </button>
            <button 
              onClick={() => setViewMode("grid")}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 border ${viewMode === 'grid' ? 'bg-[#1C1D20] text-white border-[#1C1D20]' : 'bg-transparent text-[#1C1D20] border-[#1C1D20]/20 hover:border-[#1C1D20]'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <rect x="14" y="14" width="6" height="6" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {viewMode === "list" ? (
            <div className="w-full">
              <div className="hidden lg:flex w-full items-center justify-between py-6 border-b border-[#1C1D20]/10 text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40">
                <div className="w-[45%]">{t('work.project')}</div>
                <div className="w-[20%]">{t('work.domain')}</div>
                <div className="w-[25%]">{t('work.services')}</div>
                <div className="w-[10%] text-right">{t('work.year')}</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {filteredProjects.map((proj, idx) => {
                  const isHovered = modalData.active && modalData.index === idx;
                  return (
                  <div
                    key={proj.id}
                    onClick={() => handleProjectClick(proj.id)}
                    onMouseEnter={() => setModalData({ active: true, index: idx })}
                    onMouseLeave={() => setModalData({ active: false, index: idx })}
                    onTouchStart={() => setModalData({ active: true, index: idx })}
                    onTouchEnd={() => setModalData({ active: false, index: idx })}
                    className="work-item relative flex flex-col lg:flex-row lg:items-center justify-between py-6 sm:py-10 lg:py-14 border-b border-[#1C1D20]/20 cursor-pointer gap-2 lg:gap-0"
                  >
                    <div className="w-full lg:w-[45%] pr-4">
                      <h3 className={`font-inter text-2xl sm:text-3xl lg:text-[40px] font-normal tracking-tight transition-all duration-500 leading-[1.2] lg:leading-[1.1] ${isHovered ? 'translate-x-4 text-black/40' : ''}`}>
                        {proj.title}
                      </h3>
                    </div>
                    
                    {/* Mobile-only compact info */}
                    <div className="w-full flex lg:hidden items-center justify-between text-xs sm:text-sm text-[#1C1D20]/60 uppercase tracking-widest font-semibold mt-2">
                      <span>{proj.domain}</span>
                      <span>{proj.year}</span>
                    </div>

                    {/* Desktop-only columns */}
                    <div className={`hidden lg:block lg:w-[20%] text-sm sm:text-base transition-colors duration-500 pr-4 ${isHovered ? 'text-black/40' : 'text-[#1C1D20]/80'}`}>
                      {proj.domain}
                    </div>
                    <div className={`hidden lg:block lg:w-[25%] text-sm sm:text-base transition-colors duration-500 pr-4 line-clamp-2 ${isHovered ? 'text-black/40' : 'text-[#1C1D20]/80'}`}>
                      {proj.tags.slice(0, 4).join(" & ")} {proj.tags.length > 4 && "..."}
                    </div>
                    <div className={`hidden lg:block lg:w-[10%] text-right text-sm sm:text-base transition-colors duration-500 ${isHovered ? 'text-black/40' : 'text-[#1C1D20]/80'}`}>
                      {proj.year}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-16">
              {filteredProjects.map((proj, idx) => {
                const isHovered = modalData.active && modalData.index === idx;
                return (
                <div 
                  key={proj.id}
                  onClick={() => handleProjectClick(proj.id)}
                  onMouseEnter={() => setModalData({ active: true, index: idx })}
                  onMouseLeave={() => setModalData({ active: false, index: idx })}
                  onTouchStart={() => setModalData({ active: true, index: idx })}
                  onTouchEnd={() => setModalData({ active: false, index: idx })}
                  className="work-item cursor-pointer flex flex-col"
                >
                  <div className="w-full relative rounded-lg overflow-hidden mb-6 bg-gray-100 flex items-center justify-center">
                    <img 
                      src={(proj as any).image || "/Background_photo.jpg"} 
                      alt={proj.title} 
                      className={`w-full h-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isHovered ? 'scale-105' : ''}`} 
                    />
                  </div>
                  <h3 className={`font-inter text-2xl sm:text-3xl font-medium tracking-tight mb-2 decoration-2 underline-offset-4 ${isHovered ? 'underline' : ''}`}>
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-[#1C1D20]/60 uppercase tracking-wider mb-2">
                    <span>{proj.year}</span>
                    <span className="w-1 h-1 rounded-full bg-[#1C1D20]/40"></span>
                    <span>{Array.isArray(proj.category) ? proj.category.join(", ") : proj.category}</span>
                  </div>
                  <p className="text-base text-[#1C1D20]/80 line-clamp-2">
                    {proj.shortDesc}
                  </p>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
    </section>
    </div>

    {/* Mouse Follower Modal Container (List Mode Only) */}
    <div
      ref={modalRef}
      className="pointer-events-none fixed top-0 left-0 w-[400px] h-[225px] bg-transparent overflow-hidden flex items-center justify-center rounded-lg shadow-2xl z-50 scale-0 opacity-0 hidden md:flex"
    >
      <div 
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${modalData.index * -100}%)` }}
      >
        {filteredProjects.map((proj, idx) => (
          <div key={idx} className="w-full h-full flex items-center justify-center relative bg-gray-100">
            <img src={(proj as any).image || "/Background_photo.jpg"} alt={proj.title} className="w-full h-full object-contain rounded-md shadow-sm" />
          </div>
        ))}
      </div>
    </div>

    {/* View Cursor Label */}
    <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 w-24 h-24 bg-[#455CE9] rounded-full z-[70] items-center justify-center scale-0 opacity-0 hidden md:flex shadow-[0_10px_30px_rgba(69,92,233,0.4)]" />
    <div ref={cursorLabelRef} className="pointer-events-none fixed top-0 left-0 text-white font-bold text-sm z-[70] scale-0 opacity-0 hidden md:flex tracking-widest">
      {t('work.view')}
    </div>
    </>
  );
}

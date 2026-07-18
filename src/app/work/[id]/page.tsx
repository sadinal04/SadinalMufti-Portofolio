"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPortfolioData } from "@/data/portfolio";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const container = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);

  const project = portfolioData.projects.find((p) => p.id === params.id);
  const relatedProjects = portfolioData.projects
    .filter((p) => p.category === project?.category && p.id !== project?.id)
    .slice(0, 3);

  useGSAP(() => {
    if (container.current) {
      gsap.fromTo(
        ".reveal-element",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );

      if (document.querySelector(".insight-container")) {
        gsap.fromTo(
          ".insight-card",
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".insight-container",
              start: "top 85%",
            }
          }
        );
      }
    }
  }, { scope: container });

  useEffect(() => {
    // Custom Cursor tracking logic for More Work section
    let moveCursorX: any, moveCursorY: any, moveLabelX: any, moveLabelY: any;
    if (cursorRef.current && cursorLabelRef.current) {
      moveCursorX = gsap.quickTo(cursorRef.current, "left", { duration: 0.5, ease: "power3" });
      moveCursorY = gsap.quickTo(cursorRef.current, "top", { duration: 0.5, ease: "power3" });
      moveLabelX = gsap.quickTo(cursorLabelRef.current, "left", { duration: 0.45, ease: "power3" });
      moveLabelY = gsap.quickTo(cursorLabelRef.current, "top", { duration: 0.45, ease: "power3" });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (moveCursorX) moveCursorX(clientX);
      if (moveCursorY) moveCursorY(clientY);
      if (moveLabelX) moveLabelX(clientX);
      if (moveLabelY) moveLabelY(clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!project) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-[#1C1D20]">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <button onClick={() => router.push("/")} className="underline text-lg hover:text-[#455CE9] transition-colors">Back to Home</button>
      </div>
    );
  }

  return (
    <main ref={container} className="w-full min-h-screen bg-white text-[#1C1D20] flex flex-col px-4 sm:px-12 pt-28 pb-16 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto w-full mt-4">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16">
          
          {/* Left: Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 pt-2 lg:pt-0">
            <h1 className="reveal-element text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1]">
              {project.title}
            </h1>
            
            {/* Meta Info (Domain, Category, Year) */}
            <div className="reveal-element flex flex-col sm:flex-row gap-6 sm:gap-12 border-b border-[#1C1D20]/10 pb-8 mt-2">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40">Domain</span>
                <span className="text-lg font-medium">{project.domain}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40">Category & Role</span>
                <span className="text-lg font-medium">{Array.isArray(project.category) ? project.category.join(", ") : project.category}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40">Year</span>
                <span className="text-lg font-medium">{project.year}</span>
              </div>
            </div>

            {/* Links Section */}
            {((project as any).linkWeb || (project as any).linkGithub || (project as any).linkNotebook) && (
              <div className="reveal-element flex flex-col gap-4 mt-6">
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40">Live Links & Docs</h3>
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
                  {(project as any).linkWeb && (
                    <a href={(project as any).linkWeb.startsWith('http') ? (project as any).linkWeb : `https://${(project as any).linkWeb}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-lg font-medium hover:text-[#455CE9] transition-colors duration-300">
                      Visit Website <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                    </a>
                  )}
                  {(project as any).linkGithub && (
                    <a href={(project as any).linkGithub} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-lg font-medium hover:text-[#455CE9] transition-colors duration-300">
                      View on GitHub <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                    </a>
                  )}
                  {(project as any).linkNotebook && (
                    <a href={(project as any).linkNotebook} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-lg font-medium hover:text-[#455CE9] transition-colors duration-300">
                      View Document <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="reveal-element w-full relative rounded-2xl overflow-hidden bg-[#1C1D20]/5 flex items-center justify-center">
              <img 
                src={(project as any).images?.[0] || (project as any).image || "/Background_photo.jpg"} 
                alt={project.title} 
                className="w-full h-auto transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hover:scale-[1.03]" 
              />
            </div>
          </div>

        </div>



        {/* Full-width Content Sections */}
        <div className="flex flex-col gap-16 mt-16 lg:mt-24 w-full">
          
          {/* 01 - Overview */}
          <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section border-t border-[#1C1D20]/10 pt-16">
            <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
              <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">01 &mdash; Overview</span>
            </h3>
            <div className="md:col-span-9">
              <p className="text-xl sm:text-2xl font-light leading-relaxed text-[#1C1D20]/90 text-justify">
                {project.fullDesc}
              </p>
            </div>
          </div>

          {/* 02 - Key Insights */}
          {(project as any).keyInsights && (
            <div className="insight-container grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section border-t border-[#1C1D20]/10 pt-16">
              <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500 reveal-element">
                <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">02 &mdash; Key Insights</span>
              </h3>
              <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                {(project as any).keyInsights.map((insight: any, i: number) => (
                  <div 
                    key={i} 
                    className="insight-card group flex flex-col gap-3 bg-white border border-[#1C1D20]/10 hover:border-[#455CE9] hover:bg-[#455CE9] p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_transparent] hover:shadow-[0_10px_30px_rgba(69,92,233,0.2)] cursor-default"
                  >
                    <h4 className="text-lg font-bold tracking-tight text-[#1C1D20] group-hover:text-white leading-snug transition-colors duration-300">{insight.title}</h4>
                    <p className="text-sm sm:text-base text-[#1C1D20]/80 group-hover:text-white/90 leading-relaxed transition-colors duration-300">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 03 - Outcome */}
          {(project as any).outcome && (
            <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section border-t border-[#1C1D20]/10 pt-16">
              <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
                <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">03 &mdash; Outcome</span>
              </h3>
              <div className="md:col-span-9">
                <ul className="flex flex-col gap-4">
                  {(project as any).outcome.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#455CE9] mt-2.5 flex-shrink-0 opacity-80" />
                      <span className="text-base sm:text-lg font-light leading-relaxed text-[#1C1D20]/90 text-justify">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* 04 - Tech Stack */}
          <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section border-t border-[#1C1D20]/10 pt-16">
            <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500 reveal-element">
              <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">04 &mdash; Tech Stack</span>
            </h3>
            <div className="md:col-span-9 flex flex-wrap gap-3">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 border border-[#1C1D20]/10 rounded-full text-sm font-medium hover:bg-[#455CE9] hover:text-white hover:border-[#455CE9] transition-all duration-300 cursor-default shadow-[0_4px_20px_transparent] hover:shadow-[0_10px_30px_rgba(69,92,233,0.2)] hover:-translate-y-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
        </div>

        {/* Full-width Metrics Card */}
        {(project as any).metrics && (
          <div className="reveal-element w-full bg-[#1C1D20] text-white rounded-3xl p-6 sm:p-8 mb-12 mt-8 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6 lg:gap-x-12">
              {(project as any).metrics.map((metric: any, i: number) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="text-lg sm:text-xl font-medium tracking-tight leading-snug">{metric.value}</span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/40">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full-width Sections */}
        {(project as any).sections && (
          <div className="flex flex-col gap-16 py-16 border-b border-[#1C1D20]/10">
            {(project as any).sections.map((section: any, i: number) => (
              <div key={i} className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section">
                <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
                  <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">
                    0{i + 1} &mdash; {section.title}
                  </span>
                </h3>
                <div className="md:col-span-9 relative group/sectionContent py-2">
                  {/* Background line (gray) */}
                  <div className="absolute top-0 bottom-0 left-[-16px] sm:left-[-24px] w-[2px] bg-[#1C1D20]/10 hidden md:block" />
                  {/* Animated Foreground line (blue) */}
                  <div className="absolute top-0 bottom-0 left-[-16px] sm:left-[-24px] w-[2px] bg-[#455CE9] origin-top scale-y-0 group-hover/sectionContent:scale-y-100 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] hidden md:block" />
                  
                  <ul className="flex flex-col gap-6">
                    {section.list.map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#455CE9] mt-2.5 flex-shrink-0 opacity-80" />
                        <span className="text-base sm:text-lg font-light leading-relaxed text-[#1C1D20]/90 text-justify">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="max-w-screen-2xl mx-auto w-full mt-24 border-t border-[#1C1D20]/10 pt-16">
          <h2 className="reveal-element text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#1C1D20]/40 mb-10">
            More {project.category} Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {relatedProjects.map((proj) => (
              <Link 
                href={`/work/${proj.id}`} 
                key={proj.id} 
                className="reveal-element group cursor-pointer flex flex-col"
                onMouseEnter={() => {
                  gsap.to([cursorRef.current, cursorLabelRef.current], { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" });
                }}
                onMouseLeave={() => {
                  gsap.to([cursorRef.current, cursorLabelRef.current], { scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" });
                }}
              >
                  <div className="w-full relative rounded-2xl overflow-hidden mb-6 bg-[#1C1D20]/5 flex items-center justify-center border border-[#1C1D20]/5 group-hover:border-[#455CE9]/30 transition-colors duration-500">
                    <img 
                      src={(proj as any).image || "/Background_photo.jpg"} 
                      alt={proj.title} 
                      className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-105" 
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight mb-2 group-hover:text-[#455CE9] transition-colors duration-300">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-[#1C1D20]/40 uppercase tracking-widest mb-2">
                    <span>{proj.year}</span>
                    <span className="w-1 h-1 rounded-full bg-[#1C1D20]/20"></span>
                    <span>{proj.category}</span>
                  </div>
                  <p className="text-sm text-[#1C1D20]/80 line-clamp-2">
                    {proj.shortDesc}
                  </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* View Cursor Label */}
      <div ref={cursorRef} className="pointer-events-none fixed top-0 left-0 w-24 h-24 bg-[#455CE9] rounded-full z-[70] items-center justify-center -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 hidden md:flex shadow-[0_10px_30px_rgba(69,92,233,0.4)]" />
      <div ref={cursorLabelRef} className="pointer-events-none fixed top-0 left-0 text-white font-bold text-sm z-[70] -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0 hidden md:flex tracking-widest">
        {t('work.view')}
      </div>
    </main>
  );
}

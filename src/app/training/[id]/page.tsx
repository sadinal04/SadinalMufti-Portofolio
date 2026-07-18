"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { getPortfolioData } from "@/data/portfolio";
import { useLanguage } from "@/context/LanguageContext";

export default function TrainingDetail() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const portfolioData = getPortfolioData(language);
  const container = useRef<HTMLDivElement>(null);
  const [showPdf, setShowPdf] = useState(false);
  
  const course = portfolioData.courses.find((c: any) => c.id === params.id) as any;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (course && container.current) {
      gsap.fromTo(
        ".reveal-element",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.1 }
      );
    }
  }, [course]);

  if (!course) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-[#1C1D20]">
        <h1 className="text-2xl mb-4">Training program not found</h1>
        <button onClick={() => router.push("/")} className="underline">Return Home</button>
      </div>
    );
  }

  return (
    <main ref={container} className="w-full min-h-screen bg-white text-[#1C1D20] flex flex-col pb-32">
      


      {/* Hero Section */}
      <section className="w-full pt-32 pb-16 px-4 sm:px-12 max-w-screen-2xl mx-auto relative overflow-hidden">
        
        {/* Animated Right Graphic */}
        <div className="hidden lg:flex absolute right-12 top-24 w-64 h-64 items-center justify-center opacity-40 hover:opacity-100 group pointer-events-auto transition-opacity duration-500 cursor-default">
          <div className="absolute inset-0 border-[1px] border-dashed border-[#1C1D20]/30 rounded-full animate-[spin_20s_linear_infinite] group-hover:animate-[spin_10s_linear_infinite] group-hover:border-[#455CE9]/50 transition-colors duration-500" />
          <div className="absolute inset-4 border-[1px] border-[#1C1D20]/10 rounded-full animate-[spin_15s_linear_infinite_reverse] group-hover:animate-[spin_8s_linear_infinite_reverse] group-hover:scale-110 transition-transform duration-700" />
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_15s_linear_infinite] group-hover:animate-[spin_5s_linear_infinite]">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
            <text className="text-[9.5px] font-bold tracking-[0.1em] uppercase fill-[#1C1D20] group-hover:fill-[#455CE9] transition-colors duration-500">
              <textPath href="#circlePath" startOffset="0%">
                • MACHINE LEARNING PATH • DICODING 
              </textPath>
            </text>
          </svg>
          <div className="absolute w-12 h-12 bg-[#455CE9] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(69,92,233,0.4)] group-hover:scale-125 transition-transform duration-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
        </div>

        <div className="reveal-element relative z-10 w-full lg:w-3/4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1C1D20]/10 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#455CE9] animate-pulse" />
            {course.provider}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-12">
            {course.program}
          </h1>
        </div>

        <div className="reveal-element grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-[#1C1D20]/10">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1C1D20]/40">Role</span>
            <span className="text-lg sm:text-xl font-medium">{course.role}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1C1D20]/40">Duration</span>
            <span className="text-lg sm:text-xl font-medium">{course.duration}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1C1D20]/40">Intensity</span>
            <span className="text-lg sm:text-xl font-medium">{course.learningHours}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#1C1D20]/40">Mentoring</span>
            <span className="text-lg sm:text-xl font-medium">{course.mentoringSessions}</span>
          </div>
        </div>

        {course.certificateLink && (
          <div className="reveal-element mt-12 flex justify-start">
            <button 
              onClick={() => setShowPdf(true)}
              className="group flex items-center gap-6 pl-8 pr-2 py-2 bg-[#1C1D20] text-white rounded-full text-sm font-bold tracking-widest uppercase hover:bg-[#455CE9] transition-colors duration-500 shadow-xl"
            >
              View Certificate
              <div className="w-12 h-12 bg-white text-[#1C1D20] rounded-full flex items-center justify-center group-hover:scale-95 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-45 transition-transform duration-300"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* Content Section */}
      <section className="w-full px-4 sm:px-12 max-w-screen-2xl mx-auto flex flex-col gap-24 pt-12">
        
        {/* Tentang Program */}
        <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group">
          <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover:text-[#455CE9] transition-colors duration-500">
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-3">01 &mdash; Summary</span>
          </h3>
          <div className="md:col-span-9">
            <p className="text-2xl sm:text-3xl font-light leading-relaxed text-[#1C1D20]/90 text-justify">
              {course.description}
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#1C1D20]/10 reveal-element" />

        {/* Yang Saya Pelajari */}
        <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section">
          <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
            <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">02 &mdash; Learning Path</span>
          </h3>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            
            <div className="flex flex-col">
              <h4 className="text-xl font-medium mb-6 text-[#1C1D20]">Programming & Data</h4>
              <ul className="flex flex-col gap-3">
                {["Python Programming", "Git & GitHub", "SQL Database", "Data Analysis & Visualization"].map((item, i) => (
                  <li key={i} className="group flex items-center justify-between p-4 sm:p-5 border border-[#1C1D20]/10 rounded-2xl hover:bg-[#455CE9] hover:border-[#455CE9] transition-all duration-300 cursor-default shadow-[0_4px_20px_transparent] hover:shadow-[0_10px_30px_rgba(69,92,233,0.2)] hover:-translate-y-1">
                    <span className="text-sm sm:text-base text-[#1C1D20] font-medium group-hover:text-white transition-colors duration-300">{item}</span>
                    <div className="w-8 h-8 rounded-full bg-[#1C1D20]/5 group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#1C1D20]/40 group-hover:text-[#455CE9] transition-all duration-300"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="text-xl font-medium mb-6 text-[#1C1D20]">Machine Learning</h4>
              <ul className="flex flex-col gap-3">
                {["Supervised & Unsupervised Learning", "Feature Engineering & Evaluation", "Deep Learning & Computer Vision", "Natural Language Processing (NLP)"].map((item, i) => (
                  <li key={i} className="group flex items-center justify-between p-4 sm:p-5 border border-[#1C1D20]/10 rounded-2xl hover:bg-[#455CE9] hover:border-[#455CE9] transition-all duration-300 cursor-default shadow-[0_4px_20px_transparent] hover:shadow-[0_10px_30px_rgba(69,92,233,0.2)] hover:-translate-y-1">
                    <span className="text-sm sm:text-base text-[#1C1D20] font-medium group-hover:text-white transition-colors duration-300">{item}</span>
                    <div className="w-8 h-8 rounded-full bg-[#1C1D20]/5 group-hover:bg-white flex items-center justify-center transition-colors duration-300">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#1C1D20]/40 group-hover:text-[#455CE9] transition-all duration-300"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col md:col-span-2">
              <h4 className="text-xl font-medium mb-6 text-[#1C1D20]">Professional Skills</h4>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Personal Productivity", "Growth Mindset", "Communication", "Personal Branding", "Interview Preparation", "Business Presentation"].map((item, i) => (
                  <li key={i} className="group flex items-center gap-4 p-4 border border-[#1C1D20]/10 rounded-2xl hover:bg-[#1C1D20] hover:border-[#1C1D20] transition-all duration-300 cursor-default hover:-translate-y-1">
                    <div className="w-2 h-2 rounded-full bg-[#455CE9] group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-sm font-medium text-[#1C1D20] group-hover:text-white transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="w-full h-[1px] bg-[#1C1D20]/10 reveal-element" />

        {/* Mentoring & Capstone */}
        <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section">
          <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
            <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">03 &mdash; Project</span>
          </h3>
          <div className="md:col-span-9 flex flex-col gap-12">
            
            <div className="relative group py-2 cursor-default">
              <div className="absolute top-0 bottom-0 left-[-16px] sm:left-[-24px] w-[2px] bg-[#1C1D20]/10 group-hover:bg-[#455CE9] transition-colors duration-500" />
              <h4 className="text-2xl sm:text-3xl font-medium mb-4 text-[#1C1D20] group-hover:text-[#455CE9] transition-colors duration-300">Industry Mentoring</h4>
              <p className="text-xl sm:text-2xl font-light text-[#1C1D20]/90 leading-relaxed transition-colors duration-300 text-justify">
                Mengikuti 18 sesi mentoring mingguan bersama praktisi dan mentor industri. Proses ini mencakup review progres mingguan, diskusi teknis mengenai best-practice implementasi Machine Learning di dunia nyata, hingga bimbingan intensif untuk menyelesaikan Capstone Project.
              </p>
            </div>
            
            <div className="relative group py-2 cursor-default">
              <div className="absolute top-0 bottom-0 left-[-16px] sm:left-[-24px] w-[2px] bg-[#1C1D20]/10 group-hover:bg-[#455CE9] transition-colors duration-500" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1C1D20]/20 text-[10px] font-bold tracking-widest uppercase mb-4 text-[#1C1D20]/70 group-hover:border-[#455CE9]/30 group-hover:text-[#455CE9] transition-colors duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#455CE9] animate-pulse" />
                AI Product
              </div>
              <h4 className="text-2xl sm:text-3xl font-medium mb-4 text-[#1C1D20] group-hover:text-[#455CE9] transition-colors duration-300">Capstone Project</h4>
              <p className="text-xl sm:text-2xl font-light text-[#1C1D20]/90 leading-relaxed transition-colors duration-300 text-justify">
                Berkolaborasi dalam tim multidisiplin yang terdiri dari Machine Learning Engineer dan Web Developer. Kami ditantang untuk mengembangkan solusi AI <i>end-to-end</i> guna menyelesaikan permasalahan nyata. Seluruh siklus pengembangan dilakukan menggunakan <i>workflow</i> standar industri, mulai dari tahap ideasi, pengumpulan dan rekayasa data, pelatihan model, pembuatan API, integrasi sistem, hingga presentasi bisnis di tahap akhir.
              </p>
            </div>

          </div>
        </div>

        <div className="w-full h-[1px] bg-[#1C1D20]/10 reveal-element" />

        {/* Teknologi yang Digunakan */}
        <div className="reveal-element grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 group/section">
          <h3 className="md:col-span-3 text-sm font-semibold uppercase tracking-widest text-[#1C1D20]/40 group-hover/section:text-[#455CE9] transition-colors duration-500">
            <span className="inline-block transition-transform duration-500 group-hover/section:translate-x-3">04 &mdash; Tech Stack</span>
          </h3>
          <div className="md:col-span-9 flex flex-wrap gap-3">
            {["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras", "SQL", "Git", "GitHub", "Google Colab", "Jupyter Notebook"].map((tech, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full border border-[#1C1D20]/20 text-sm font-medium text-[#1C1D20]/80 hover:border-[#455CE9] hover:text-[#455CE9] transition-colors cursor-default bg-[#F8F9FA]">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </section>

      {/* PDF Popup Modal */}
      {showPdf && course.certificateLink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1D20]/90 backdrop-blur-md p-4 sm:p-8 md:p-12">
          <div className="relative w-full max-w-6xl h-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-[#1C1D20]/10 bg-[#F8F9FA]">
              <div className="flex flex-col">
                <h3 className="text-[#1C1D20] font-semibold tracking-wide text-lg">Certificate of Completion</h3>
                <span className="text-xs text-[#1C1D20]/50 uppercase tracking-widest">{course.provider}</span>
              </div>
              <button 
                onClick={() => setShowPdf(false)} 
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1C1D20]/5 hover:bg-red-500 hover:text-white transition-all group"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 w-full bg-[#E5E7EB]">
              <iframe 
                src={course.certificateLink} 
                className="w-full h-full border-none" 
                title="Certificate PDF Viewer"
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

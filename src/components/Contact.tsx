"use client";

import React, { useRef } from "react";
import Magnetic from "./Magnetic";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="w-full h-full flex flex-col justify-between py-24 sm:py-32 px-4 sm:px-12 bg-[#1C1D20] text-[#E3E3E3]">
      <div className="max-w-screen-2xl mx-auto w-full h-full flex flex-col justify-between">
        
        {/* Top Section with Avatar & Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
          <div className="flex items-center gap-6 mb-8 sm:mb-0">
            <div className="w-20 h-20 rounded-full overflow-hidden relative">
              <Image src="/profil_photo.jpeg" alt="Avatar" fill sizes="10vw" className="object-cover" />
            </div>
            <h3 className="font-inter text-3xl font-light">{t('contact.letswork')}</h3>
          </div>
          
          <Magnetic>
            <a href="mailto:muftisadinal@gmail.com" className="px-8 py-4 bg-white text-[#1C1D20] rounded-full text-lg font-medium hover:bg-gray-200 transition-colors inline-block">
              {t('contact.getintouch')}
            </a>
          </Magnetic>
        </div>

      {/* Center Giant Text */}
      <div className="flex flex-col items-center justify-center flex-1">
        <h2 className="font-inter text-[12vw] sm:text-[10vw] font-bold leading-none tracking-tighter uppercase">
          {t('contact.together')}
        </h2>
      </div>

      {/* Bottom Contact Info & Links */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end gap-12 sm:gap-4 mt-8 pt-8 border-t border-[#E3E3E3]/20">
        <div className="flex flex-col gap-2 text-center sm:text-left text-lg sm:text-xl font-light">
          <Magnetic>
            <a href="mailto:muftisadinal@gmail.com" className="hover:text-white transition-colors block">muftisadinal@gmail.com</a>
          </Magnetic>
          <Magnetic>
            <a href="tel:+6285337342258" className="hover:text-white transition-colors block">+62 853 3734 2258</a>
          </Magnetic>
        </div>

        <div className="flex flex-wrap gap-6 sm:gap-8 text-lg sm:text-xl font-medium">
          <Magnetic>
            <a href="https://www.linkedin.com/in/sadinal-mufti/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </Magnetic>
          <Magnetic>
            <a href="https://github.com/sadinal04" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </Magnetic>
          <Magnetic>
            <a href="https://www.instagram.com/sadinal_mufti/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
          </Magnetic>
        </div>
      </div>
      </div>
    </section>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.about": "About",
    "nav.work": "Work",
    "nav.awards": "Awards",
    "nav.awards_achievements": "Award & Achievements",
    "nav.contact": "Contact",
    "nav.navigation": "Navigation",
    "nav.socials": "Socials",
    
    // Hero
    "hero.available": "Available for Work",
    "hero.scroll": "SCROLL TO EXPLORE",
    "hero.scroll.desc": "Projects • Achievements • Certifications",
    "hero.location": "Located <br /> in Aceh, <br /> Indonesia",
    
    // About
    "about.title": "About Me",
    "about.hello": "Hello! I'm",
    "about.headline": "Transforming Data into Intelligent Solutions",
    "about.resume": "Resume",
    "about.stats.projects": "Projects & Competitions",
    "about.stats.gpa": "GPA Cum Laude",
    "about.stats.certs": "Professional Certs",
    "about.based": "Based in Aceh, ID",
    "about.cv": "View My CV",
    "about.contact": "Get In Touch",
    "about.explore": "Explore Details",
    "about.view_awards": "View Awards & Achievements",
    "about.org_experience": "Campus Organization Experience",
    "about.duration": "Duration",
    "about.learning_hours": "Learning Hours",
    "about.mentoring": "Industry Mentoring",
    "about.capstone": "Capstone Project",
    "about.core_learning": "Core Learning Areas",
    "about.no_details": "No additional details available.",
    
    // Awards
    "awards.read_story": "Read Story",
    "awards.cert_title": "Professional Certifications",
    "awards.skills": "Skills Acquired",
    "awards.doc_gallery": "Documentation Gallery",
    "awards.title": "Awards &\nAchievements",
    "awards.subtitle": "A curated collection of my top competition wins and mobility programs, complete with documentation galleries.",
    
    // Contact
    "contact.letswork": "Let's work",
    "contact.getintouch": "Get in touch",
    "contact.together": "Together",
    
    // About
    "about.about": "ABOUT",
    "about.experience": "EXPERIENCE",
    "about.education": "EDUCATION",
    "about.bootcamp": "BOOTCAMP & TRAINING",
    "about.projects": "15+ Projects",
    "about.gpa": "3.70 GPA",
    "about.certs": "15+ Certs",
    
    // Work
    "work.title": "Selected Works & Projects",
    "work.all": "All",
    "work.data": "Data & AI Solution",
    "work.web": "Web Development",
    "work.project": "PROJECT",
    "work.domain": "DOMAIN",
    "work.services": "SERVICES",
    "work.year": "YEAR",
    "work.view": "VIEW",
    
    // Contact
    "contact.title": "Let's Work Together",
    "contact.desc": "I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.",
    "contact.email": "Email",
    "contact.social": "Social",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",
    "contact.instagram": "Instagram",
    "contact.rights": "© 2025 Sadinal Mufti. All rights reserved.",
    "contact.localTime": "Local time",
    "contact.role": "Data Scientist & Web Developer"
  },
  id: {
    // Navigation
    "nav.about": "Tentang",
    "nav.work": "Proyek",
    "nav.awards": "Pencapaian",
    "nav.awards_achievements": "Prestasi & Pencapaian",
    "nav.contact": "Kontak",
    "nav.navigation": "Navigasi",
    "nav.socials": "Sosial",
    
    // Hero
    "hero.available": "Tersedia untuk Bekerja",
    "hero.scroll": "SCROLL UNTUK EKSPLOR",
    "hero.scroll.desc": "Proyek • Pencapaian • Sertifikasi",
    "hero.location": "Berlokasi <br /> di Aceh, <br /> Indonesia",
    
    // About
    "about.title": "Tentang Saya",
    "about.hello": "Halo! Saya",
    "about.headline": "Mengubah Data menjadi Solusi Cerdas",
    "about.resume": "Resume",
    "about.stats.projects": "Proyek & Kompetisi",
    "about.stats.gpa": "IPK Cum Laude",
    "about.stats.certs": "Sertifikat Profesional",
    "about.based": "Berbasis di Aceh, ID",
    "about.cv": "Lihat CV Saya",
    "about.contact": "Hubungi Saya",
    "about.explore": "Eksplor Detail",
    "about.view_awards": "Lihat Prestasi & Pencapaian",
    "about.org_experience": "Pengalaman Organisasi Kampus",
    "about.duration": "Durasi",
    "about.learning_hours": "Jam Belajar",
    "about.mentoring": "Sesi Mentoring",
    "about.capstone": "Proyek Capstone",
    "about.core_learning": "Area Pembelajaran Utama",
    "about.no_details": "Tidak ada detail tambahan yang tersedia.",
    
    // Awards
    "awards.read_story": "Baca Cerita",
    "awards.cert_title": "Sertifikasi Profesional",
    "awards.skills": "Keahlian Diperoleh",
    "awards.doc_gallery": "Galeri Dokumentasi",
    "awards.title": "Prestasi &\nPencapaian",
    "awards.subtitle": "Kumpulan pencapaian terbaik saya dari berbagai kompetisi dan program pertukaran, dilengkapi dengan galeri dokumentasi.",
    
    // Contact
    "contact.letswork": "Mari bekerja",
    "contact.getintouch": "Hubungi Saya",
    "contact.together": "Bersama",
    
    // About
    "about.about": "TENTANG",
    "about.experience": "PENGALAMAN",
    "about.education": "PENDIDIKAN",
    "about.bootcamp": "BOOTCAMP & PELATIHAN",
    "about.projects": "15+ Proyek",
    "about.gpa": "3.70 IPK",
    "about.certs": "15+ Sertifikat",
    
    // Work
    "work.title": "Karya & Proyek Pilihan",
    "work.all": "Semua",
    "work.data": "Data & AI Solution",
    "work.web": "Web Development",
    "work.project": "PROYEK",
    "work.domain": "DOMAIN",
    "work.services": "LAYANAN",
    "work.year": "TAHUN",
    "work.view": "LIHAT",
    
    // Contact
    "contact.title": "Mari Bekerja Sama",
    "contact.desc": "Saya selalu terbuka untuk mendiskusikan proyek baru, ide-ide kreatif, atau peluang untuk menjadi bagian dari visi Anda.",
    "contact.email": "Email",
    "contact.social": "Media Sosial",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",
    "contact.instagram": "Instagram",
    "contact.rights": "© 2025 Sadinal Mufti. Hak Cipta Dilindungi.",
    "contact.localTime": "Waktu lokal",
    "contact.role": "Data Scientist & Web Developer"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  // Initialize from localStorage if available
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const savedLang = localStorage.getItem('preferred_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

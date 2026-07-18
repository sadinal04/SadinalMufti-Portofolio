import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import TransitionOverlay from "@/components/TransitionOverlay";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sadinal Mufti | Data & AI Enthusiast",
  description: "Portfolio of Sadinal Mufti, a Data & AI Enthusiast showcasing projects in Data Analysis, Machine Learning, Deep Learning, and Artificial Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-[#E3E3E3] text-[#1C1D20]" style={{ overflowX: 'clip' }}>
        <LanguageProvider>
          <TransitionOverlay />
          <SmoothScroll />
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

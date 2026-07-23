import Hero from "@/components/Hero";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Main Content Area */}
      <main className="w-full relative z-10 mb-[90vh] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#E3E3E3]">
        {/* Sticky Hero Section */}
        <div className="sticky top-0 z-0 h-[calc(100dvh+40px)] w-full">
          <Hero />
        </div>
        
        {/* About overlaps Hero like a curtain */}
        <div className="relative z-10 w-full shadow-2xl">
          <About />
        </div>

        {/* Skills Section */}
        <div className="relative z-10 w-full">
          <Skills />
        </div>

        {/* Work section continues normally */}
        <div className="relative z-10 w-full bg-white">
          <Work />
        </div>

        {/* Awards section */}
        <div className="relative z-10 w-full bg-white">
          <Awards />
          {/* Seamless curve transition to Contact */}
          <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 lg:h-20 bg-[#1C1D20] rounded-t-[2.5rem] sm:rounded-t-[3.5rem] lg:rounded-t-[4.5rem]"></div>
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 w-full h-[90vh] z-0">
        <Contact />
      </footer>
    </div>
  );
}

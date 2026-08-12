'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Abstract SVGs based on the Positivus mockup style
const StarSVG = ({ cx, cy, r, color }: { cx: number, cy: number, r: number, color: string }) => (
  <path
    d={`M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`}
    fill={color}
  />
);

const HeroDecorationsSVG = () => (
  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-[0] opacity-80" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="xMidYMid slice">
    
    {/* Stars - Top Left / Center */}
    <StarSVG cx={150} cy={150} r={10} color="#278DFD" />
    <StarSVG cx={350} cy={80} r={6} color="#000000" />
    <StarSVG cx={600} cy={350} r={5} color="#278DFD" />
    <StarSVG cx={450} cy={600} r={8} color="#000000" />
    <StarSVG cx={250} cy={500} r={4} color="#278DFD" />
    
    {/* Stars - Top Right / Center Right */}
    <StarSVG cx={700} cy={120} r={6} color="#000000" />
    <StarSVG cx={950} cy={200} r={9} color="#278DFD" />
    <StarSVG cx={1100} cy={700} r={12} color="#278DFD" />
    <StarSVG cx={1350} cy={300} r={7} color="#000000" />
    <StarSVG cx={1250} cy={100} r={5} color="#278DFD" />
    
    {/* Solid Dots */}
    <circle cx="100" cy="500" r="4" fill="#000000" opacity="0.3" />
    <circle cx="350" cy="200" r="6" fill="#278DFD" opacity="0.5" />
    <circle cx="650" cy="650" r="3" fill="#000000" opacity="0.4" />
    <circle cx="1000" cy="150" r="5" fill="#278DFD" opacity="0.3" />
    <circle cx="1250" cy="550" r="4" fill="#000000" opacity="0.2" />
    <circle cx="850" cy="450" r="3" fill="#278DFD" opacity="0.4" />
    <circle cx="200" cy="700" r="5" fill="#000000" opacity="0.2" />
    <circle cx="1400" cy="600" r="6" fill="#278DFD" opacity="0.3" />
    
    {/* Hollow Circles / Rings */}
    <circle cx="280" cy="300" r="8" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="800" cy="250" r="12" stroke="#278DFD" strokeWidth="1.5" fill="none" opacity="0.3" />
    <circle cx="1150" cy="450" r="10" stroke="#000000" strokeWidth="1.5" fill="none" opacity="0.2" />
    <circle cx="500" cy="150" r="6" stroke="#278DFD" strokeWidth="1.5" fill="none" opacity="0.4" />
    <circle cx="1300" cy="750" r="14" stroke="#278DFD" strokeWidth="1" fill="none" opacity="0.3" />

    {/* Plus Signs / Crosses */}
    <path d="M 400 495 L 400 505 M 395 500 L 405 500" stroke="#000000" strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />
    <path d="M 900 145 L 900 155 M 895 150 L 905 150" stroke="#278DFD" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    <path d="M 150 345 L 150 355 M 145 350 L 155 350" stroke="#278DFD" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    <path d="M 1050 645 L 1050 655 M 1045 650 L 1055 650" stroke="#000000" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
  </svg>
);
const MegaphoneSVG = () => (
  <svg viewBox="0 0 500 400" className="w-full h-full max-h-[350px] sm:max-h-[450px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Abstract shapes and lines simulating the megaphone illustration */}
    <path d="M150 200 L350 100 L350 300 Z" fill="#278DFD" stroke="#000000" strokeWidth="4"/>
    <circle cx="150" cy="200" r="40" fill="#FFFFFF" stroke="#000000" strokeWidth="4"/>
    <path d="M100 200 L150 200" stroke="#000000" strokeWidth="4" />
    <path d="M400 150 C420 150 450 170 450 200 C450 230 420 250 400 250" stroke="#000000" strokeWidth="4" strokeLinecap="round"/>
    <path d="M380 100 C430 100 480 140 480 200 C480 260 430 300 380 300" stroke="#000000" strokeWidth="4" strokeDasharray="8 8" strokeLinecap="round"/>
    {/* Stars and sparks */}
    <path d="M50 80 L60 100 L80 110 L60 120 L50 140 L40 120 L20 110 L40 100 Z" fill="#278DFD" stroke="#000000" strokeWidth="3"/>
    <path d="M420 50 L425 65 L440 70 L425 75 L420 90 L415 75 L400 70 L415 65 Z" fill="#000000" />
    <circle cx="250" cy="50" r="10" stroke="#000000" strokeWidth="4" fill="transparent"/>
  </svg>
);

const AbstractShapeSVG = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full max-h-[250px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 150 C50 70 120 20 200 50 C280 80 290 180 240 240 C190 300 80 280 50 200" fill="#278DFD" fillOpacity="0.1" />
    <path d="M100 100 L200 100 L150 200 Z" fill="#278DFD" stroke="#000000" strokeWidth="4"/>
    <circle cx="200" cy="200" r="30" fill="#FFFFFF" stroke="#000000" strokeWidth="4"/>
    <path d="M120 50 L140 50 L140 70 L120 70 Z" fill="#000000"/>
  </svg>
);

const SearchIconSVG = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="18" cy="18" r="10" stroke="#000000" strokeWidth="3"/>
    <path d="M25 25 L34 34" stroke="#000000" strokeWidth="3" strokeLinecap="round"/>
    <path d="M10 10 L15 15" stroke="#278DFD" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const PpcIconSVG = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M8 32 L32 8" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
    <path d="M15 8 L32 8 L32 25" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="20" cy="20" r="4" fill="#278DFD"/>
  </svg>
);

const SocialIconSVG = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="8" y="8" width="24" height="24" rx="6" stroke="#FFFFFF" strokeWidth="3"/>
    <circle cx="20" cy="20" r="5" stroke="#FFFFFF" strokeWidth="3"/>
    <circle cx="26" cy="14" r="1.5" fill="#278DFD"/>
  </svg>
);

const EmailIconSVG = () => (
  <svg width="60" height="60" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="4" y="10" width="32" height="20" rx="2" stroke="#000000" strokeWidth="3"/>
    <path d="M4 12 L20 22 L36 12" stroke="#000000" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M10 5 L30 5" stroke="#278DFD" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export default function HomePage() {
  const [, setCurrentSlide] = useState(0);
  const heroImages = [
    "/images/glo-hero1.png",
    "/images/glo-hero2.png",
    "/images/glo-hero3.png",
    "/images/glo-hero4.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      
      {/* ── SECTION 1: HERO ── */}
      <section className="relative max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 pt-24 sm:pt-28 pb-16">
        <HeroDecorationsSVG />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="flex flex-col gap-8 items-start max-w-2xl -mt-16 sm:-mt-28 lg:-mt-36">
            <h1 className="text-6xl sm:text-7xl font-medium text-black leading-[1.1] tracking-tight">
              Navigating the digital landscape for success
            </h1>
            <p className="text-xl text-gray-800 leading-relaxed max-w-xl">
              Our digital marketing agency helps businesses grow and succeed online through a range of services including SEO, PPC, social media marketing, and content creation.
            </p>
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#191A23] hover:bg-black text-white rounded-[14px] text-lg font-medium transition-colors duration-300"
            >
              Book a consultation
            </Link>
          </div>
          {/* Right Column */}
          <div className="relative flex items-center justify-end overflow-visible min-h-[450px] sm:min-h-[600px]">
            {/* The Wheel Container */}
            <div className="absolute right-[-275px] sm:right-[-425px] top-1/2 -translate-y-1/2 w-[550px] h-[550px] sm:w-[850px] sm:h-[850px]">
              {/* Spinning Inner Wrapper */}
              <div 
                className="w-full h-full animate-[spin_40s_linear_infinite]" 
                style={{ animationDirection: 'reverse' }}
              >
                {[...heroImages, ...heroImages].map((src, idx) => (
                  <div 
                    key={`${src}-${idx}`}
                    className="absolute top-1/2 left-1/2 w-full h-full"
                    style={{ transform: `translate(-50%, -50%) rotate(${idx * 45}deg)` }}
                  >
                    {/* The Image Item */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-56 sm:h-56 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl bg-white border-4 sm:border-8 border-white hover:scale-105 transition-transform duration-300">
                      <Image 
                        src={src} 
                        alt={`Hero ${idx + 1}`} 
                        fill 
                        sizes="(max-width: 768px) 128px, 224px" 
                        className="object-cover" 
                        priority={idx < 4} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CLIENT LOGOS ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-12">
        <div className="flex flex-wrap items-center justify-between gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-2xl font-bold font-serif">amazon</span>
          <span className="text-2xl font-bold font-sans tracking-tighter">dribbble</span>
          <span className="text-2xl font-bold font-sans text-orange-500">HubSpot</span>
          <span className="text-2xl font-bold font-sans">Notion</span>
          <span className="text-2xl font-black font-sans text-red-600">NETFLIX</span>
          <span className="text-2xl font-bold font-sans text-blue-500">zoom</span>
        </div>
      </section>

      {/* ── SECTION 3: SERVICES GRID ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16">
          <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-4xl font-medium text-black inline-block">
            Services
          </h2>
          <p className="text-lg text-gray-800 max-w-xl">
            At our digital marketing agency, we offer a range of services to help businesses grow and succeed online. These services include:
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Light */}
          <div className="bg-gray-50 rounded-[40px] border border-black p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform">
            <div className="flex flex-col justify-between h-[250px] gap-8">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium">Branding</span>
              </div>
              <Link href="/services/branding" className="flex items-center gap-3 text-lg font-medium group mt-auto">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-[#278DFD] font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0">
              <SearchIconSVG />
            </div>
          </div>

          {/* Card 2: Dark */}
          <div className="bg-[#191A23] rounded-[40px] p-10 flex flex-row items-center justify-between hover:-translate-y-1 transition-transform border border-[#191A23]">
            <div className="flex flex-col justify-between h-[250px] gap-8">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-white rounded-[6px] text-2xl font-medium text-black">Social Media</span>
                <span className="px-2 py-0.5 bg-white rounded-[6px] text-2xl font-medium text-black">Management</span>
              </div>
              <Link href="/services/social-media-management" className="flex items-center gap-3 text-lg font-medium text-white group mt-auto">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-black font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0">
              <PpcIconSVG />
            </div>
          </div>

          {/* Card 3: Dark */}
          <div className="bg-[#191A23] rounded-[40px] p-10 flex flex-row items-center justify-between hover:-translate-y-1 transition-transform border border-[#191A23]">
            <div className="flex flex-col justify-between h-[250px] gap-8">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-white rounded-[6px] text-2xl font-medium text-black">Marketing</span>
              </div>
              <Link href="/services/marketing" className="flex items-center gap-3 text-lg font-medium text-white group mt-auto">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-black font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0">
              <SocialIconSVG />
            </div>
          </div>

          {/* Card 4: Light */}
          <div className="bg-gray-50 rounded-[40px] border border-black p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform">
            <div className="flex flex-col justify-between h-[250px] gap-8">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium">Web</span>
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium">Designing</span>
              </div>
              <Link href="/services/web-designing" className="flex items-center gap-3 text-lg font-medium group mt-auto">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-[#278DFD] font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="w-32 h-32 sm:w-44 sm:h-44 flex-shrink-0">
              <EmailIconSVG />
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: CTA BANNER ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="bg-gray-100 rounded-[40px] p-12 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <div className="flex flex-col gap-6 items-start max-w-md z-10">
            <h3 className="text-3xl font-medium text-black">Let&apos;s make things happen</h3>
            <p className="text-lg text-gray-800">
              Contact us today to learn more about how our digital marketing services can help your business grow and succeed online.
            </p>
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#191A23] hover:bg-black text-white rounded-[14px] text-lg font-medium transition-colors duration-300 mt-2"
            >
              Get your free proposal
            </Link>
          </div>
          <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 z-0">
            <AbstractShapeSVG />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: OUR TEAM ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16">
          <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-4xl font-medium text-black inline-block">
            Our Team
          </h2>
          <p className="text-lg text-gray-800 max-w-xl">
            Meet the passionate experts driving your brand&apos;s digital success. We blend creativity with strategic execution.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Member 1 */}
          <div className="bg-white rounded-[40px] border border-black p-8 shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#278DFD] to-[#E3F2FD] mb-6 flex items-center justify-center border-2 border-black overflow-hidden">
               <span className="text-3xl font-medium text-black/40">JD</span>
            </div>
            <h3 className="text-2xl font-medium text-black">Jane Doe</h3>
            <span className="text-[#278DFD] font-medium mt-1">Lead Designer</span>
            <div className="w-full h-px bg-black/10 my-6" />
            <p className="text-gray-700 font-light leading-relaxed">
              With over 10 years of experience crafting beautiful, intuitive user interfaces, Jane ensures every project leaves a lasting impact.
            </p>
          </div>

          {/* Member 2 */}
          <div className="bg-white rounded-[40px] border border-black p-8 shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 mb-6 flex items-center justify-center border-2 border-black overflow-hidden">
               <span className="text-3xl font-medium text-black/40">JS</span>
            </div>
            <h3 className="text-2xl font-medium text-black">John Smith</h3>
            <span className="text-[#278DFD] font-medium mt-1">Marketing Strategist</span>
            <div className="w-full h-px bg-black/10 my-6" />
            <p className="text-gray-700 font-light leading-relaxed">
              John specializes in data-driven campaigns, transforming complex analytics into clear, actionable roadmaps for growth.
            </p>
          </div>

          {/* Member 3 */}
          <div className="bg-white rounded-[40px] border border-black p-8 shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#278DFD] to-[#E3F2FD] mb-6 flex items-center justify-center border-2 border-black overflow-hidden">
               <span className="text-3xl font-medium text-black/40">EC</span>
            </div>
            <h3 className="text-2xl font-medium text-black">Emily Chen</h3>
            <span className="text-[#278DFD] font-medium mt-1">Lead Developer</span>
            <div className="w-full h-px bg-black/10 my-6" />
            <p className="text-gray-700 font-light leading-relaxed">
              Emily builds the robust foundations of our digital platforms, focusing on lightning-fast performance and seamless integrations.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

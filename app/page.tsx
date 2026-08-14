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
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero1-1786600151050.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero2-1786600155337.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero3-1786600158055.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero4-1786600160768.webp",
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
      <section className="relative max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 pt-16 sm:pt-24 lg:pt-28 pb-8 sm:pb-16">
        <HeroDecorationsSVG />
        <div className="relative z-10 grid grid-cols-2 gap-4 lg:gap-12 items-center overflow-visible">
          {/* Left Column */}
          <div className="flex flex-col gap-4 lg:gap-8 items-start max-w-2xl mt-4 sm:-mt-16 lg:-mt-36 col-span-1 z-10">
            <h1 className="text-[22px] leading-tight sm:text-6xl lg:text-7xl font-medium text-black sm:leading-[1.1] tracking-tight">
              Join us to create memories worth glory...
            </h1>
            <p className="text-[13px] leading-snug sm:text-xl text-gray-800 sm:leading-relaxed max-w-xl">
              Our awesome team helps your business grow and maximize its potential through our services, including Web Designing, Branding, Social Media Management, and Marketing.
            </p>
            <Link
              href="/contact"
              className="px-4 py-2.5 sm:px-8 sm:py-4 bg-[#191A23] hover:bg-black text-white rounded-[10px] sm:rounded-[14px] text-xs sm:text-lg font-medium transition-colors duration-300 whitespace-nowrap"
            >
              Book a consultation
            </Link>
          </div>
          {/* Right Column */}
          <div className="relative flex items-center justify-end overflow-visible min-h-[250px] sm:min-h-[450px] lg:min-h-[600px] w-full">
            {/* The Wheel Container */}
            <div className="absolute right-[-160px] sm:right-[-275px] lg:right-[-425px] top-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[550px] sm:h-[550px] lg:w-[850px] lg:h-[850px]">
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
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 sm:w-32 sm:h-32 lg:w-56 lg:h-56 rounded-[1rem] sm:rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden shadow-2xl bg-white border-2 sm:border-4 lg:border-8 border-white hover:scale-105 transition-transform duration-300">
                      <Image 
                        src={src} 
                        alt={`Hero ${idx + 1}`} 
                        fill 
                        sizes="(max-width: 768px) 128px, 224px" 
                        className="object-cover" 
                        priority 
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
      <section className="w-full bg-gray-50 py-2 sm:py-4 md:py-8 border-y border-gray-200 mt-8 md:mt-12">
        <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 flex items-center">
          
          {/* Static Text Area */}
          <div className="w-1/3 md:w-1/4 z-10 pr-4 sm:pr-8 bg-gray-50 flex-shrink-0">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base font-light leading-snug">
              Brands we&apos;ve had the pleasure of building.
            </p>
          </div>

          {/* Sliding Logos Area */}
          <div className="flex-1 overflow-hidden relative">
            <style>{`
              @keyframes slide-marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }
              .sliding-marquee {
                animation: slide-marquee 20s linear infinite;
              }
            `}</style>
            
            {/* Fade Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

            <div className="flex items-center w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-row flex-nowrap w-max sliding-marquee">
                {/* Logos Set 1 */}
                <div className="flex flex-row items-center gap-6 sm:gap-12 md:gap-24 px-4 sm:px-6 md:px-12">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/Brandique.png" alt="Brandique" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Brandique</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/Genz.zoo.png" alt="Genz.zoo" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">GenzZoo</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/PFD.png" alt="PFD" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">PFD</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/STRM_L.png" alt="STRM L" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Streamlet.</span>
                  </div>
                </div>
                
                {/* Logos Set 2 (Duplicate for seamless loop) */}
                <div className="flex flex-row items-center gap-6 sm:gap-12 md:gap-24 px-4 sm:px-6 md:px-12">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/Brandique.png" alt="Brandique" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Brandique</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/Genz.zoo.png" alt="Genz.zoo" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">GenzZoo</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/PFD.png" alt="PFD" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">PFD</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="/Companies/STRM_L.png" alt="STRM L" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Streamlet.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: SERVICES GRID ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8 md:mb-16">
          <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-4xl font-medium text-black inline-block">
            Services
          </h2>
          <p className="text-lg text-gray-800 max-w-xl">
            At our agency, we offer a range of services to help your business grow. These include:
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Card 1: Light */}
          <div className="bg-white rounded-[40px] border border-black p-6 sm:p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform overflow-hidden relative gap-4 sm:gap-0">
            <HeroDecorationsSVG />
            <div className="relative z-10 flex flex-col justify-between h-auto sm:h-[250px] gap-4 sm:gap-8 flex-1">
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
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 flex-shrink-0">
              <Image src="/Services/Branding.png" alt="Branding" fill className="object-contain" />
            </div>
          </div>

          {/* Card 2: Dark to Light */}
          <div className="bg-white rounded-[40px] p-6 sm:p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform border border-black overflow-hidden relative gap-4 sm:gap-0">
            <HeroDecorationsSVG />
            <div className="relative z-10 flex flex-col justify-between h-auto sm:h-[250px] gap-4 sm:gap-8 flex-1">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium text-black">Social Media</span>
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium text-black">Management</span>
              </div>
              <Link href="/services/social-media-management" className="flex items-center gap-3 text-lg font-medium text-black group mt-auto">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-[#278DFD] font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 flex-shrink-0">
              <Image src="/Services/SocialMediaManagement.png" alt="Social Media Management" fill className="object-contain" />
            </div>
          </div>

          {/* Card 3: Dark to Light */}
          <div className="bg-white rounded-[40px] p-6 sm:p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform border border-black overflow-hidden relative gap-4 sm:gap-0">
            <HeroDecorationsSVG />
            <div className="relative z-10 flex flex-col justify-between h-auto sm:h-[250px] gap-4 sm:gap-8 flex-1">
              <div className="flex flex-col items-start gap-1">
                <span className="px-2 py-0.5 bg-[#278DFD] rounded-[6px] text-2xl font-medium text-black">Marketing</span>
              </div>
              <Link href="/services/marketing" className="flex items-center gap-3 text-lg font-medium text-black group mt-auto">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:-rotate-45 transition-transform">
                  <span className="text-[#278DFD] font-bold text-xl">&rarr;</span>
                </div>
                <span className="hidden sm:inline">Learn more</span>
              </Link>
            </div>
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 flex-shrink-0">
              <Image src="/Services/Marketing.png" alt="Marketing" fill className="object-contain" />
            </div>
          </div>

          {/* Card 4: Light */}
          <div className="bg-white rounded-[40px] border border-black p-6 sm:p-10 flex flex-row items-center justify-between shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform overflow-hidden relative gap-4 sm:gap-0">
            <HeroDecorationsSVG />
            <div className="relative z-10 flex flex-col justify-between h-auto sm:h-[250px] gap-4 sm:gap-8 flex-1">
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
            <div className="relative z-10 w-32 h-32 sm:w-64 sm:h-64 flex-shrink-0">
              <Image src="/Services/webdesigning.png" alt="Web Designing" fill className="object-contain" />
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: CTA BANNER ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="bg-gray-100 rounded-[20px] sm:rounded-[40px] p-6 sm:p-16 flex flex-row items-center justify-between gap-4 sm:gap-12 relative overflow-hidden min-h-[200px] sm:min-h-[450px]">
          <HeroDecorationsSVG />
          <div className="flex flex-col gap-3 sm:gap-6 items-start w-[60%] sm:max-w-md z-10">
            <h3 className="text-xl sm:text-3xl font-medium text-black leading-tight">Let&apos;s make things happen</h3>
            <p className="text-xs sm:text-lg text-gray-800 leading-snug">
              Contact us today to see how our services can help your business grow.
            </p>
            <Link
              href="/contact"
              className="px-4 py-2 sm:px-8 sm:py-4 bg-[#191A23] hover:bg-black text-white rounded-[10px] sm:rounded-[14px] text-xs sm:text-lg font-medium transition-colors duration-300 mt-1 sm:mt-2 whitespace-nowrap"
            >
              Get your free proposal
            </Link>
          </div>
          <div className="flex absolute right-0 sm:right-8 top-1/2 -translate-y-1/2 w-[140px] h-[140px] sm:w-[400px] sm:h-[400px] z-0">
            <Image src="/Contact/letsconnect.png" alt="Let's make things happen" fill className="object-contain object-right" />
          </div>
        </div>
      </section>

      {/* ── SECTION 5: OUR TEAM ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-8 md:mb-16">
          <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-4xl font-medium text-black inline-block">
            Our Team
          </h2>
          <p className="text-lg text-gray-800 max-w-xl">
            Meet the curious minds behind the scenes, blending creativity and hard work to grow your brand.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12 lg:gap-14 pt-4 md:pt-10 pb-10 md:pb-20">
          
          {/* Member 1 */}
          <div className="relative w-full flex flex-col items-center">
             <div className="absolute -top-6 md:-top-10 left-0 text-[40px] md:text-[80px] leading-none font-sans font-black text-[#111] z-20 select-none tracking-tighter">“</div>
             <div className="bg-[#278DFD] w-full aspect-[16/9] relative mb-16 md:mb-24 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-full z-10" style={{ clipPath: 'inset(-50% -50% 0 -50%)' }}>
                  <Image src="/Team-Photos/Venky.png" alt="Venky" fill className="object-contain object-bottom scale-[1.4] md:scale-[1.6] origin-bottom translate-y-12 md:translate-y-16 drop-shadow-xl" />
                </div>
             </div>
             <div className="bg-[#1C1D21] p-4 lg:p-6 absolute bottom-8 md:bottom-10 left-[-1rem] w-[95%] shadow-xl z-20">
               <h3 className="text-white text-sm lg:text-lg font-bold leading-snug font-sans">
                 The little things we do today will blossom into peace one day.
               </h3>
             </div>
             <div className="absolute bottom-[-1.5rem] md:bottom-[-1rem] left-0 z-20">
               <p className="text-lg md:text-xl text-gray-800 font-medium tracking-tight">Venky</p>
               <p className="text-xs md:text-sm text-gray-600 uppercase tracking-widest mt-0.5 md:mt-1">Founder, gloyas</p>
             </div>
          </div>

          {/* Member 2 */}
          <div className="relative w-full flex flex-col items-center mt-8 md:mt-0">
             <div className="absolute -top-6 md:-top-10 left-0 text-[40px] md:text-[80px] leading-none font-sans font-black text-[#111] z-20 select-none tracking-tighter">“</div>
             <div className="bg-[#278DFD] w-full aspect-[16/9] relative mb-16 md:mb-24 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-full z-10" style={{ clipPath: 'inset(-50% -50% 0 -50%)' }}>
                  <Image src="/Team-Photos/Karhtik1.png" alt="Karthik" fill className="object-contain object-bottom scale-[1.4] md:scale-[1.6] origin-bottom translate-y-12 md:translate-y-16 drop-shadow-xl" />
                </div>
             </div>
             <div className="bg-[#1C1D21] p-4 lg:p-6 absolute bottom-8 md:bottom-10 left-[-1rem] w-[95%] shadow-xl z-20">
               <h3 className="text-white text-sm lg:text-lg font-bold leading-snug font-sans">
                 Between what is and what could be, something always begins.
               </h3>
             </div>
             <div className="absolute bottom-[-1.5rem] md:bottom-[-1rem] left-0 z-20">
               <p className="text-lg md:text-xl text-gray-800 font-medium tracking-tight">Karthik</p>
               <p className="text-xs md:text-sm text-gray-600 uppercase tracking-widest mt-0.5 md:mt-1">Co-founder, gloyas</p>
             </div>
          </div>

          {/* Member 3 */}
          <div className="relative w-full flex flex-col items-center mt-8 lg:mt-0">
             <div className="absolute -top-6 md:-top-10 left-0 text-[40px] md:text-[80px] leading-none font-sans font-black text-[#111] z-20 select-none tracking-tighter">“</div>
             <div className="bg-[#278DFD] w-full aspect-[16/9] relative mb-16 md:mb-24 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-full z-10" style={{ clipPath: 'inset(-50% -50% 0 -50%)' }}>
                  <Image src="/Team-Photos/Vijay.png" alt="Vijay" fill className="object-contain object-bottom scale-[1.4] md:scale-[1.6] origin-bottom translate-y-6 md:translate-y-8 drop-shadow-xl" />
                </div>
             </div>
             <div className="bg-[#1C1D21] p-4 lg:p-6 absolute bottom-8 md:bottom-10 left-[-1rem] w-[95%] shadow-xl z-20">
               <h3 className="text-white text-sm lg:text-lg font-bold leading-snug font-sans">
                 Maybe the unknown is where you’re meant to find yourself.
               </h3>
             </div>
             <div className="absolute bottom-[-1.5rem] md:bottom-[-1rem] left-0 z-20">
               <p className="text-lg md:text-xl text-gray-800 font-medium tracking-tight">Vijay</p>
               <p className="text-xs md:text-sm text-gray-600 uppercase tracking-widest mt-0.5 md:mt-1">Co-founder, gloyas</p>
             </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}

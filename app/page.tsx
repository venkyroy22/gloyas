'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { HeroDecorationsSVG } from '@/components/ui/Decorations';


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
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const heroImages = [
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero1-1786600151050.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero2-1786600155337.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero3-1786600158055.webp",
    "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/glo-hero4-1786600160768.webp",
  ];

  const teamMembers = [
    { name: "Venky", role: "Founder, gloyas", quote: "The little things we do today will blossom into peace one day.", image: "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/venky-1786957405967.webp", transY: "translate-y-12 md:translate-y-16" },
    { name: "Karthik", role: "Co-founder, gloyas", quote: "Between what is and what could be, something always begins.", image: "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/karhtik1-1786957410811.webp", transY: "translate-y-12 md:translate-y-16" },
    { name: "Vijay", role: "Co-founder, gloyas", quote: "Maybe the unknown is where you’re meant to find yourself.", image: "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/vijay-1786957414797.webp", transY: "translate-y-6 md:translate-y-8" },
    { name: "Varun", role: "Co-founder, gloyas", quote: "Creativity is seeing what others see and thinking what no one else ever thought.", image: "https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/varun-1786957418907.webp", transY: "translate-y-6 md:translate-y-8" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTeamIndex((prev) => (prev + 1) % teamMembers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [teamMembers.length]);

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
            <p className="text-[15px] leading-relaxed sm:text-2xl text-gray-800 sm:leading-relaxed max-w-2xl">
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
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/brandique-1786957422465.webp" alt="Brandique" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Brandique</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/genzzoo-1786957425650.webp" alt="Genz.zoo" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">GenzZoo</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/pfd-1786957429488.webp" alt="PFD" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">PFD</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/strml-1786957435266.webp" alt="STRM L" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Streamlet.</span>
                  </div>
                </div>
                
                {/* Logos Set 2 (Duplicate for seamless loop) */}
                <div className="flex flex-row items-center gap-6 sm:gap-12 md:gap-24 px-4 sm:px-6 md:px-12">
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/brandique-1786957422465.webp" alt="Brandique" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">Brandique</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/genzzoo-1786957425650.webp" alt="Genz.zoo" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">GenzZoo</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/pfd-1786957429488.webp" alt="PFD" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
                    <span className="text-[13px] sm:text-xl font-bold font-sans text-gray-800">PFD</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/strml-1786957435266.webp" alt="STRM L" width={48} height={48} className="w-6 h-6 sm:w-12 sm:h-12 object-contain flex-shrink-0" />
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
              <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/branding-1786957440010.webp" alt="Branding" fill sizes="(max-width: 640px) 128px, 256px" className="object-contain" />
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
              <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/socialmediamanagement-1786957443467.webp" alt="Social Media Management" fill sizes="(max-width: 640px) 128px, 256px" className="object-contain" />
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
              <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/marketing-1786957446982.webp" alt="Marketing" fill sizes="(max-width: 640px) 128px, 256px" className="object-contain" />
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
              <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/webdesigning-1786957451146.webp" alt="Web Designing" fill sizes="(max-width: 640px) 128px, 256px" className="object-contain" />
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
            <Image src="https://cdn-img.streamletedge.com/6a6874155ad7d80e5dbcdb7b/images/letsconnect-1786957454975.webp" alt="Let's make things happen" fill sizes="(max-width: 640px) 140px, 400px" className="object-contain object-right" />
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

        {/* Team Slider (Auto-advancing Carousel) */}
        <div className="relative w-full pt-16 md:pt-28 pb-10 md:pb-20 flex justify-center items-center min-h-[500px] md:min-h-[600px] overflow-hidden">
          {teamMembers.map((member, idx) => {
            const offset = (idx - currentTeamIndex + teamMembers.length) % teamMembers.length;
            
            let positionClass = "opacity-0 scale-75 translate-x-[150%] z-0 pointer-events-none"; // Hidden right
            
            if (offset === 0) {
              positionClass = "opacity-100 scale-100 translate-x-0 z-20"; // Center
            } else if (offset === 1) {
              positionClass = "opacity-40 scale-[0.85] translate-x-[90%] sm:translate-x-[105%] lg:translate-x-[115%] z-10 pointer-events-none"; // Right
            } else if (offset === teamMembers.length - 1) {
              positionClass = "opacity-40 scale-[0.85] -translate-x-[90%] sm:-translate-x-[105%] lg:-translate-x-[115%] z-10 pointer-events-none"; // Left
            } else {
              positionClass = "opacity-0 scale-75 -translate-x-[150%] z-0 pointer-events-none"; // Hidden left
            }

            return (
              <div 
                key={`team-${idx}`} 
                className={`absolute transition-all duration-700 ease-in-out w-[85vw] sm:w-[350px] lg:w-[380px] xl:w-[390px] flex flex-col items-center ${positionClass}`}
              >
                 <div className="absolute -top-6 md:-top-10 left-0 text-[40px] md:text-[80px] leading-none font-sans font-black text-[#111] z-20 select-none tracking-tighter">“</div>
                 <div className="bg-[#278DFD] w-full aspect-[16/9] relative mb-16 md:mb-24 shadow-lg">
                    <div className="absolute top-0 left-0 w-full h-full z-10" style={{ clipPath: 'inset(-100% -50% 0 -50%)' }}>
                      <Image src={member.image} alt={member.name} fill sizes="(max-width: 640px) 85vw, (max-width: 1024px) 350px, 390px" unoptimized className={`object-contain object-bottom scale-[1.4] md:scale-[1.6] origin-bottom ${member.transY} drop-shadow-xl`} />
                    </div>
                 </div>
                 <div className="bg-[#1C1D21] p-4 lg:p-6 absolute bottom-8 md:bottom-10 left-[-1rem] w-[95%] shadow-xl z-20">
                   <h3 className="text-white text-sm lg:text-lg font-bold leading-snug font-sans">
                     {member.quote}
                   </h3>
                 </div>
                 <div className="absolute bottom-[-1.5rem] md:bottom-[-1rem] left-0 z-20">
                   <p className="text-lg md:text-xl text-gray-800 font-medium tracking-tight">{member.name}</p>
                   <p className="text-xs md:text-sm text-gray-600 uppercase tracking-widest mt-0.5 md:mt-1">{member.role}</p>
                 </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

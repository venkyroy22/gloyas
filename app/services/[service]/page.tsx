'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckIcon } from '@/components/ui/Icons';
import { servicesData } from '@/lib/services';
import { HeroDecorationsSVG } from '@/components/ui/Decorations';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceSlug = params.service as string;
  const service = servicesData[serviceSlug];

  if (!service) {
    return (
      <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white">
        <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900">
          Service Not Found
        </h1>
        <p className="text-sm font-light text-gray-500 mt-3">
          The service page you are looking for has been moved or doesn&apos;t exist.
        </p>
        <Link 
          href="/"
          className="mt-8 px-8 py-4 bg-[#191A23] hover:bg-black text-white rounded-[14px] text-lg font-medium transition-colors duration-300"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen overflow-x-hidden pt-12 sm:pt-16 pb-12 sm:pb-16">
      
      {/* ── BREADCRUMBS ── */}
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-light text-gray-500 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="px-3 py-1.5 bg-gray-50 hover:bg-[#278DFD]/5 hover:text-[#278DFD] rounded-full shrink-0">Home</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="px-3 py-1.5 bg-[#278DFD]/10 text-[#278DFD] rounded-full shrink-0 uppercase tracking-wider font-semibold">{service.title}</span>
        </div>
      </div>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 pb-16 sm:pb-24">
        <HeroDecorationsSVG />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6 items-start max-w-2xl"
          >
            <span className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-sm font-medium text-black inline-block">
              Service Focus
            </span>
            <h1 className="text-[32px] sm:text-5xl lg:text-7xl font-medium text-black leading-[1.1] tracking-tight">
              {service.title}
            </h1>
            <p className="text-sm sm:text-xl text-gray-800 leading-relaxed max-w-xl">
              {service.description}
            </p>
          </motion.div>
          {/* Right Column: Image Placeholder or Actual Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center min-h-[300px] sm:min-h-[450px] lg:min-h-[500px] w-full"
          >
            <div className={`absolute inset-0 flex items-center justify-center overflow-hidden ${service.heroImage ? '' : 'bg-gray-100 rounded-[20px] sm:rounded-[40px] border border-black shadow-[0px_5px_0px_0px_rgba(25,26,35,1)]'}`}>
              {service.heroImage ? (
                <Image 
                  src={service.heroImage}
                  alt={`${service.title} Hero Image`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <span className="text-gray-400 font-medium text-lg">Image Placeholder</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: DETAILS & PROCESS GRID ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 sm:gap-16 items-start">
          
          {/* Left Column: Scope & Who it's for */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 bg-white rounded-[40px] border border-black p-6 sm:p-10 shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col gap-8">
              <div>
                <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-xl font-medium text-black inline-block mb-4">
                  Who It&apos;s For
                </h2>
                <p className="text-base sm:text-lg font-normal text-gray-800 leading-relaxed">
                  {service.whoItIsFor}
                </p>
              </div>

              <div>
                <h2 className="px-3 py-1 bg-[#278DFD] rounded-[8px] text-xl font-medium text-black inline-block mb-4">
                  Scope & Deliverables
                </h2>
                <ul className="flex flex-col gap-4">
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className="text-base sm:text-lg font-normal text-gray-800 flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                        <CheckIcon size={14} className="text-white" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Process */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8 bg-[#191A23] rounded-[40px] border border-black p-6 sm:p-10 shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] hover:-translate-y-1 transition-transform"
          >
            <div>
              <h2 className="px-3 py-1 bg-white rounded-[8px] text-xl font-medium text-black inline-block mb-2">
                Our Process
              </h2>
              <p className="text-sm text-gray-400 mt-2">Stage-by-stage methodology</p>
            </div>

            <div className="flex flex-col gap-6">
              {service.process.map((p) => (
                <div key={p.step} className="flex gap-5 items-start pb-6 border-b border-gray-700 last:border-b-0 last:pb-0">
                  <span className="text-lg font-medium text-black bg-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    {p.step}
                  </span>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-2">{p.title}</h4>
                    <p className="text-sm sm:text-base font-light text-gray-300 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>



      {/* ── SECTION 4: CTA BANNER ── */}
      <section className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 py-10">
        <div className="bg-gray-100 rounded-[20px] sm:rounded-[40px] p-6 sm:p-12 flex flex-row items-center justify-between gap-4 sm:gap-12 relative overflow-hidden min-h-[220px] sm:min-h-[400px]">
          <HeroDecorationsSVG />
          
          <div className="flex flex-col gap-3 sm:gap-6 items-start w-[60%] sm:max-w-md z-10">
            <h3 className="text-xl sm:text-4xl font-medium text-black leading-tight">
              Ready for {service.title}?
            </h3>
            <p className="text-xs sm:text-lg text-gray-800 leading-snug">
              Share your business target roadmap and let&apos;s make things happen.
            </p>
            <Link
              href={`/contact?type=${serviceSlug}`}
              className="px-4 py-2 sm:px-8 sm:py-4 bg-[#191A23] hover:bg-black text-white rounded-[10px] sm:rounded-[14px] text-xs sm:text-lg font-medium transition-colors duration-300 mt-1 sm:mt-2 whitespace-nowrap inline-flex items-center gap-2 sm:gap-3 group"
            >
              <span>Get a Quote</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          {/* Absolutely positioned image on the right, flush to bottom */}
          <div className="flex absolute right-0 sm:right-8 bottom-0 w-[180px] h-[180px] sm:w-[450px] sm:h-[400px] z-20">
            <div className={`absolute inset-0 flex items-end justify-center overflow-hidden ${service.ctaImage ? '' : 'bg-white rounded-[20px] sm:rounded-[30px] border border-black shadow-[0px_5px_0px_0px_rgba(25,26,35,1)] m-4'}`}>
              {service.ctaImage ? (
                <Image 
                  src={service.ctaImage}
                  alt={`${service.title} CTA Image`}
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 180px, 450px"
                />
              ) : (
                <span className="text-gray-400 font-medium text-xs sm:text-base mb-8">CTA Placeholder</span>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

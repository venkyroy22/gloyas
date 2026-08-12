'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckIcon } from '@/components/ui/Icons';
import { servicesData } from '@/lib/services';

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceSlug = params.service as string;
  const service = servicesData[serviceSlug];

  if (!service) {
    return (
      <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white">
        <h1 className="text-xl sm:text-2xl font-thin tracking-widest uppercase text-gray-900">
          Service Not Found
        </h1>
        <p className="text-sm font-light text-gray-500 mt-3">
          The service page you are looking for has been moved or doesn't exist.
        </p>
        <Link 
          href="/services"
          className="mt-8 px-6 py-2.5 bg-[#278DFD] text-white text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-blue-600 transition-colors"
        >
          View All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Breadcrumb pills */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-light text-gray-500 mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="px-3 py-1.5 bg-gray-50 hover:bg-[#278DFD]/5 hover:text-[#278DFD] rounded-full shrink-0">Home</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link href="/services" className="px-3 py-1.5 bg-gray-50 hover:bg-[#278DFD]/5 hover:text-[#278DFD] rounded-full shrink-0">Services</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="px-3 py-1.5 bg-[#278DFD]/10 text-[#278DFD] rounded-full shrink-0 uppercase tracking-wider font-semibold">{service.title}</span>
        </div>

        {/* Hero Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mb-12 sm:mb-16"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Service Focus</span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight mb-6">
            {service.title}
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD]" />
        </motion.div>

        {/* Dynamic Detail Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 sm:gap-16 items-start">
          
          {/* Left Column details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 bg-white border-2 border-black rounded-[32px] p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
          >
            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">What It Is</h2>
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">Who It&apos;s For</h2>
              <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
                {service.whoItIsFor}
              </p>
            </div>

            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">Scope & Deliverables</h2>
              <ul className="flex flex-col gap-3">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm font-light text-gray-600 flex items-start gap-3">
                    <CheckIcon size={16} className="text-[#278DFD] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right Column process list */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6 bg-white border-2 border-black rounded-[32px] p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]"
          >
            <div>
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-1">Our Process</h2>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-6">Stage-by-stage methodology</p>
            </div>

            <div className="flex flex-col gap-5">
              {service.process.map((p) => (
                <div key={p.step} className="flex gap-4 items-start pb-5 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <span className="text-xs font-bold text-[#278DFD] bg-[#278DFD]/10 w-8 h-8 rounded-full flex items-center justify-center font-mono shrink-0">
                    {p.step}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide uppercase text-gray-900 mb-1">{p.title}</h4>
                    <p className="text-xs font-light text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Testimonials Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 sm:mt-24 py-12 border-t border-gray-100"
        >
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-3xl font-thin italic text-gray-900 leading-relaxed">
              &quot;{service.testimonial.quote}&quot;
            </h3>
            <p className="mt-6 text-xs font-bold tracking-[0.3em] uppercase text-[#278DFD]">
              {service.testimonial.author}
            </p>
            <p className="text-[9px] uppercase text-gray-400 tracking-widest mt-1">
              {service.testimonial.role}
            </p>
          </div>

          {/* Primary CTA card */}
          <div className="bg-[#278DFD] border-2 border-black rounded-[32px] text-black p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]">
            <h3 className="text-xl sm:text-3xl font-black uppercase tracking-wide mb-4">
              Qualify your {service.title} project
            </h3>
            <p className="text-black/80 text-xs sm:text-sm font-normal max-w-md mx-auto mb-8 leading-relaxed">
              Ready to take your operations to the next level? Share your business target roadmap.
            </p>
            <Link
              href={`/contact?type=${serviceSlug}`}
              className="inline-flex items-center gap-3 bg-black text-white pl-5 pr-2 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-black shadow-[3px_3px_0px_0px_rgba(212,255,92,1)] hover:shadow-none transition-all duration-200 group"
            >
              <span>Get a Quote</span>
              <span className="w-6 h-6 rounded-full bg-[#D4FF5C] text-black flex items-center justify-center font-bold">
                &rarr;
              </span>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

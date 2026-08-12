'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckIcon } from '@/components/ui/Icons';
import { servicesData } from '@/lib/services';

export default function ServicesPage() {
  const services = Object.values(servicesData);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Our Offerings</span>
          <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
            Tailored Brand & <span className="font-bold">Web Services</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            We offer bespoke branding, high-speed Next.js web systems, and creative campaigns designed to position your business as a market leader.
          </p>
        </motion.div>

        {/* Services cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white border-2 border-black rounded-[28px] p-8 sm:p-10 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-4">
                  Service 0{i + 1}
                </span>
                
                <h2 className="text-2xl font-bold tracking-wide uppercase text-gray-900 mb-4">
                  {service.title}
                </h2>
                
                <p className="text-sm font-light text-gray-500 leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Key Deliverables Checkbox */}
                <div className="mb-8 pt-6 border-t border-gray-200/50">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">Core Offerings:</h4>
                  <ul className="flex flex-col gap-3">
                    {service.deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-xs font-light text-gray-600 flex items-center gap-2.5">
                        <CheckIcon size={14} className="text-[#278DFD]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-3 bg-black text-white pl-5 pr-2 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border border-black shadow-[2px_2px_0px_0px_rgba(212,255,92,1)] hover:shadow-none transition-all group animate-none"
                >
                  <span>Explore Service</span>
                  <span className="w-6 h-6 rounded-full bg-[#D4FF5C] text-black flex items-center justify-center font-bold">
                    &rarr;
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Diagnostic CTA Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 sm:mt-28 p-8 sm:p-14 bg-[#F7FFDF] border-2 border-black rounded-[32px] text-center max-w-4xl mx-auto shadow-[6px_6px_0px_0px_rgba(17,17,17,1)]"
        >
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-gray-900 mb-6">
            Not sure where to begin?
          </h3>
          <p className="text-sm font-normal text-gray-700 max-w-md mx-auto mb-10 leading-relaxed">
            Schedule a diagnostic check with us. We will audit your current brand materials and build a custom development roadmap.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3.5 bg-black border border-black text-white hover:bg-[#278DFD] hover:text-white text-[11px] font-black tracking-[0.2em] uppercase rounded-full transition-all shadow-[4px_4px_0px_0px_rgba(212,255,92,1)] hover:shadow-none"
          >
            Request Diagnostic Call
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

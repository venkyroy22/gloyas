'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { caseStudies } from '@/lib/work';
import ProductGallery from '@/components/product/ProductGallery';
import WorkCard from '@/components/product/WorkCard';

export default function CaseStudyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const study = caseStudies.find((s) => s.slug === slug);

  if (!study) {
    return (
      <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] px-4 bg-white">
        <h1 className="text-xl sm:text-2xl font-thin tracking-widest uppercase text-gray-900">
          Case Study Not Found
        </h1>
        <p className="text-sm font-light text-gray-500 mt-3">
          The case study you are looking for has been archived or moved.
        </p>
        <Link 
          href="/work"
          className="mt-8 px-6 py-2.5 bg-[#278DFD] text-white text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-blue-600 transition-colors"
        >
          View All Work
        </Link>
      </div>
    );
  }

  const relatedStudies = caseStudies
    .filter((s) => s.slug !== study.slug)
    .slice(0, 3);

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-light text-gray-500 mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="px-3 py-1.5 bg-gray-50 hover:bg-[#278DFD]/5 hover:text-[#278DFD] rounded-full shrink-0">Home</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <Link href="/work" className="px-3 py-1.5 bg-gray-50 hover:bg-[#278DFD]/5 hover:text-[#278DFD] rounded-full shrink-0">Our Work</Link>
          <span className="text-gray-300 shrink-0">/</span>
          <span className="px-3 py-1.5 bg-[#278DFD]/10 text-[#278DFD] rounded-full shrink-0 uppercase font-semibold">{study.client}</span>
        </div>

        {/* Layout details split - Left Gallery; Right details */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 sm:gap-16 items-start">
          
          {/* Left Column: Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGallery images={[study.image]} name={study.client} />
          </motion.div>

          {/* Right Column: Case Details & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div>
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#278DFD] block mb-2">
                {study.categoryLabel}
              </span>
              <span className="text-xs uppercase text-gray-400 font-bold tracking-widest block">Client: {study.client}</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase text-gray-900 mt-2 leading-snug">
                {study.title}
              </h1>
            </div>

            {/* Metrics cards row */}
            <div className="grid grid-cols-3 gap-3 border-y border-gray-100 py-6 my-2">
              {study.metrics.map((m, idx) => (
                <div key={idx} className="text-center sm:text-left border-r border-gray-100 last:border-r-0 px-2 first:pl-0">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#278DFD] tracking-tight">{m.value}</p>
                  <p className="text-[9px] uppercase text-gray-500 tracking-wider mt-1.5 leading-tight">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Narrative text block */}
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">The Challenge</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">{study.challenge}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">The Approach</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">{study.approach}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-900 mb-2">The Results</h3>
                <p className="text-sm font-light text-gray-600 leading-relaxed">{study.result}</p>
              </div>
            </div>

            {/* Client testimonial */}
            <div className="bg-white border-2 border-black p-6 rounded-[24px] mt-2 relative shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              <p className="text-sm font-normal italic text-gray-700 leading-relaxed">
                &ldquo;{study.testimonial.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200/50">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">{study.testimonial.author}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">{study.testimonial.role}</p>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-4 bg-[#278DFD] hover:bg-[#278DFD]/90 text-white pl-6 pr-2.5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase border border-black shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:shadow-none transition-all group"
              >
                <span>Start a Project</span>
                <span className="w-8 h-8 rounded-full bg-[#D4FF5C] text-black flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
                  &rarr;
                </span>
              </Link>
            </div>

          </motion.div>
        </div>

        {/* Other Projects recommendation */}
        {relatedStudies.length > 0 && (
          <section className="mt-20 sm:mt-28 pt-10 border-t border-gray-100">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-8">
              Other Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {relatedStudies.map((s, i) => (
                <WorkCard key={s.slug} caseStudy={s} index={i} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/Icons';
import { CaseStudy } from '@/lib/work';

interface WorkCardProps {
  caseStudy: CaseStudy;
  index?: number;
}

export default function WorkCard({ caseStudy, index = 0 }: WorkCardProps) {
  const primaryMetric = caseStudy.metrics[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-white border-2 border-black rounded-[28px] p-5 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Category Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#278DFD]">
            {caseStudy.categoryLabel}
          </span>
          <span className="px-3 py-1 bg-[#278DFD] text-white border border-[#278DFD] rounded-full text-[8px] font-bold uppercase tracking-wider">
            Case Study
          </span>
        </div>

        {/* Client & Title */}
        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-1">{caseStudy.client}</h3>
        <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
          {caseStudy.title}
        </p>

        {/* Metric Highlight Box */}
        {primaryMetric && (
          <div className="bg-[#E8F4FF] border border-black rounded-[18px] p-4 mb-6 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            <span className="text-2xl font-black text-[#278DFD] block tracking-tight">{primaryMetric.value}</span>
            <span className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest mt-1 block">
              {primaryMetric.label}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <Link
          href={`/work/${caseStudy.slug}`}
          className="text-[10px] font-bold text-gray-900 hover:text-[#278DFD] uppercase tracking-widest flex items-center gap-2 group/btn"
        >
          <span>Explore Details</span>
          <ArrowRightIcon size={14} className="group-hover/btn:translate-x-1 transition-transform duration-300 text-gray-400 group-hover/btn:text-[#278DFD]" />
        </Link>
      </div>
    </motion.div>
  );
}

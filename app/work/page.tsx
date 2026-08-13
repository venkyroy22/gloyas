'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import WorkCard from '@/components/product/WorkCard';
import { caseStudies } from '@/lib/work';

const tabs = [
  { label: 'All Projects', filter: 'all' },
  { label: 'Branding', filter: 'branding' },
  { label: 'Social Media', filter: 'social-media-management' },
  { label: 'Marketing', filter: 'marketing' },
  { label: 'Web Designing', filter: 'web-designing' },
];

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredStudies = activeTab === 'all'
    ? caseStudies
    : caseStudies.filter((study) => study.category === activeTab);

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
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Portfolio</span>
          <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
            Our Case <span className="font-bold">Studies</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            Real performance growth blueprints showing design precision, Next.js engineering speed, and targeted branding.
          </p>
        </motion.div>

        {/* Filter Navigation pills */}
        <div className="flex gap-2 sm:gap-4 overflow-x-auto hide-scrollbar pb-6 sm:pb-8 mb-8 border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.filter}
              onClick={() => setActiveTab(tab.filter)}
              suppressHydrationWarning
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 flex-shrink-0 ${
                activeTab === tab.filter
                  ? 'bg-[#278DFD] text-white shadow-sm'
                  : 'bg-gray-50 text-gray-400 hover:bg-[#278DFD]/5 hover:text-[#278DFD] border border-gray-150'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filteredStudies.length > 0 ? (
            filteredStudies.map((study, i) => (
              <WorkCard key={study.slug} caseStudy={study} index={i} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-gray-200 bg-gray-50 rounded-[24px]">
              <p className="text-sm text-gray-400 font-light uppercase tracking-widest">No projects under this category yet.</p>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-[0.2em]">New case studies coming soon</p>
            </div>
          )}
        </motion.div>

        {/* Bottom Qualifier Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 sm:mt-28 p-8 sm:p-14 bg-gray-50 border border-gray-100 rounded-[32px] text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl sm:text-3xl font-thin uppercase text-gray-900 mb-6">
            Ready to design a similar success story?
          </h3>
          <p className="text-sm font-light text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            Let&apos;s design and code a performant digital asset, custom brand rules, or campaign ads tailored for your audience.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-[#278DFD] hover:bg-blue-600 text-white pl-6 pr-2.5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors shadow-md"
          >
            <span>Start a Project</span>
            <span className="w-8 h-8 rounded-full bg-[#D4FF5C] text-black flex items-center justify-center font-bold">
              &rarr;
            </span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

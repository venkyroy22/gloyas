'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Discovery & Business Audit',
    subtitle: 'Understanding the terrain before writing a line of code or design.',
    desc: 'We start by interviewing your key stakeholders, examining your current metrics, and performing an audit of your direct competitors. This phase output is a comprehensive project blueprint, sitemap, and initial user journey wireframes.',
    deliverables: ['Stakeholder workshop report', 'Competitor visual analysis', 'Sitemap & navigation blueprint', 'Scope of work outline']
  },
  {
    step: '02',
    title: 'Brand Strategy & Identity',
    subtitle: 'Defining the emotional core and professional positioning.',
    desc: 'We establish your brand archetype, voice, and visual direction. We explore multiple color palettes, typography styling, and logo marks, testing them across real-world application mockups to ensure they look premium.',
    deliverables: ['Typography systems & palettes', 'Logo mark & lockup files', 'Interactive brand book guidelines', 'Digital collateral templates']
  },
  {
    step: '03',
    title: 'Bespoke UI/UX Design',
    subtitle: 'Defying templates to create an unmatched user experience.',
    desc: 'We design high-fidelity layouts in Figma for every page and viewport. We focus heavily on layout grid symmetry, brand element integration, and subtle animations. We refine the visual layout with your feedback until it is ready for build.',
    deliverables: ['Figma design files (desktop + mobile)', 'Interactive click prototypes', 'Custom icon sets', 'Asset export packs']
  },
  {
    step: '04',
    title: 'Modern Front-End Engineering',
    subtitle: 'Building for high-speed, ironclad security, and future-proof SEO.',
    desc: 'We code the frontend using modern libraries like Next.js, React, and Tailwind CSS. We use headless architecture patterns, meaning your content is managed through a lightweight CMS but served as static pages for speed.',
    deliverables: ['Next.js App Router codebase', 'Headless CMS workspace setup', 'W3C valid clean code integration', 'Fast API integrations']
  },
  {
    step: '05',
    title: 'Deployment & Quality Audit',
    subtitle: 'Ensuring perfection across every device and browser.',
    desc: 'Before launching, we run our 30-point QA checklist: check mobile viewport responsiveness, inspect image compression ratios, set up page-level meta descriptions, and ensure rapid load speeds on Google PageSpeed.',
    deliverables: ['QA inspection report', 'Completed SEO schema setup', 'Vercel hosting configuration', 'Production launch deployment']
  },
  {
    step: '06',
    title: 'Ongoing Support & Optimization',
    subtitle: 'Iterating on real-world user metrics to maximize growth.',
    desc: 'Once live, we monitor user sessions and heatmaps. We set up campaign tracking and optimize copy/layout variations to increase conversion rates. We also provide routine system audits, security updates, and CMS support.',
    deliverables: ['Performance reports', 'A/B test campaign monitoring', 'CMS administrator training', 'Priority developer support line']
  }
];

export default function ProcessPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16 sm:mb-24"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Our Framework</span>
          <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
            Our Delivery <span className="font-bold">Process</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            A structured, six-stage design and development model built to remove uncertainty and guarantee premium agency execution.
          </p>
        </motion.div>

        {/* Process list layout */}
        <div className="flex flex-col gap-10 sm:gap-14 max-w-5xl">
          {steps.map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-4 sm:gap-8 items-start border-t border-gray-100 pt-10 first:border-t-0 first:pt-0"
            >
              {/* Step indicator */}
              <span className="text-5xl sm:text-6xl font-black text-[#278DFD]/20 font-mono leading-none">
                {item.step}
              </span>

              {/* Detail cards */}
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-gray-900">
                    {item.title}
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-[#278DFD] font-semibold mt-1">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-sm font-light text-gray-500 leading-relaxed max-w-2xl">
                  {item.desc}
                </p>

                {/* Checklist widget */}
                <div className="mt-2 bg-gray-50 border border-gray-100 p-5 rounded-[24px] max-w-2xl">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-3">Deliverables:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.deliverables.map((deliv, idx) => (
                      <div key={idx} className="text-xs font-light text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#278DFD] rounded-full shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Bottom banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 sm:mt-28 p-8 sm:p-14 bg-gray-50 border border-gray-100 rounded-[32px] text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl sm:text-3xl font-thin uppercase text-gray-900 mb-6">
            Experience our structured roadmap
          </h3>
          <p className="text-sm font-light text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            We collaborate using modern platforms, sending you visual Loom recordings and staging URL links weekly.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-between sm:justify-start gap-4 bg-[#278DFD] hover:bg-blue-600 text-white pl-6 pr-2.5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 group shadow-md"
          >
            <span>Start a Project</span>
            <span className="w-8 h-8 rounded-full bg-[#D4FF5C] text-black flex items-center justify-center font-bold text-lg group-hover:bg-white transition-colors">
              &rarr;
                </span>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

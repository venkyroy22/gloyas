'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckIcon } from '@/components/ui/Icons';

const tiers = [
  {
    name: 'Starter Brand',
    price: '₹1.5L – ₹3L',
    desc: 'Ideal for early-stage startups needing a premium visual identity system to secure funding or launch.',
    timeline: '3–4 Weeks',
    features: [
      'Logo Mark & Primary Wordmark',
      'Curated Typography & Color Palette',
      'Visual Rules Guidelines (Brand Book)',
      'Digital Assets Mockups (Stationary, Letterhead)',
      '1 Design Feedback Cycle'
    ],
    ctaHref: '/contact?type=branding&budget=starter'
  },
  {
    name: 'Launch Website',
    price: '₹3L – ₹6L',
    desc: 'Bespoke design and headless engineering for companies seeking a custom website that converts.',
    timeline: '6–8 Weeks',
    features: [
      'Custom UI/UX Figma Design',
      'Next.js / React Web Development',
      'Headless CMS Integration',
      'Core Speed & Mobile SEO Audit',
      '3 Months Deployment Support',
      '2 Design Feedback Cycles'
    ],
    ctaHref: '/contact?type=web-designing&budget=launch',
    featured: true
  },
  {
    name: 'Growth Rebrand',
    price: '₹5L+',
    desc: 'A complete corporate overhaul updating your legacy identity and aligning it with enterprise scaling.',
    timeline: '8–12 Weeks',
    features: [
      'Full Legacy Brand strategy Audit',
      'Modernized Identity & Asset kit',
      'Custom Enterprise Next.js Website',
      'Marketing Pitch Decks & Proposals',
      'Digital Ad Creative Layout templates',
      'Unlimited Launch Support & Consultation'
    ],
    ctaHref: '/contact?type=social-media-management&budget=growth'
  }
];

export default function PricingPage() {
  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16 sm:mb-20"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Pricing Models</span>
          <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
            Our Pricing <span className="font-bold">Packages</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            Transparent budget guidelines designed for quality-focused organizations. Select a tier to qualify your brief.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex flex-col justify-between border-2 border-black p-6 sm:p-8 rounded-[32px] relative bg-white transition-all duration-300 ${
                tier.featured 
                  ? 'shadow-[6px_6px_0px_0px_rgba(39,141,253,1)] sm:-translate-y-2' 
                  : 'shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]'
              }`}
            >
              {tier.featured && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#D4FF5C] border border-black text-black text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                  Recommended
                </span>
              )}

              <div>
                <h3 className="text-sm font-bold tracking-wide uppercase text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-6">Timeline: {tier.timeline}</p>
                
                <div className="mb-6">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{tier.price}</span>
                  <span className="text-xs text-gray-400 ml-2">est. range</span>
                </div>

                <p className="text-xs sm:text-sm font-light text-gray-500 leading-relaxed mb-8 border-b border-gray-100 pb-6">
                  {tier.desc}
                </p>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-900 mb-4">Key Deliverables:</h4>
                  <ul className="flex flex-col gap-3">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="text-xs font-light text-gray-600 flex items-start gap-2.5">
                        <CheckIcon size={14} className="text-[#278DFD] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href={tier.ctaHref}
                  className={`w-full block text-center py-3 border border-black rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                    tier.featured
                      ? 'bg-[#278DFD] text-white shadow-[3px_3px_0px_0px_rgba(17,17,17,1)] hover:shadow-none'
                      : 'bg-transparent text-gray-900 shadow-[3px_3px_0px_0px_rgba(212,255,92,1)] hover:shadow-none'
                  }`}
                >
                  Start Project Inquiry
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom inquiry note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 text-center border-t border-gray-100 pt-12"
        >
          <p className="text-xs sm:text-sm font-light text-gray-500 max-w-lg mx-auto leading-relaxed">
            Need a custom service model or SLA-backed monthly campaign support? We design bespoke retainers for companies spending ₹1L+/month on creative services.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 text-xs font-bold tracking-[0.2em] uppercase text-[#278DFD] hover:underline"
          >
            Inquire About Custom Retainers &rarr;
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

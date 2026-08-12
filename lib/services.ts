export interface ServiceStep {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface ServiceDetail {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  whoItIsFor: string;
  deliverables: string[];
  process: ServiceStep[];
  testimonial: ServiceTestimonial;
}

export const servicesData: Record<string, ServiceDetail> = {
  'web-designing': {
    slug: 'web-designing',
    title: 'Web Designing',
    shortDescription: 'Custom-crafted digital experiences that look stunning and convert users into customers. We blend clean aesthetics with performant development.',
    description: 'We believe your website is the digital storefront of your business. Our team designs and develops bespoke digital platforms that are custom-built, fully responsive, and optimized for speed and SEO. No bloated templates, just clean code and high-end design.',
    whoItIsFor: 'Businesses looking for a unique, premium digital presence that stands out from competitor template sites and drives high-value conversions.',
    deliverables: [
      'Custom UI/UX Design (Figma wireframes & designs)',
      'React & Next.js Headless Engineering',
      'Mobile-Responsive & Accessibility Auditing',
      'SEO Framework & Speed Performance Optimization',
      'Flexible Headless CMS Integration (Sanity / Storyblok)'
    ],
    process: [
      { step: '01', title: 'Discovery & Architecture', desc: 'Mapping user journeys, site maps, and interactive wireframes to align with your business goals.' },
      { step: '02', title: 'Visual UI/UX Design', desc: 'Creating bespoke high-fidelity designs in Figma that reflect your exact brand identity and guidelines.' },
      { step: '03', title: 'Performant Engineering', desc: 'Building the custom frontend using modern frameworks like Next.js for high-speed performance and security.' },
      { step: '04', title: 'Launch & Handoff', desc: 'Conducting cross-device testing, deployment setup, and training your team on using the CMS.' }
    ],
    testimonial: {
      quote: 'GLOYAS redesigned our corporate website, resulting in a 45% increase in lead generation within the first month. Their precision is unmatched.',
      author: 'Sarah Jenkins',
      role: 'CEO, DevFlow Systems'
    }
  },
  'branding': {
    slug: 'branding',
    title: 'Brand Strategy & Identity',
    shortDescription: 'We shape how your business is perceived. From logos to complete visual guidelines, we build identity systems that command premium positioning.',
    description: 'Branding is more than a logo; it is the emotional and intellectual relationship your company has with its clients. We craft comprehensive brand identities including positioning strategy, typography systems, color theory, and visual rules that resonate with your target market.',
    whoItIsFor: 'Startups launching new products or established companies seeking to establish premium market positioning and command higher rates.',
    deliverables: [
      'Brand Audit & Competitor Positioning Analysis',
      'Logo Mark & Wordmark System Design',
      'Curated Typography & Color Palette System',
      'Complete Brand Guidelines Document (Brand Book)',
      'Digital & Physical Brand Asset Mockups'
    ],
    process: [
      { step: '01', title: 'Personality Workshop', desc: 'Defining your brand voice, user personas, core values, and industry positioning.' },
      { step: '02', title: 'Identity Concepting', desc: 'Exploring and presenting multiple visual concepts including logos, typography, and color styling.' },
      { step: '03', title: 'Visual Refining', desc: 'Honing your selected concept, building mockups of collateral to see the identity in context.' },
      { step: '04', title: 'Brand Guidelines Delivery', desc: 'Compiling all rules and assets into an interactive guidelines document for effortless deployment.' }
    ],
    testimonial: {
      quote: 'The brand identity GLOYAS crafted captured our vision perfectly. It has given our sales team immense confidence when presenting to enterprises.',
      author: 'Marcus Aurelius',
      role: 'Founder, Zenith Venture Group'
    }
  },
  'social-media-management': {
    slug: 'social-media-management',
    title: 'Social Media Management',
    shortDescription: 'Modernize your company for today\'s market. We help mature companies shed outdated branding and rebuild their market relevance without losing legacy trust.',
    description: 'As businesses evolve, their branding can become misaligned with their actual size, customer base, and services. Our corporate rebranding process gently transition legacy brand equity into a modernized visual system that attracts high-caliber clients.',
    whoItIsFor: 'Established businesses that feel their current brand looks outdated, matches smaller competitors, or fails to represent their premium worth.',
    deliverables: [
      'Legacy Equity Audit & Brand Strategy',
      'Modernized Logo & Identity Redesign',
      'Transition Strategy & Launch Rollout Plan',
      'Marketing Asset & Presentation Template Redesign',
      'Internal Brand Alignment Documentation'
    ],
    process: [
      { step: '01', title: 'Legacy Audit', desc: 'Analyzing existing brand equity, customer perceptions, and competitor landscapes to map what must stay.' },
      { step: '02', title: 'Strategic Repositioning', desc: 'Formulating a modernized identity to attract high-value enterprise clients.' },
      { step: '03', title: 'System Overhaul', desc: 'Redesigning brand assets, layouts, presentation decks, and physical signage with a unified modern aesthetic.' },
      { step: '04', title: 'Rollout & Launch', desc: 'Coordinating internal and external launches to generate maximum hype and market impact.' }
    ],
    testimonial: {
      quote: 'Transitioning our 10-year-old brand was intimidating. GLOYAS navigated it perfectly, modernizing us while honoring our legacy trust.',
      author: 'Elena Rostova',
      role: 'Managing Director, Apex Logistics'
    }
  },
  'marketing': {
    slug: 'marketing',
    title: 'Marketing Services',
    shortDescription: 'Data-backed marketing campaigns that drive revenue. We align your brand\'s story with design-driven campaigns across digital channels.',
    description: 'High-quality design is only effective if it reaches the right audience. We design, launch, and optimize high-end marketing campaigns that align with your brand story, focusing on visual communication, high-converting copy, and structured ROI tracking.',
    whoItIsFor: 'Businesses seeking design-first digital ad campaigns, pitch decks, client proposals, or ongoing creative strategy to accelerate growth.',
    deliverables: [
      'Digital Ad Campaign Creative Design & Copy',
      'Sales Pitch Decks & Corporate Proposal Templates',
      'Newsletter Layouts & Campaign Sequence Writing',
      'Landing Page Conversion Rate Audits (CRO)',
      'Comprehensive SEO & Search Intent Strategies'
    ],
    process: [
      { step: '01', title: 'Campaign Strategy', desc: 'Identifying target channels, mapping out user journeys, and outlining copy messaging pillars.' },
      { step: '02', title: 'Creative Production', desc: 'Designing conversion-oriented ad creatives, pitch decks, email newsletters, and landing pages.' },
      { step: '03', title: 'Testing & Launch', desc: 'Setting up analytics tracking, deploying campaign assets, and establishing base KPIs.' },
      { step: '04', title: 'Growth Optimization', desc: 'Analyzing performance metrics weekly and iterating on design and copywriting to maximize return.' }
    ],
    testimonial: {
      quote: 'Our digital ad conversions saw a 3x return on spend after GLOYAS took over our visual strategy and ad campaign design.',
      author: 'Vikram Sen',
      role: 'VP of Growth, FinTech Labs'
    }
  }
};

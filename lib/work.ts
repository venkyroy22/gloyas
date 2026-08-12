export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  category: 'web-designing' | 'branding' | 'social-media-management' | 'marketing';
  categoryLabel: string;
  image: string; // We can use abstract SVGs or simple solid colored placeholders as visual cards
  challenge: string;
  approach: string;
  result: string;
  metrics: Metric[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'acme-digital-platform',
    client: 'Acme Corporation',
    title: 'Acme Digital Platform Redesign',
    category: 'web-designing',
    categoryLabel: 'Web Design & Development',
    image: '/images/work-web.svg',
    challenge: 'Acme\'s legacy enterprise platform suffered from low user engagement, slow page load speeds, and a complex navigation structure that led to user drops and lost leads.',
    approach: 'We completely overhauled their web presence, designing an intuitive UI/UX system in Figma and building a lightning-fast headless site using Next.js, React, and server-side optimization.',
    result: 'The platform launched to universal praise. Page load time dropped from 4.8s to 0.9s, leading to a massive increase in page views and customer sign-ups.',
    metrics: [
      { value: '45%', label: 'Increase in Conversion Rate' },
      { value: '0.9s', label: 'Average Page Load Time' },
      { value: '2.5x', label: 'More User Session Duration' }
    ],
    testimonial: {
      quote: 'GLOYAS rebuilt our entire web architecture. The performance improvements alone have directly translated to revenue growth.',
      author: 'Sarah Jenkins',
      role: 'VP of Product at Acme Corp'
    }
  },
  {
    slug: 'apex-brand-system',
    client: 'Apex Systems',
    title: 'Apex Strategy & Brand System',
    category: 'branding',
    categoryLabel: 'Brand Strategy & Identity',
    image: '/images/work-brand.svg',
    challenge: 'Apex Systems needed to move upmarket to secure enterprise clients but their existing brand identity felt like a small startup and lacked corporate authority.',
    approach: 'We conducted workshops to define their brand voice, positioning, and target personas. We then crafted a bold logo, refined typography, and designed comprehensive brand guidelines.',
    result: 'The redesigned visual identity repositioned Apex as an industry leader, giving their sales team the confidence to pursue and close multi-million dollar enterprise contracts.',
    metrics: [
      { value: '60%', label: 'Growth in Enterprise Deals' },
      { value: '100%', label: 'Sales Material Alignment' },
      { value: '$12M+', label: 'New Pipeline Generated' }
    ],
    testimonial: {
      quote: 'The brand identity GLOYAS crafted captured our vision perfectly. It elevated our business presence instantly.',
      author: 'Marcus Aurelius',
      role: 'Founder at Apex Systems'
    }
  },
  {
    slug: 'novus-rebrand',
    client: 'Novus Corp',
    title: 'Novus Global Rebrand Transition',
    category: 'social-media-management',
    categoryLabel: 'Corporate Rebranding',
    image: '/images/work-rebrand.svg',
    challenge: 'Novus Corp expanded from simple logistics into AI supply chain intelligence. Their decade-old brand was misaligned with their actual service offerings and scale.',
    approach: 'We facilitated a rebranding process, audit, and legacy migration layout. We modernized their logo mark, revamped all visual assets, and delivered a transition strategy to align internal stakeholders.',
    result: 'The rebranded identity launched globally, immediately clarifying their services, driving media coverage, and facilitating a seamless transition of legacy customers.',
    metrics: [
      { value: '3x', label: 'Media Mention Increase' },
      { value: '98%', label: 'Client Retention Rate' },
      { value: '10k+', label: 'Organic Search Impressions' }
    ],
    testimonial: {
      quote: 'Transitioning a 10-year-old brand was intimidating. GLOYAS navigated it perfectly, modernizing us while honoring our legacy trust.',
      author: 'Elena Rostova',
      role: 'Managing Director at Novus Corp'
    }
  },
  {
    slug: 'fintech-growth-campaign',
    client: 'FinTech Labs',
    title: 'FinTech Digital Campaign & Collateral',
    category: 'marketing',
    categoryLabel: 'Growth Marketing',
    image: '/images/work-marketing.svg',
    challenge: 'FinTech Labs had high ad spend but poor creative conversion rates. Their digital ads looked generic and failed to connect with modern business founders.',
    approach: 'We designed, copy-wrote, and optimized custom high-converting ad layouts, landing pages, and interactive pitch presentation materials reflecting premium aesthetics.',
    result: 'The new design-driven campaign outperformed all previous creatives, leading to a record-low acquisition cost and high ROI on performance channels.',
    metrics: [
      { value: '3.2x', label: 'Return on Ad Spend (ROAS)' },
      { value: '-40%', label: 'Reduction in Cost Per Lead' },
      { value: '250%', label: 'Increase in Email Sign-ups' }
    ],
    testimonial: {
      quote: 'Our digital ad conversions saw a 3x return after GLOYAS took over our ad campaign creative direction and design.',
      author: 'Vikram Sen',
      role: 'VP of Growth at FinTech Labs'
    }
  }
];

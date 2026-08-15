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

export const caseStudies: CaseStudy[] = [];

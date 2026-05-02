'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "The quality of their pieces is unmatched. Every item I've purchased has become a staple in my wardrobe. The attention to detail is remarkable.",
    name: 'Priya Sharma',
    title: 'Fashion Blogger',
    rating: 5,
  },
  {
    id: 2,
    quote:
      "GLOYAS has completely transformed how I approach fashion. Their minimalist aesthetic paired with premium fabrics makes dressing effortless.",
    name: 'Arjun Mehta',
    title: 'Creative Director',
    rating: 5,
  },
  {
    id: 3,
    quote:
      "From the packaging to the fit, everything speaks premium. Their customer service is exceptional — they truly care about the experience.",
    name: 'Ananya Kapoor',
    title: 'Stylist',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111] text-center mb-8 sm:mb-12"
        >
          What Our Customers Say
        </motion.h2>

        {/* Horizontal scroll on mobile, grid on tablet+ */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar snap-x-mandatory pb-4 sm:pb-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="min-w-[80%] sm:min-w-[60%] md:min-w-0 snap-center bg-white border border-[#E8E8E8] p-6 sm:p-8 flex flex-col gap-4 hover:shadow-lg hover:shadow-gray-100 transition-shadow duration-500 flex-shrink-0"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    fill="#0080FF"
                    color="#0080FF"
                    strokeWidth={0}
                  />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm font-light text-[#666666] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="pt-4 border-t border-[#E8E8E8]">
                <p className="text-sm font-semibold text-[#111111]">{t.name}</p>
                <p className="text-xs font-light text-[#666666]">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

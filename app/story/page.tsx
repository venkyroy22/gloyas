'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function StoryPage() {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16 sm:mb-24"
        >
          <h1 className="text-4xl sm:text-6xl font-thin tracking-[0.1em] uppercase text-[#111111] leading-tight mb-8">
            The Story of <span className="font-bold">GLOYAS</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#0080FF] mb-8" />
          <p className="text-lg sm:text-xl font-light text-[#666666] leading-relaxed">
            Born from a passion for excellence and a commitment to minimalist design, GLOYAS is more than just headwear—it&apos;s a tribute to those who never settle.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] bg-[#F9F9F9] overflow-hidden relative"
          >
            <Image 
              src="https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/baseballcap-1776881129562.webp" 
              alt="GLOYAS Craftsmanship" 
              fill
              className="object-contain p-12 hover:scale-105 transition-transform duration-700"
            />
          </motion.div>

          <div className="flex flex-col gap-8 sm:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#111111] mb-4">Our Origin</h2>
              <p className="text-sm sm:text-base font-light text-[#666666] leading-relaxed">
                Founded in 2024, GLOYAS began in a small workshop where we obsessed over a single question: Why is it so hard to find the perfect cap? We spent months researching fabrics, testing fits, and refining stitching until we achieved what we call the &quot;GLOYAS Standard.&quot;
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#111111] mb-4">The Name</h2>
              <p className="text-sm sm:text-base font-light text-[#666666] leading-relaxed">
                GLOYAS represents the &quot;Glow of Youth and Style.&quot; It&apos;s a tribute to the timeless energy that drives us to create, innovate, and look our best every single day. We believe that what you wear on your head is a reflection of what&apos;s inside it—ambition, creativity, and confidence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#111111] mb-4">Our Commitment</h2>
              <p className="text-sm sm:text-base font-light text-[#666666] leading-relaxed">
                Every piece in our collection is curated with a minimalist aesthetic, using only premium materials that stand the test of time. We don&apos;t believe in fast fashion; we believe in creating staples that you&apos;ll reach for season after season.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Vision Quote */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 sm:mt-40 text-center max-w-4xl mx-auto"
        >
          <h3 className="text-2xl sm:text-4xl font-thin italic text-[#111111] leading-relaxed">
            &quot;We didn&apos;t set out to build a hat company. We set out to redefine the most personal piece of your daily uniform.&quot;
          </h3>
          <p className="mt-8 text-xs font-bold tracking-[0.4em] uppercase text-[#0080FF]">
            GLOYAS Collective
          </p>
        </motion.div>
      </div>
    </div>
  );
}

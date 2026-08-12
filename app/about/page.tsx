'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
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
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Our Agency</span>
          <h1 className="text-4xl sm:text-6xl font-thin tracking-tight uppercase text-gray-900 leading-tight">
            The Story of <span className="font-bold">GLOYAS</span>
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            From physical craftsmanship to enterprise digital positioning. Our standard of quality remains absolute.
          </p>
        </motion.div>

        {/* Content Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 sm:gap-16 items-center">
          
          {/* Left: Graphic frame */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] bg-gray-50 border border-gray-150 rounded-[32px] p-10 flex flex-col justify-between hover:border-[#278DFD] transition-colors duration-300"
          >
            <div>
              <span className="text-3xl">🧩</span>
              <h3 className="text-xl font-black uppercase text-gray-900 mt-4 mb-2">Rigorous Craft</h3>
              <p className="text-xs text-gray-500 font-light leading-relaxed">
                Whether sizing a stitch or coding a server-side route, precision defines who we are.
              </p>
            </div>
            <div className="text-6xl font-black text-gray-200 tracking-tighter">GLY.01</div>
          </motion.div>

          {/* Right: History narrative */}
          <div className="flex flex-col gap-6 sm:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">Our Origin</h2>
              <p className="text-sm font-light text-gray-600 leading-relaxed">
                Founded in 2024, GLOYAS began with a relentless focus on custom physical creation. We spent months researching textures, detailing stitches, and testing proportions. We wanted to build elements that defied standard, off-the-shelf options, establishing our commitment to the design details.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">The Pivot to Services</h2>
              <p className="text-sm font-light text-gray-600 leading-relaxed">
                As other founders and clients saw the strategic branding, headless Next.js web application, and visual campaigns we built for ourselves, they began requesting our support. Recognizing a widespread market need for premium B2B custom design and developer execution, we transitioned our focus. Today, we bring that same rigorous quality focus to other scaling brands.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-900 mb-3">Our Standard</h2>
              <p className="text-sm font-light text-gray-600 leading-relaxed">
                We believe template layouts look average and hold back premium companies. Every brand guidelines book, Figma layout, React module, and copy campaign we produce is crafted bespoke to help you stand out.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Pull quote banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 sm:mt-32 text-center max-w-4xl mx-auto border-t border-gray-150 pt-16"
        >
          <h3 className="text-xl sm:text-3xl font-thin italic text-gray-900 leading-relaxed">
            &quot;We spent years perfecting a physical product. Now we apply that same relentless design obsession to your brand, website, and growth campaigns.&quot;
          </h3>
          <p className="mt-6 text-xs font-bold tracking-[0.3em] uppercase text-[#278DFD]">
            GLOYAS Collective
          </p>
        </motion.div>

      </div>
    </div>
  );
}

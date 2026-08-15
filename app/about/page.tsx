'use client';

import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="bg-white py-12 sm:py-16 min-h-[70vh]">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0">
        
        {/* Header Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#278DFD] block mb-3">Our Agency</span>
          <h1 className="text-[32px] sm:text-6xl lg:text-7xl font-medium text-black leading-[1.1] tracking-tight">
            About GLOYAS
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
        </motion.div>

        {/* Content Layout */}
        <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl">
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-lg sm:text-xl font-light text-gray-700 leading-relaxed"
           >
             Join us to create memories worth glory. Our dedicated team is here to help your business grow and maximize its potential by delivering tailored, premium digital solutions.
           </motion.p>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="text-lg sm:text-xl font-light text-gray-700 leading-relaxed"
           >
             We offer a comprehensive suite of services designed to elevate your brand. From custom Web Designing that blends clean aesthetics with high performance, to Strategic Branding that commands market positioning, we ensure your business stands out.
           </motion.p>

           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-lg sm:text-xl font-light text-gray-700 leading-relaxed"
           >
             In addition, our Social Media Management services modernize your company&apos;s relevance, and our data-backed Marketing campaigns drive measurable revenue. At GLOYAS, we bring a rigorous focus on quality to every project, turning complex challenges into seamless experiences.
           </motion.p>
        </div>

      </div>
    </div>
  );
}

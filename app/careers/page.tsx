'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CareersPage() {
  return (
    <div className="bg-white py-12 sm:py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-[1280px] lg:w-[95%] mx-auto px-4 sm:px-6 lg:px-0 text-center flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] mb-12"
        >
          <Image 
            src="/Careers-imgs/Thanks.png"
            alt="Thank you"
            fill
            className="object-contain"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-[32px] sm:text-5xl lg:text-6xl font-medium text-black leading-[1.1] tracking-tight mb-4">
            Thanks for your interest!
          </h1>
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed max-w-xl mx-auto">
            Currently no openings, please check back later.
          </p>
        </motion.div>
        
      </div>
    </div>
  );
}

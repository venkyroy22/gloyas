'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Get Started',
    desc: 'Submit your requirements in the Get Started section.'
  },
  {
    step: '02',
    title: 'We Got You!',
    desc: 'Our team will contact you as soon as possible.'
  },
  {
    step: '03',
    title: 'Let’s Discuss',
    desc: 'We will meet and discuss about the project.'
  },
  {
    step: '04',
    title: 'Delivering the Glory!',
    desc: 'We will put our crazy efforts and deliver the projects to you.'
  },
  {
    step: '05',
    title: 'Your Feedback',
    desc: 'We will again meet together and discuss about the outcome and get some feedback from you.'
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
          <h1 className="text-[32px] sm:text-6xl lg:text-7xl font-medium text-black leading-[1.1] tracking-tight">
            Our Process
          </h1>
          <div className="w-20 h-[1px] bg-[#278DFD] mt-6 mb-8" />
          <p className="text-lg sm:text-xl font-light text-gray-500 leading-relaxed">
            A structured, five-stage design and development model built to remove uncertainty and guarantee premium agency execution.
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
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-gray-900">
                    {item.title}
                  </h2>
                </div>

                <p className="text-lg text-gray-800 leading-relaxed max-w-2xl">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>



      </div>
    </div>
  );
}

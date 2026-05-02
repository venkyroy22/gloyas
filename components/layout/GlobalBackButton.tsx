'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalBackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <AnimatePresence>
      {!isHome && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={() => router.back()}
          className="fixed top-24 left-4 sm:left-8 z-40 flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-md border border-[#EEEEEE] shadow-sm rounded-full group hover:border-[#0080FF] transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-[#111111] flex items-center justify-center text-white group-hover:bg-[#0080FF] transition-colors">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Back</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

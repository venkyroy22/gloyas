'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { categories } from '@/lib/products';

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Handle scroll arrows visibility
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      // Also check on window resize
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.7;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const activeCategories = ['baseball-caps', 'beanies', 'snapback-caps', 'trucker-caps'];

  const handleCategoryClick = (e: React.MouseEvent, slug: string, index: number) => {
    e.preventDefault();
    
    // Only allow clicking for active categories
    if (!activeCategories.includes(slug)) return;

    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const items = container.querySelectorAll('.category-item');
    const targetItem = items[index] as HTMLElement;

    if (targetItem) {
      const containerWidth = container.offsetWidth;
      const itemWidth = targetItem.offsetWidth;
      const itemLeft = targetItem.offsetLeft;
      
      const scrollPos = container.scrollLeft;
      const itemRelativeLeft = itemLeft - scrollPos;
      
      if (itemRelativeLeft > containerWidth / 2) {
        container.scrollTo({
          left: itemLeft - 40,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          left: Math.max(0, itemLeft - containerWidth + itemWidth + 40),
          behavior: 'smooth'
        });
      }

      setTimeout(() => {
        router.push(`/products?category=${slug}`);
      }, 400);
    } else {
      router.push(`/products?category=${slug}`);
    }
  };

  return (
    <section className="pt-24 sm:pt-32 pb-8 sm:pb-12 bg-white relative group/grid">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        
        {/* Mobile Scroll Arrows */}
        <AnimatePresence mode="wait">
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="absolute left-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 sm:hidden"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className="absolute right-2 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-gray-100 sm:hidden"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Edge Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden sm:block" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden sm:block" />

        {/* Scrollable container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar sm:justify-start items-start gap-8 sm:gap-12 lg:gap-16 pb-4 sm:pb-0 scroll-smooth px-2 sm:px-0"
        >
          {categories.map((cat, i) => {
            const isActive = activeCategories.includes(cat.slug);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={isActive ? { scale: 0.95 } : {}}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex-shrink-0 category-item py-2"
              >
                <button
                  onClick={(e) => handleCategoryClick(e, cat.slug, i)}
                  disabled={!isActive}
                  suppressHydrationWarning
                  className={`group flex flex-col items-center gap-4 sm:gap-6 outline-none ${
                    isActive ? 'cursor-pointer' : 'cursor-default opacity-40 grayscale-[0.5]'
                  }`}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center transition-all duration-300 relative`}>
                    <Image
                      src={cat.image}
                      alt={isActive ? `Shop ${cat.name} collection` : `${cat.name} coming soon`}
                      fill
                      sizes="(max-width: 768px) 100px, 120px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] sm:text-[11px] font-black tracking-[0.05em] uppercase transition-colors duration-300 text-center max-w-[80px] sm:max-w-none leading-tight ${
                      isActive ? 'text-black group-hover:text-[#0080FF]' : 'text-gray-400'
                    }`}>
                      {cat.name}
                    </span>
                    {!isActive && (
                      <span className="text-[7px] sm:text-[8px] font-bold text-[#0080FF] uppercase tracking-[0.1em]">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

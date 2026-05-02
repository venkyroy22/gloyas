'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCard from '@/components/product/ProductCard';

import NewsletterSection from '@/components/home/NewsletterSection';
import { getNewArrivals, getProductsByCategory, fetchProducts, Product } from '@/lib/products';

const tabs = [
  { label: 'All', filter: 'all' },
  { label: 'New Arrivals', filter: 'new' },
  { label: 'Best Sellers', filter: 'bestseller' },
  { label: 'Baseball Caps', filter: 'baseball-caps' },
  { label: 'Beanies', filter: 'beanies' },
];


export default function HomePage() {
  const [tabProducts, setTabProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialProducts = await getProductsByCategory('all');
      setTabProducts(initialProducts);
      setIsLoading(false);
    };
    const timer = setTimeout(() => {
      setIsLoading(true);
      loadInitialData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadTabProducts = async () => {
      let data: Product[] = [];
      if (activeTab === 'all') {
        data = await fetchProducts();
      } else if (activeTab === 'new') {
        data = await getNewArrivals();
      } else {
        data = await getProductsByCategory(activeTab);
      }
      setTabProducts(data);
      setIsLoading(false);
    };
    const timer = setTimeout(() => {
      setIsLoading(true);
      loadTabProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <>

      {/* Hero — Launching Soon */}
      <HeroSection />

      {/* Category Scroll — horizontal pills like Urban Monkey */}
      <CategoryGrid />

      {/* Tabbed Product Section — Urban Monkey style */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Tab Navigation — horizontal scroll on mobile */}
          <div className="flex gap-2 sm:gap-4 overflow-x-auto hide-scrollbar pb-4 sm:pb-8 mb-2">
            {tabs.map((tab) => (
              <button
                key={tab.filter}
                onClick={() => setActiveTab(tab.filter)}
                suppressHydrationWarning
                className={`whitespace-nowrap px-5 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 flex-shrink-0 ${
                  activeTab === tab.filter
                    ? 'bg-[#0080FF] text-white'
                    : 'bg-transparent text-[#888888] hover:text-[#0080FF] border border-[#E0E0E0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5"
          >
            {isLoading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Loading products...</p>
              </div>
            ) : tabProducts.length > 0 ? (
              tabProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-[#E0E0E0] bg-[#F9F9F9]">
                <p className="text-sm text-[#999999] font-light uppercase tracking-widest">No products available in this category yet.</p>
                <p className="text-[10px] text-[#BBBBBB] mt-2 uppercase tracking-[0.2em]">New arrivals coming soon</p>
              </div>
            )}
          </motion.div>

          {/* View All */}
          <div className="flex justify-center mt-8 sm:mt-12">
            <Link
              href="/products"
              className="px-10 py-3.5 bg-[#0080FF] text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#006bdd] transition-colors active:scale-95"
            >
              View All
            </Link>
          </div>
        </div>
      </section>


      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}

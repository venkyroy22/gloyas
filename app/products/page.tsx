'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import FilterSidebar from '@/components/product/FilterSidebar';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, fetchProducts } from '@/lib/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam
      ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
      : 'All'
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    const loadProductsData = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    const timer = setTimeout(() => {
      loadProductsData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category === selectedCategory.toLowerCase()
      );
    }

    // Special filters
    if (filterParam === 'new') {
      result = result.filter((p) => p.isNew);
    } else if (filterParam === 'sale') {
      result = result.filter((p) => p.isSale);
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c.name))
      );
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, selectedSizes, selectedColors, priceRange, sortBy, filterParam]);

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 10000]);
  };

  const activeFilterCount = [
    selectedCategory !== 'All' ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Most Popular', value: 'popular' },
  ];

  return (
    <div className="pt-20 sm:pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-[0.15em] uppercase text-[#111111]">
            {filterParam === 'new'
              ? 'New Arrivals'
              : filterParam === 'sale'
              ? 'Sale'
              : selectedCategory !== 'All'
              ? selectedCategory
              : 'All Products'}
          </h1>
          <p className="text-xs sm:text-sm font-light text-[#666666] mt-2 sm:mt-3">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[#E8E8E8]">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#0080FF] transition-colors relative"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 bg-[#0080FF] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden lg:block" />

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#0080FF] transition-colors"
            >
              <span className="hidden sm:inline">Sort by:</span> {sortOptions.find((o) => o.value === sortBy)?.label}
              <ChevronDown size={14} />
            </button>
            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 bg-white border border-[#E8E8E8] shadow-lg z-20 min-w-[200px]">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-xs font-light transition-colors ${
                        sortBy === option.value
                          ? 'text-[#0080FF] bg-[#F9F9F9] font-semibold'
                          : 'text-[#666666] hover:bg-[#F9F9F9]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={selectedCategory}
              selectedSizes={selectedSizes}
              selectedColors={selectedColors}
              priceRange={priceRange}
              onCategoryChange={setSelectedCategory}
              onSizeToggle={handleSizeToggle}
              onColorToggle={handleColorToggle}
              onPriceChange={setPriceRange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 lg:hidden"
              >
                <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowFilters(false)}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute left-0 right-0 bottom-0 max-h-[85vh] bg-white rounded-t-2xl overflow-hidden flex flex-col"
                >
                  {/* Drag handle */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#F0F0F0]">
                    <h3 className="text-sm font-semibold tracking-widest uppercase">
                      Filters
                    </h3>
                    <div className="flex items-center gap-4">
                      {activeFilterCount > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs font-semibold text-[#0080FF]"
                        >
                          Clear All
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        aria-label="Close filters"
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Filter Content */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <FilterSidebar
                      selectedCategory={selectedCategory}
                      selectedSizes={selectedSizes}
                      selectedColors={selectedColors}
                      priceRange={priceRange}
                      onCategoryChange={setSelectedCategory}
                      onSizeToggle={handleSizeToggle}
                      onColorToggle={handleColorToggle}
                      onPriceChange={setPriceRange}
                      onClearAll={handleClearAll}
                    />
                  </div>

                  {/* Apply Button */}
                  <div className="p-4 border-t border-[#F0F0F0] bg-white"
                    style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
                  >
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-4 bg-[#0080FF] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#006bdd] transition-colors"
                    >
                      Show {filteredProducts.length} Results
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-8 sm:mt-12">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#0080FF] to-[#59A9F8] text-white text-xs font-semibold tracking-widest uppercase hover:from-[#1a8fff] hover:to-[#6fb5f9] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 active:scale-95">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

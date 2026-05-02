'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon } from 'lucide-react';
import { fetchProducts, formatPrice, Product, categories as catList } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      // Fetch products if not loaded yet
      if (allProducts.length === 0) {
        const timer = setTimeout(() => {
          setIsLoading(true);
          fetchProducts().then(data => {
            setAllProducts(data);
            setIsLoading(false);
          });
        }, 0);
        return () => clearTimeout(timer);
      }
    } else {
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setQuery('');
        setResults([]);
        setSuggestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, allProducts.length]);

  useEffect(() => {
    if (query.trim().length > 1 && allProducts.length > 0) {
      const q = query.toLowerCase().trim();
      const matches: Array<{ product: Product, score: number }> = [];

      allProducts.forEach(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        const subcat = p.subcategory.toLowerCase();

        // Exact substring matches get highest score (0)
        if (name.includes(q) || cat.includes(q) || subcat.includes(q)) {
          matches.push({ product: p, score: 0 });
          return;
        }

        // Fuzzy match on individual words
        const words = name.split(' ');
        let bestDistance = Infinity;
        for (const word of words) {
          const dist = levenshtein(q, word);
          if (dist < bestDistance) bestDistance = dist;
        }

        // Allow up to 2 typos for fuzzy match
        if (bestDistance <= 2) {
          matches.push({ product: p, score: bestDistance });
        }
      });

      // Sort by score (lower is better), then limit to 5
      matches.sort((a, b) => a.score - b.score);
      const filtered = matches.map(m => m.product).slice(0, 5);
      
      const timer = setTimeout(() => {
        setResults(filtered);
        
        // Suggestion Logic ("Did you mean?")
        if (filtered.length === 0) {
          let bestMatch = '';
          let minFuzzy = Infinity;

          const searchPool = new Set<string>();
          
          // Add words from all products
          allProducts.forEach(p => {
            p.name.split(' ').forEach(w => searchPool.add(w.toLowerCase()));
            p.category.split('-').forEach(w => searchPool.add(w.toLowerCase()));
            if (p.subcategory) p.subcategory.split(' ').forEach(w => searchPool.add(w.toLowerCase()));
          });
          
          // Add words from static category list
          catList.forEach(c => {
            c.name.split(' ').forEach(w => searchPool.add(w.toLowerCase()));
          });

          searchPool.forEach(word => {
            if (word.length > 3) {
              const dist = levenshtein(q, word);
              if (dist <= 2 && dist < minFuzzy) {
                minFuzzy = dist;
                bestMatch = word;
              }
            }
          });

          if (bestMatch && bestMatch !== q) {
            setSuggestion(bestMatch);
          } else {
            setSuggestion(null);
          }
        } else {
          setSuggestion(null);
        }
      }, 0);
      return () => clearTimeout(timer);

    } else {
      const timer = setTimeout(() => {
        setResults([]);
        setSuggestion(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [query, allProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex items-center justify-between gap-3 border-b border-[#E8E8E8]">
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
              <SearchIcon size={20} className="text-[#666666] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for caps, snapbacks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-base sm:text-xl font-light tracking-wide placeholder:text-[#CCCCCC] text-[#111111]"
              />
              {isLoading && <div className="w-4 h-4 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin" />}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group flex-shrink-0"
            >
              <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-12">
              {query.trim().length > 1 ? (
                <div>
                  <div className="flex items-center gap-2 mb-4 sm:mb-8">
                    <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#666666]">
                      {results.length > 0 ? `Results for "${query}"` : `No results found for "${query}"`}
                    </h3>
                    {suggestion && (
                      <span className="text-xs text-[#666666]">
                        Did you mean: <button onClick={() => setQuery(suggestion)} className="font-semibold text-[#0080FF] underline hover:text-[#0066CC]">{suggestion}</button>?
                      </span>
                    )}
                  </div>
                  
                  {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={onClose}
                          className="group"
                        >
                          <div className="aspect-square bg-white overflow-hidden border border-[#E8E8E8] mb-3 sm:mb-4 relative">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-[#0080FF] uppercase tracking-wider mb-1 line-clamp-1">
                            {product.subcategory}
                          </p>
                          <h4 className="text-xs font-semibold uppercase text-[#111111] group-hover:text-[#0080FF] transition-colors line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-sm font-light text-[#666666] mt-1">
                            {formatPrice(product.price)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 sm:py-20 text-center">
                      <p className="text-base sm:text-xl font-light text-[#666666]">
                        We couldn&apos;t find anything matching your search.
                      </p>
                      <button 
                        onClick={() => setQuery('')}
                        className="mt-4 text-[#0080FF] underline underline-offset-4 hover:text-[#59A9F8]"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20">
                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#666666] mb-4 sm:mb-8">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {['Baseball Caps', 'Suede Heritage', 'Limited Edition', 'Active Performance', 'Sale Items'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-[#E8E8E8] text-xs font-light hover:border-[#0080FF] hover:text-[#0080FF] transition-all duration-300 active:scale-95"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Collections */}
                  <div>
                    <h3 className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#666666] mb-4 sm:mb-8">
                      Quick Collections
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        { label: 'Baseball', slug: 'baseball-caps' },
                        { label: 'Snapbacks', slug: 'snapback-caps' },
                        { label: 'Trucker', slug: 'trucker-caps' },
                        { label: '5-Panel', slug: '5-panel-cap' },
                      ].map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/products?category=${cat.slug}`}
                          onClick={onClose}
                          className="relative h-16 sm:h-20 group overflow-hidden bg-white border border-[#E8E8E8] flex items-center justify-center transition-all duration-300 hover:border-[#0080FF] active:scale-95"
                        >
                          <span className="relative z-10 text-[#111111] text-[10px] font-semibold tracking-[0.2em] uppercase group-hover:text-white transition-colors duration-300">
                            {cat.label}
                          </span>

                          <div className="absolute inset-0 bg-[#0080FF] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

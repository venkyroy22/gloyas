'use client';

import { X } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: [number, number];
  onCategoryChange: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onColorToggle: (color: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearAll: () => void;
}

const allCategories = ['All', 'Baseball Caps', 'Snapbacks', 'Trucker Caps', '5-Panel Cap', 'Bucket Hats', 'Beanies'];

export default function FilterSidebar({
  selectedCategory,
  selectedSizes,
  selectedColors,
  priceRange,
  onCategoryChange,
  onSizeToggle,
  onColorToggle,
  onPriceChange,
  onClearAll,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111]">
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs font-light text-[#0080FF] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'All' && (
              <FilterChip
                label={selectedCategory}
                onRemove={() => onCategoryChange('All')}
              />
            )}
          </div>
        )}

        {/* Category */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#111111]">
            Category
          </h4>
          <div className="flex flex-col gap-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`text-left text-sm font-light transition-colors duration-200 ${
                  selectedCategory === cat
                    ? 'text-[#0080FF] font-semibold'
                    : 'text-[#666666] hover:text-[#111111]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#111111]">
            Sizes
          </h4>
          <div className="flex flex-wrap gap-2">
            {['One Size Fits All', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => onSizeToggle(size)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                  selectedSizes.includes(size)
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#666666] border-[#EEEEEE] hover:border-[#111111]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#111111]">
            Colors
          </h4>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Midnight Black', hex: '#000000' },
              { name: 'Royal Navy', hex: '#000080' },
              { name: 'Classic Red', hex: '#FF0000' },
              { name: 'Forest Green', hex: '#228B22' },
              { name: 'Stone Grey', hex: '#808080' },
            ].map((color) => (
              <button
                key={color.name}
                onClick={() => onColorToggle(color.name)}
                className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                  selectedColors.includes(color.name)
                    ? 'border-[#0080FF] scale-110 ring-2 ring-[#0080FF]/20'
                    : 'border-[#EEEEEE] hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>
        {/* Price Range */}
        <div className="flex flex-col gap-3">
          <h4 className="text-xs font-semibold tracking-widest uppercase text-[#111111]">
            Price Range
          </h4>
          <input
            type="range"
            min={0}
            max={10000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#0080FF]"
            aria-label="Maximum price"
          />
          <div className="flex items-center justify-between text-xs font-light text-[#666666]">
            <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#0080FF] to-[#59A9F8] text-white text-[10px] font-semibold tracking-wider uppercase">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}>
        <X size={10} />
      </button>
    </span>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { Product, formatPrice } from '@/lib/products';
import { useWishlistStore } from '@/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  
  const isWishlisted = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link href={`/products/${product.id}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F2F2F2]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Stock Badges */}
          {product.stockCount <= 0 ? (
            <div className="absolute top-3 left-3 bg-[#111111] text-white px-2 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest z-10">
              Out of Stock
            </div>
          ) : product.stockCount <= 5 ? (
            <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest z-10 animate-pulse">
              Only {product.stockCount} Left
            </div>
          ) : product.isNew ? (
            <div className="absolute top-3 left-3 bg-[#0080FF] text-white px-2 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest z-10">
              New Arrival
            </div>
          ) : product.isSale && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest z-10">
              Sale
            </div>
          )}

          {/* Wishlist heart — simple outline, top-right */}
          <button
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className="absolute top-3 right-3 p-1.5 transition-all duration-200 active:scale-90"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem({
                id: product.id,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.images[0],
                category: product.category,
              });
            }}
          >
            <Heart
              size={20}
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                isWishlisted
                  ? 'fill-[#0080FF] text-[#0080FF]'
                  : 'fill-transparent text-[#888888] group-hover:text-[#0080FF]'
              }`}
            />
          </button>
        </div>

        {/* Info — minimal: name + rating + price */}
        <div className="pt-3 sm:pt-4">
          <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-[#111111] line-clamp-1">
            {product.name}
          </h3>
          
          {/* Rating — Blue stars as requested */}
          <div className="flex items-center gap-0.5 mt-1 sm:mt-1.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                size={10} 
                fill={i < Math.floor(product.rating) ? "#0080FF" : "transparent"}
                className={i < Math.floor(product.rating) ? "text-[#0080FF]" : "text-[#E0E0E0]"}
              />
            ))}
            <span className="text-[10px] text-[#888888] ml-1.5 font-medium tracking-tight">
              ({product.reviewCount})
            </span>
          </div>

          <p className="text-xs sm:text-sm font-black text-[#111111] mt-1 sm:mt-2 tracking-wide">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

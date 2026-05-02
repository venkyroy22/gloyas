'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Heart, Minus, Plus, ChevronDown, ChevronUp, ShoppingBag, X } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import ReviewSection from '@/components/product/ReviewSection';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, formatPrice, Product, fetchProducts } from '@/lib/products';
import { useCartStore } from '@/context/CartContext';
import { useWishlistStore } from '@/context/WishlistContext';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(true);
  const [showShipping, setShowShipping] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showUpsell, setShowUpsell] = useState(true);

  const { toggleItem, isInWishlist } = useWishlistStore();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const loadProductData = useCallback(async () => {
    setIsLoading(true);
    const data = await getProduct(params.id as string);
    if (data) {
      setProduct(data);
      const allProducts = await fetchProducts();
      const related = allProducts
        .filter((p) => p.category === data.category && p.id !== data.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProductData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProductData]);

  // Show sticky bar when CTA buttons scroll out of view
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-20 flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-xl sm:text-2xl font-thin tracking-widest uppercase text-[#111111]">
          Product Not Found
        </h1>
        <p className="text-sm font-light text-[#666666] mt-3">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      size: selectedSize || product.sizes[0],
      color: selectedColor || product.colors[0]?.name || 'Standard',
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
    });
  };

  return (
    <div className="pt-20 sm:pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-light text-[#666666] mb-6 sm:mb-8 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-[#0080FF] transition-colors shrink-0 !min-h-0">Home</Link>
          <span className="text-[#CCCCCC] shrink-0 leading-none">/</span>
          <Link href="/products" className="hover:text-[#0080FF] transition-colors shrink-0 !min-h-0">Products</Link>
          <span className="text-[#CCCCCC] shrink-0 leading-none">/</span>
          <span className="text-[#111111] font-medium truncate shrink-0">{product.name}</span>
        </div>

        {/* Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-6 sm:gap-10 lg:gap-20 items-start">
          {/* Left: Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductGallery images={product.images} name={product.name} />
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4 sm:gap-5"
          >
            {/* Brand Tag */}
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#0080FF]">
              GLOYAS {product.subcategory}
            </span>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide uppercase text-[#111111]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(product.rating) ? '#0080FF' : '#E8E8E8'}
                    color={i < Math.floor(product.rating) ? '#0080FF' : '#E8E8E8'}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-xs font-light text-[#666666]">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-[#111111]">
                {formatPrice(product.price)}
              </span>
              {product.price < product.originalPrice && (
                <>
                  <span className="text-base sm:text-lg font-light text-[#999999] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 sm:py-1">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold tracking-widest uppercase text-[#111111]">
                  Color: <span className="font-normal text-[#666666]">{selectedColor || product.colors[0]?.name || 'Standard'}</span>
                </label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      aria-label={`Select ${color.name} color`}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all duration-200 ${
                        (selectedColor || product.colors[0]?.name) === color.name
                          ? 'ring-2 ring-[#0080FF] ring-offset-2'
                          : 'ring-1 ring-[#E8E8E8] hover:ring-[#0080FF]'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold tracking-widest uppercase text-[#111111]">
                  Size: <span className="font-normal text-[#666666]">{selectedSize || 'Select a size'}</span>
                </label>
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-200 border ${
                      selectedSize === size
                        ? 'bg-[#0080FF] border-[#0080FF] text-white'
                        : 'bg-white border-[#E8E8E8] text-[#111111] hover:border-[#111111]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Indicators */}
            {product.stockCount > 5 ? (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <p className="text-[10px] sm:text-xs font-medium text-green-600 tracking-wide uppercase">
                  In Stock
                </p>
              </div>
            ) : product.stockCount > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-[10px] sm:text-xs font-medium text-orange-600 tracking-wide uppercase">
                  Only {product.stockCount} left!
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[10px] sm:text-xs font-medium text-red-600 tracking-wide uppercase">
                  Out of Stock
                </p>
              </div>
            )}


            {/* Quantity */}
            <div className="flex flex-col gap-2.5">
              <label className="text-xs font-bold tracking-widest uppercase text-[#111111]">
                Quantity
              </label>
              <div className="flex items-center border border-[#E8E8E8] w-fit">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[#F9F9F9] transition-colors text-[#111111] active:scale-90"
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 sm:px-6 text-sm font-semibold min-w-[50px] sm:min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-[#F9F9F9] transition-colors text-[#111111] active:scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* CTA Buttons — tracked by intersection observer */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stockCount <= 0}
                className={`flex-1 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  product.stockCount > 0 
                    ? 'bg-[#0080FF] text-white hover:bg-[#006bdd]' 
                    : 'bg-[#EEEEEE] text-[#999999] cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={16} strokeWidth={2} />
                {product.stockCount <= 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                className={`py-4 px-6 border text-xs font-bold tracking-[0.2em] uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isWishlisted
                    ? 'border-[#0080FF] text-[#0080FF] bg-[#0080FF]/5'
                    : 'border-[#E8E8E8] text-[#666666] hover:border-[#0080FF] hover:text-[#0080FF]'
                }`}
              >
                <Heart
                  size={16}
                  strokeWidth={2}
                  className={isWishlisted ? 'fill-[#0080FF] text-[#0080FF]' : ''}
                />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#E8E8E8] mt-2 sm:mt-4">
              {/* Description */}
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-widest uppercase text-[#111111]"
              >
                Product Details
                {showDescription ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showDescription && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="pb-4"
                >
                  <p className="text-sm font-light text-[#666666] leading-relaxed mb-3">
                    {product.description}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {product.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-xs font-light text-[#666666] flex items-start gap-2"
                      >
                        <span className="w-1 h-1 bg-[#0080FF] rounded-full mt-1.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Shipping */}
              <div className="border-t border-[#E8E8E8]">
                <button
                  onClick={() => setShowShipping(!showShipping)}
                  className="w-full flex items-center justify-between py-4 text-xs font-bold tracking-widest uppercase text-[#111111]"
                >
                  Shipping & Returns
                  {showShipping ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {showShipping && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pb-4 text-sm font-light text-[#666666] leading-relaxed"
                  >
                    <p className="mb-2">
                      <strong className="font-semibold text-[#111111]">Free Shipping</strong> on orders above ₹999.
                      Standard delivery in 3-5 business days.
                    </p>
                    <p className="mb-2">
                      <strong className="font-semibold text-[#111111]">Express Delivery</strong> available at ₹199.
                      Delivered within 1-2 business days.
                    </p>
                    <p>
                      <strong className="font-semibold text-[#111111]">Easy Returns</strong> within 30 days
                      of purchase. Items must be unworn with tags attached.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Story Section */}
        {product.productStory && (
          <section className="mt-12 sm:mt-20 border-t border-[#EEEEEE] pt-12 sm:pt-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#0080FF] mb-6">
                The Story
              </h2>
              <h3 className="text-2xl sm:text-4xl font-light tracking-tight text-[#111111] mb-10 leading-tight">
                Beyond the Fabric
              </h3>
              <div className="prose prose-neutral max-w-none">
                <p className="text-base sm:text-lg sm:text-xl font-light leading-relaxed text-[#666666] whitespace-pre-wrap">
                  {product.productStory}
                </p>
              </div>
              <div className="mt-12 flex justify-center">
                <div className="w-12 h-0.5 bg-[#0080FF]/20" />
              </div>
            </div>
          </section>
        )}

        {/* Frequently Bought Together (Upsell Engine) */}
        {relatedProducts.length > 0 && showUpsell && (
          <section className="mt-16 sm:mt-24 p-6 sm:p-10 bg-[#FAFAFA] border border-[#EEEEEE] relative group">
            <button 
              onClick={() => setShowUpsell(false)}
              className="absolute top-4 right-4 p-2 text-[#BBBBBB] hover:text-[#111111] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-[#111111] mb-8">
              Frequently Bought Together
            </h3>
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12">
              <div className="flex items-center gap-4 sm:gap-8">
                {/* Current Product */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white border border-[#E8E8E8] relative flex-shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 border border-[#EEEEEE]">
                    <Plus size={16} className="text-[#999999]" />
                  </div>
                </div>

                {/* Upsell Product */}
                <Link href={`/products/${relatedProducts[0].id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-white border border-[#E8E8E8] relative flex-shrink-0 group">
                  <Image src={relatedProducts[0].images[0]} alt={relatedProducts[0].name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </Link>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <p className="text-sm font-light text-[#666666] mb-2">
                  Bundle <span className="font-semibold text-[#111111]">{product.name}</span> + <span className="font-semibold text-[#111111]">{relatedProducts[0].name}</span>
                </p>
                <div className="flex items-baseline justify-center lg:justify-start gap-3 mb-4">
                  <span className="text-xl font-bold text-[#111111]">{formatPrice(Math.round((product.price + relatedProducts[0].price) * 0.85))}</span>
                  <span className="text-sm font-light text-[#999999] line-through">{formatPrice(product.price + relatedProducts[0].price)}</span>
                  <span className="text-[10px] font-bold text-[#0080FF] bg-[#0080FF]/10 px-2 py-1 uppercase tracking-widest">Save 15%</span>
                </div>
                <button 
                  onClick={() => {
                    // Add current product at 15% off
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: Math.round(product.price * 0.85),
                      originalPrice: product.originalPrice,
                      image: product.images[0],
                      size: selectedSize || product.sizes[0],
                      color: selectedColor || product.colors[0]?.name || 'Standard',
                      quantity: 1,
                    });
                    // Add related product at 15% off
                    addItem({
                      id: relatedProducts[0].id,
                      name: relatedProducts[0].name,
                      price: Math.round(relatedProducts[0].price * 0.85),
                      originalPrice: relatedProducts[0].originalPrice,
                      image: relatedProducts[0].images[0],
                      size: relatedProducts[0].sizes[0],
                      color: relatedProducts[0].colors[0]?.name || 'Standard',
                      quantity: 1,
                    });
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                  }}
                  className="px-8 py-3 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#006bdd] transition-all flex items-center gap-2 mx-auto lg:mx-0 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 active:scale-95"
                >
                  <ShoppingBag size={14} />
                  Add Bundle to Cart
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <ReviewSection productId={product.id} onReviewUpdate={loadProductData} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-20 pt-10 sm:pt-20 border-t border-[#E8E8E8]">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-[#111111] mb-6 sm:mb-10">
              You Might Also Like
            </h2>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x-mandatory pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible">
              {relatedProducts.map((p, i) => (
                <div key={p.id} className="min-w-[45%] sm:min-w-0 snap-start">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Bar — Mobile only, appears when CTA scrolls out of view */}
      {showStickyBar && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#E8E8E8] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Price */}
            <div className="flex-shrink-0">
              <p className="text-sm font-bold text-[#111111]">{formatPrice(product.price)}</p>
              {product.price < product.originalPrice && (
                <p className="text-[10px] text-[#999999] line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
            {/* Wishlist */}
            <button
              onClick={handleToggleWishlist}
              className="w-12 h-12 flex items-center justify-center border border-[#E8E8E8] flex-shrink-0 active:scale-90 transition-transform"
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={isWishlisted ? 'fill-[#0080FF] text-[#0080FF]' : 'text-[#666666]'}
              />
            </button>
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 bg-[#0080FF] text-white text-[11px] font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#006bdd] transition-colors active:scale-[0.98]"
            >
              <ShoppingBag size={14} strokeWidth={2} />
              {addedToCart ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

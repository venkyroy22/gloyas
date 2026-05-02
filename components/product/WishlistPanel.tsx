'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '@/context/WishlistContext';
import { useCartStore } from '@/context/CartContext';
import Image from 'next/image';
import { formatPrice } from '@/lib/products';
import Button from '@/components/ui/Button';
import { useEffect } from 'react';

export default function WishlistPanel() {
  const { items, isOpen, onClose, removeItem } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);

  // Lock body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleMoveToCart = (item: WishlistItem) => {
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      size: 'Adjustable', // Default size
      color: 'Default', // Default color
      quantity: 1,
    });
    removeItem(item.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Panel — full width on mobile */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#E8E8E8] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-widest uppercase text-[#111111]">
                  My Wishlist
                </h2>
                <p className="text-[10px] text-[#666666] uppercase mt-1">
                  {items.length} {items.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <Trash2 size={24} className="text-[#CCCCCC]" />
                  </div>
                  <div>
                    <p className="text-sm font-light text-[#111111]">Your wishlist is empty</p>
                    <p className="text-xs font-light text-[#666666] mt-1">
                      Save your favorite items to keep track of them.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={onClose} className="mt-2">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-5 sm:gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4 group">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F9F9F9] overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[#0080FF] uppercase tracking-wider mb-1">
                              {item.category}
                            </p>
                            <h3 className="text-xs font-semibold uppercase text-[#111111] truncate">
                              {item.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-[#CCCCCC] hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#111111] mt-1.5 sm:mt-2">
                          {formatPrice(item.price)}
                        </p>
                        <div className="mt-auto pt-3 sm:pt-4 flex gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            className="text-[10px] font-semibold uppercase tracking-widest text-[#0080FF] hover:underline underline-offset-4 flex items-center gap-1.5"
                          >
                            <ShoppingBag size={12} />
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#E8E8E8] bg-gray-50"
                style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
              >
                <Button fullWidth onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

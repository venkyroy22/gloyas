'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItemCard from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-thin tracking-[0.15em] uppercase text-[#111111]">
            Shopping Cart
          </h1>
          <p className="text-sm font-light text-[#666666] mt-3">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 flex items-center justify-center bg-[#F9F9F9] rounded-full mb-6">
              <ShoppingBag size={40} strokeWidth={1} className="text-[#999999]" />
            </div>
            <h2 className="text-2xl font-thin tracking-widest uppercase text-[#111111] mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-sm font-light text-[#666666] mb-8 max-w-md">
              Looks like you haven&apos;t added any items yet. Explore our collections and
              find something you love.
            </p>
            <Link href="/products">
              <Button size="lg">
                Start Shopping
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Cart Content */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {items.map((item) => (
                <CartItemCard
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                />
              ))}

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  href="/products"
                  className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#666666] hover:text-[#0080FF] transition-colors duration-300"
                >
                  <ArrowRight
                    size={14}
                    className="rotate-180 group-hover:-translate-x-1 transition-transform duration-300"
                  />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

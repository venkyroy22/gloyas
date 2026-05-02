'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartBouncing: boolean;
  appliedCoupon: { code: string; discount: number; id: string } | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  triggerBounce: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  applyCoupon: (coupon: { code: string; discount: number; id: string }) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartBouncing: false,
      appliedCoupon: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
        get().triggerBounce();
      },

      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        })),

      updateQuantity: (id, size, color, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.id === id && i.size === size && i.color === color)
                )
              : state.items.map((i) =>
                  i.id === id && i.size === size && i.color === color
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [], appliedCoupon: null }),

      triggerBounce: () => {
        set({ isCartBouncing: true });
        setTimeout(() => set({ isCartBouncing: false }), 500);
      },

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      
      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'gloyas-cart',
    }
  )
);

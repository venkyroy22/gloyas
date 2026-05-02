'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType, useCartStore } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemCard({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-6 border-b border-[#E8E8E8]">
      {/* Image */}
      <Link
        href={`/products/${item.id}`}
        className="w-24 h-28 flex-shrink-0 overflow-hidden bg-[#F9F9F9] relative"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.id}`}
            className="text-sm font-semibold text-[#111111] hover:text-[#0080FF] transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-xs font-light text-[#666666] mt-1">
            Size: {item.size} &nbsp;•&nbsp; Color: {item.color}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-3 gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#E8E8E8]">
            <button
              aria-label="Decrease quantity"
              onClick={() =>
                updateQuantity(item.id, item.size, item.color, item.quantity - 1)
              }
              className="p-2 hover:bg-[#F9F9F9] transition-colors"
            >
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="px-4 text-sm font-light min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              aria-label="Increase quantity"
              onClick={() =>
                updateQuantity(item.id, item.size, item.color, item.quantity + 1)
              }
              className="p-2 hover:bg-[#F9F9F9] transition-colors"
            >
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#111111]">
              {formatPrice(item.price * item.quantity)}
            </span>
            <button
              aria-label={`Remove ${item.name} from cart`}
              onClick={() => removeItem(item.id, item.size, item.color)}
              className="p-1.5 text-[#999999] hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

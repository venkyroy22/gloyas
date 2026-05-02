'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import { validateCoupon, CouponValidationResult } from '@/lib/coupons';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Tag, Check, X } from 'lucide-react';

export default function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [promoCode, setPromoCode] = useState(appliedCoupon?.code || '');
  const [isValidating, setIsValidating] = useState(false);
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);

  useEffect(() => {
    if (appliedCoupon) {
      const timer = setTimeout(() => {
        setPromoCode(appliedCoupon.code);
        setCouponResult({
          valid: true,
          discount: appliedCoupon.discount,
          coupon: { 
            id: appliedCoupon.id, 
            code: appliedCoupon.code, 
            type: 'percentage', // placeholder for type
            value: 0,
            min_order_amount: 0,
            max_uses: null,
            used_count: 0,
            is_active: true,
            expires_at: null,
            created_at: new Date().toISOString()
          },
          message: 'Coupon applied successfully!',
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [appliedCoupon]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = appliedCoupon ? appliedCoupon.discount : (couponResult?.valid ? couponResult.discount : 0);
  
  const total = subtotal + shipping - discount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsValidating(true);
    const result = await validateCoupon(promoCode, subtotal);
    setCouponResult(result);
    
    if (result.valid && result.coupon) {
      applyCoupon({
        id: result.coupon.id,
        code: result.coupon.code,
        discount: result.discount,
      });
    } else {
      removeCoupon();
    }
    
    setIsValidating(false);
  };

  const handleRemoveCoupon = () => {
    setPromoCode('');
    setCouponResult(null);
    removeCoupon();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyPromo();
    }
  };

  return (
    <div className="bg-[#F9F9F9] p-6 lg:p-8 flex flex-col gap-5">
      <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111]">
        Order Summary
      </h3>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="font-light text-[#666666]">Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-light text-[#666666]">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        {couponResult?.valid && (
          <div className="flex justify-between text-green-600">
            <span className="font-light flex items-center gap-1.5">
              <Tag size={12} />
              Discount
            </span>
            <span className="font-semibold">-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="border-t border-[#E8E8E8] pt-3 flex justify-between">
          <span className="font-semibold text-[#111111] uppercase tracking-wider">Total (Incl. Taxes)</span>
          <span className="font-semibold text-lg text-[#111111]">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Smart Coupon Field */}
      <div className="space-y-2">
        {couponResult?.valid ? (
          /* Applied Coupon Display */
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <Check size={14} className="text-green-600" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-700">{promoCode.toUpperCase()}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-red-500 transition-colors"
              aria-label="Remove coupon"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          /* Coupon Input */
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                if (couponResult) setCouponResult(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Coupon code"
              className="flex-1 px-4 py-2.5 border border-[#E8E8E8] bg-white text-sm font-light focus:outline-none focus:border-[#0080FF] focus:ring-2 focus:ring-[#0080FF]/20 transition-all duration-200 uppercase tracking-wider"
              aria-label="Coupon code"
            />
            <button
              onClick={handleApplyPromo}
              disabled={isValidating || !promoCode.trim()}
              className="px-4 py-2.5 border border-[#0080FF] text-[#0080FF] text-xs font-semibold tracking-wider uppercase hover:bg-[#0080FF] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 min-w-[80px] justify-center"
            >
              {isValidating ? (
                <div className="w-3.5 h-3.5 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          </div>
        )}

        {/* Validation Feedback */}
        {couponResult && (
          <p className={`text-xs font-light ${couponResult.valid ? 'text-green-600' : 'text-red-500'}`}>
            {couponResult.message}
          </p>
        )}
      </div>

      {/* Checkout Button */}
      <Link href="/checkout">
        <Button fullWidth size="lg">
          Proceed to Checkout
        </Button>
      </Link>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <p className="text-xs font-light text-[#666666] text-center">
          Add {formatPrice(999 - subtotal)} more for free shipping
        </p>
      )}
    </div>
  );
}

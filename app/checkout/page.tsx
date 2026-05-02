'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, Package, MapPin } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/context/CartContext';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';

import { useAuthStore } from '@/context/AuthContext';
import { createOrder, Order } from '@/lib/orders';
import { generateInvoicePDF } from '@/lib/invoice';
import { sendOrderConfirmationAction } from '@/app/actions/email';
import { FileText } from 'lucide-react';

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Payment', icon: CreditCard },
  { id: 3, label: 'Confirm', icon: Package },
];

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const { user, profile } = useAuthStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  
  const total = subtotal + shipping - discount;

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      if (profile) {
        const names = profile.full_name?.split(' ') || [];
        setShippingInfo({
          firstName: names[0] || '',
          lastName: names.slice(1).join(' ') || '',
          email: user?.email || '',
          phone: profile.phone || '',
          address: profile.address_line1 || '',
          city: profile.city || '',
          state: profile.state || '',
          pinCode: profile.postal_code || '',
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [profile, user]);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    
    const orderData = {
      user_id: user?.id || null,
      subtotal_amount: subtotal,
      shipping_amount: shipping,
      discount_amount: discount,
      total_amount: total,
      coupon_code: appliedCoupon?.code || null,
      shipping_address: shippingInfo,
      items: items,
    };

    const { order, error } = await createOrder(orderData);

    if (error || !order) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert('Error placing order: ' + errorMessage);
      setIsLoading(false);
    } else {
      // If a coupon was used, increment its usage
      if (appliedCoupon?.id) {
        // Increment logic can be added here
      }

      setOrderNumber(order.id.substring(0, 8).toUpperCase());
      // Attach items to the order object for the PDF generator and email
      const orderItems = items.map(item => ({
        id: '', // Temporary ID for UI
        order_id: order.id,
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image,
      }));
      const fullOrder: Order = { ...order, order_items: orderItems };
      setPlacedOrder(fullOrder);
      
      // Send confirmation email
      try {
        await sendOrderConfirmationAction(fullOrder);
      } catch (e) {
        console.error('Failed to send confirmation email:', e);
      }

      setCurrentStep(3);
      clearCart();
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#0080FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-20">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-[0.15em] uppercase text-[#111111] text-center mb-6 sm:mb-10"
        >
          Checkout
        </motion.h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8 sm:mb-12">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-[#0080FF] text-white'
                      : 'bg-[#F9F9F9] text-[#999999] border border-[#E8E8E8]'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={16} />
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase mt-1.5 sm:mt-2 ${
                    currentStep >= step.id ? 'text-[#0080FF]' : 'text-[#999999]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-10 sm:w-16 lg:w-24 h-[2px] mx-2 sm:mx-3 mb-5 sm:mb-6 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-[#0080FF]' : 'bg-[#E8E8E8]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4 sm:gap-6">
              <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111]">
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input 
                  label="First Name" 
                  placeholder="John" 
                  required 
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                />
                <Input 
                  label="Last Name" 
                  placeholder="Doe" 
                  required 
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                />
              </div>
              <Input 
                label="Email" 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
              />
              <Input 
                label="Phone" 
                type="tel" 
                placeholder="+91 98765 43210" 
                required 
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
              />
              <Input 
                label="Address" 
                placeholder="123 Main Street" 
                required 
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input 
                  label="City" 
                  placeholder="Mumbai" 
                  required 
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
                <Input 
                  label="State" 
                  placeholder="Maharashtra" 
                  required 
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                />
                <Input 
                  label="PIN Code" 
                  placeholder="400001" 
                  required 
                  value={shippingInfo.pinCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, pinCode: e.target.value})}
                />
              </div>

              <div className="flex justify-end mt-2 sm:mt-4">
                <Button size="lg" onClick={() => setCurrentStep(2)} className="w-full sm:w-auto">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4 sm:gap-6">
              <h2 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111]">
                Payment Details
              </h2>

              {/* Order Summary */}
              <div className="bg-[#F9F9F9] p-4 sm:p-6 flex flex-col gap-3">
                <h3 className="text-xs font-semibold tracking-widest uppercase text-[#111111] mb-2">
                  Order Summary
                </h3>
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex justify-between text-sm font-light"
                  >
                    <span className="text-[#666666] truncate pr-4">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-[#E8E8E8] pt-3 mt-2 flex justify-between text-sm">
                  <span className="font-light text-[#666666]">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-light text-[#666666]">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-light">Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t border-[#E8E8E8] pt-3 flex justify-between">
                  <span className="font-semibold text-[#111111] uppercase tracking-wider text-xs">Total (Incl. Taxes)</span>
                  <span className="font-semibold text-lg text-[#111111]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Card Inputs */}
              <Input label="Card Number" placeholder="1234 5678 9012 3456" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" required />
                <Input label="CVV" placeholder="123" type="password" required />
              </div>
              <Input label="Name on Card" placeholder="John Doe" required />

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-2 sm:mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto"
                >
                  ← Back to Shipping
                </Button>
                <Button size="lg" onClick={handlePlaceOrder} disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center py-6 sm:py-10 px-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-r from-[#0080FF] to-[#59A9F8] text-white mb-4 sm:mb-6">
                <Check size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-thin tracking-widest uppercase text-[#111111] mb-3">
                Order Confirmed
              </h2>
              <p className="text-sm font-light text-[#666666] mb-2">
                Thank you for your order! Your order number is:
              </p>
              <p className="text-base sm:text-lg font-semibold text-[#0080FF] mb-6 tracking-widest">
                #GLY-{orderNumber}
              </p>
              <p className="text-sm font-light text-[#666666] mb-6 sm:mb-8 max-w-md">
                We&apos;ve sent a confirmation email with your order details. You can 
                <Link href={`/track?id=#GLY-${orderNumber}`} className="text-[#0080FF] font-semibold hover:underline mx-1">
                  track your order status here
                </Link> 
                anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">Continue Shopping</Button>
                </Link>
                {placedOrder && (
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    onClick={() => generateInvoicePDF(placedOrder)}
                    className="w-full sm:w-auto border-[#E8E8E8] hover:border-[#0080FF] flex items-center gap-2"
                  >
                    <FileText size={16} />
                    Download Invoice
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

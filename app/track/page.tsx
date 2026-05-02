'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, Search as SearchIcon, ArrowRight, MapPin, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fetchOrderById, Order } from '@/lib/orders';
import { formatPrice } from '@/lib/products';
import Link from 'next/link';
import { generateInvoicePDF } from '@/lib/invoice';
import { FileText } from 'lucide-react';

const orderStatuses = ['pending', 'processing', 'shipped', 'delivered'];

const statusDetails = {
  pending: {
    label: 'Order Placed',
    description: 'We have received your order and are preparing it.',
    icon: Clock,
    color: '#0080FF',
  },
  processing: {
    label: 'Processing',
    description: 'Your items are being packed and prepared for shipping.',
    icon: Package,
    color: '#F59E0B',
  },
  shipped: {
    label: 'Shipped',
    description: 'Your order is on the way via our delivery partner.',
    icon: Truck,
    color: '#8B5CF6',
  },
  delivered: {
    label: 'Delivered',
    description: 'Your order has been successfully delivered.',
    icon: CheckCircle2,
    color: '#10B981',
  },
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const handleTrack = useCallback(async (idToTrack = orderId) => {
    if (!idToTrack.trim()) return;

    // Basic format check if it looks like a uuid (can be relaxed)
    if (idToTrack.trim().length < 8) {
      setError('Please enter a valid Order ID.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await fetchOrderById(idToTrack.trim());
      
      if (error || !data) {
        setError("We couldn&apos;t find an order with that ID. Please check and try again.");
        setOrder(null);
      } else {
        setOrder(data as Order);
      }
    } catch (err: unknown) {
      console.error('Track error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      // Support pre-filling order ID from URL params
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setOrderId(id);
        handleTrack(id);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [handleTrack]);

  if (!mounted) return null;

  const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

  return (
    <div className="pt-24 pb-20 min-h-[70vh] bg-[#F9F9F9]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-thin tracking-[0.15em] uppercase text-[#111111] mb-4">
            Track Order
          </h1>
          <p className="text-sm font-light text-[#666666] max-w-md mx-auto">
            Enter your Order ID below to get real-time status updates on your shipment.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 sm:p-8 shadow-sm border border-[#E8E8E8] mb-10"
        >
          <form 
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" />
              <input
                type="text"
                placeholder="Enter your Order ID (e.g., 550e8400-e29b-41d4-a716...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border border-[#E8E8E8] bg-white text-sm font-light focus:outline-none focus:border-[#0080FF] focus:ring-2 focus:ring-[#0080FF]/20 transition-all duration-200"
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={isLoading} className="min-w-[140px]">
              {isLoading ? 'Tracking...' : 'Track'}
            </Button>
          </form>
          
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-500 mt-3 text-center sm:text-left"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Order Details & Tracking */}
        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Status Header */}
              <div className="bg-white p-6 sm:p-8 shadow-sm border border-[#E8E8E8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#999999] mb-1">
                    Order ID
                  </p>
                  <p className="text-sm font-semibold text-[#111111] uppercase tracking-wider">
                    {order.id}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => generateInvoicePDF(order)}
                    className="border-[#E8E8E8] hover:border-[#0080FF] flex items-center gap-2 h-9 text-[10px]"
                  >
                    <FileText size={14} />
                    Invoice
                  </Button>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#999999] mb-1">
                      Placed On
                    </p>
                    <p className="text-sm font-light text-[#111111]">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancelled State */}
              {order.status === 'cancelled' ? (
                <div className="bg-red-50 border border-red-100 p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <X size={32} />
                  </div>
                  <h3 className="text-xl font-thin tracking-widest uppercase text-red-700 mb-2">Order Cancelled</h3>
                  <p className="text-sm font-light text-red-600">This order has been cancelled. If you have any questions, please contact support.</p>
                </div>
              ) : (
                /* Tracking Pipeline */
                <div className="bg-white p-6 sm:p-10 shadow-sm border border-[#E8E8E8]">
                  <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111] mb-10 text-center">
                    Delivery Status
                  </h3>
                  
                  <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-6 sm:top-8 left-4 right-4 sm:left-12 sm:right-12 h-[2px] bg-[#E8E8E8] -z-10 hidden sm:block" />
                    
                    {/* Progress Line */}
                    <div 
                      className="absolute top-6 sm:top-8 left-4 sm:left-12 h-[2px] bg-[#0080FF] transition-all duration-1000 ease-out -z-10 hidden sm:block"
                      style={{ width: `${(Math.max(0, currentStatusIndex) / (orderStatuses.length - 1)) * 100}%`, right: '12%' }} 
                    />

                    {/* Status Nodes */}
                    <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0 relative">
                      {orderStatuses.map((status, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const details = statusDetails[status as keyof typeof statusDetails];
                        const Icon = details.icon;

                        return (
                          <div key={status} className="flex sm:flex-col items-center gap-4 sm:gap-4 relative w-full sm:w-1/4 z-10">
                            {/* Mobile Progress Line segment */}
                            {index < orderStatuses.length - 1 && (
                              <div className={`absolute left-[1.125rem] top-10 w-[2px] h-full -z-10 sm:hidden ${index < currentStatusIndex ? 'bg-[#0080FF]' : 'bg-[#E8E8E8]'}`} />
                            )}
                            
                            {/* Node */}
                            <div 
                              className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0
                                ${isCompleted 
                                  ? 'bg-gradient-to-br from-[#0080FF] to-[#59A9F8] text-white shadow-md' 
                                  : 'bg-white border-2 border-[#E8E8E8] text-[#BBBBBB]'
                                }
                                ${isCurrent ? 'ring-4 ring-[#0080FF]/20 scale-110' : ''}
                              `}
                            >
                              <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                            </div>
                            
                            {/* Text content */}
                            <div className="sm:text-center sm:mt-2">
                              <p className={`text-xs sm:text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors duration-500
                                ${isCurrent ? 'text-[#0080FF]' : isCompleted ? 'text-[#111111]' : 'text-[#999999]'}
                              `}>
                                {details.label}
                              </p>
                              <p className={`text-[11px] font-light text-[#666666] leading-tight max-w-[120px] mx-auto ${isCurrent ? 'block' : 'hidden sm:hidden'}`}>
                                {details.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracking ID Info */}
                  {order.tracking_id && (
                    <div className="mt-20 pt-6 border-t border-[#F0F0F0] text-center bg-[#F9F9F9] p-4">
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#999999] mb-1">Tracking Number</p>
                      <p className="text-sm font-semibold tracking-wider text-[#0080FF]">{order.tracking_id}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Items & Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Items */}
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 shadow-sm border border-[#E8E8E8]">
                  <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111] mb-6">
                    Items in Order
                  </h3>
                  <div className="space-y-6">
                    {order.order_items?.map((item, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-20 h-20 bg-[#F9F9F9] border border-[#E8E8E8] flex-shrink-0 relative">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-tight truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#666666] font-light mt-1">
                            {item.size} • {item.color} • Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold mt-2">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary & Shipping */}
                <div className="flex flex-col gap-6 sm:gap-8">
                  {/* Summary */}
                  <div className="bg-white p-6 sm:p-8 shadow-sm border border-[#E8E8E8]">
                    <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111] mb-5">
                      Payment Summary
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-[#F0F0F0] pb-3">
                        <span className="font-semibold text-[#111111]">Total Paid</span>
                        <span className="font-semibold text-lg text-[#0080FF]">{formatPrice(order.total_amount)}</span>
                      </div>
                      <p className="text-[10px] text-[#999999] font-light">Paid via secure gateway</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white p-6 sm:p-8 shadow-sm border border-[#E8E8E8]">
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin size={16} className="text-[#0080FF]" />
                      <h3 className="text-xs font-semibold tracking-[0.3em] uppercase text-[#111111]">
                        Delivery Address
                      </h3>
                    </div>
                    <div className="text-sm font-light text-[#666666] leading-relaxed">
                      <p className="font-semibold text-[#111111] mb-1">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                      </p>
                      <p>{order.shipping_address?.address}</p>
                      <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pinCode}</p>
                      <p className="mt-2 pt-2 border-t border-[#F0F0F0] text-xs">
                        Phone: {order.shipping_address?.phone}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="text-center pt-4">
                <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#0080FF] hover:text-[#0066CC] transition-colors">
                  Continue Shopping <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

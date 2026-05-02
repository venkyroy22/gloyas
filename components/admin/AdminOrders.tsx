'use client';

import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { fetchAllOrders, updateOrderStatus, updateOrderTrackingId, Order } from '@/lib/orders';
import { Package, Search as SearchIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/products';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Tracking ID edit state
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInputValue, setTrackingInputValue] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    const { data } = await fetchAllOrders();
    setOrders(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as Order['status'] } : o));
    } catch {
      alert('Failed to update order status');
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    try {
      await updateOrderTrackingId(orderId, trackingInputValue);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, tracking_id: trackingInputValue } : o));
      setEditingTrackingId(null);
    } catch {
      alert('Failed to save tracking ID');
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.shipping_address?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.shipping_address?.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#EEEEEE] shadow-sm overflow-hidden mb-12">
      <div className="p-6 border-b border-[#EEEEEE] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Order Management</h2>
          <p className="text-[10px] text-[#666666] font-light mt-1">Manage order lifecycle and tracking info</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            placeholder="Search by ID or Email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F9F9F9] border border-[#EEEEEE] text-xs focus:border-[#0080FF] outline-none transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-widest text-[#999999] border-b border-[#EEEEEE]">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Customer & Value</th>
              <th className="px-6 py-4">Tracking</th>
              <th className="px-6 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <div className="w-6 h-6 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Orders...</p>
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Fragment key={order.id}>
                  <tr className={`border-b border-[#EEEEEE] transition-colors ${expandedOrderId === order.id ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-[#0080FF]" />
                          <span className="font-mono text-xs font-bold text-[#111111]">{order.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] text-[#666666]">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button 
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] flex items-center gap-1 mt-1 w-max"
                        >
                          {expandedOrderId === order.id ? <><ChevronUp size={12}/> Hide Items</> : <><ChevronDown size={12}/> View Items</>}
                        </button>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-[#111111] text-sm">
                          {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                        </span>
                        <span className="text-[11px] text-[#666666]">{order.shipping_address?.email}</span>
                        <span className="text-sm font-bold text-[#111111] mt-1">{formatPrice(order.total_amount)}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingTrackingId === order.id ? (
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={trackingInputValue}
                            onChange={(e) => setTrackingInputValue(e.target.value)}
                            placeholder="Tracking #"
                            className="w-32 px-2 py-1 text-xs border border-[#0080FF] outline-none"
                            autoFocus
                          />
                          <button onClick={() => handleSaveTracking(order.id)} className="text-[10px] font-bold uppercase text-[#0080FF]">Save</button>
                          <button onClick={() => setEditingTrackingId(null)} className="text-[10px] font-bold uppercase text-[#999999]">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {order.tracking_id ? (
                            <span className="text-xs font-mono font-bold text-[#111111] bg-[#EEEEEE] px-2 py-1 w-max">
                              {order.tracking_id}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#999999] italic">No tracking added</span>
                          )}
                          <button 
                            onClick={() => {
                              setEditingTrackingId(order.id);
                              setTrackingInputValue(order.tracking_id || '');
                            }}
                            className="text-[9px] font-bold uppercase tracking-widest text-[#0080FF] w-max mt-1"
                          >
                            {order.tracking_id ? 'Edit' : '+ Add Tracking'}
                          </button>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full outline-none cursor-pointer border ${
                          order.status === 'delivered' ? 'border-[#00C853] text-[#00C853] bg-[#E8F5E9]' :
                          order.status === 'shipped' ? 'border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/10' :
                          order.status === 'processing' ? 'border-[#F59E0B] text-[#F59E0B] bg-[#FFF8E1]' :
                          order.status === 'cancelled' ? 'border-[#D50000] text-[#D50000] bg-[#FFEBEE]' :
                          'border-[#0080FF] text-[#0080FF] bg-[#0080FF]/10'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expandable Order Items Row */}
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <tr className="bg-[#FAFAFA]">
                        <td colSpan={4} className="px-6 py-0 border-b border-[#EEEEEE]">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="py-4 border-t border-[#EEEEEE] overflow-hidden"
                          >
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-3">Order Items & Shipping Address</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Items List */}
                              <div className="space-y-3">
                                {order.order_items?.map((item, i) => (
                                  <div key={i} className="flex gap-3">
                                    <div className="w-12 h-12 bg-white border border-[#EEEEEE] flex-shrink-0 relative">
                                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-[#111111]">{item.name}</p>
                                      <p className="text-[10px] text-[#666666]">
                                        {item.size} • {item.color} • Qty: {item.quantity}
                                      </p>
                                      <p className="text-xs font-semibold mt-0.5">{formatPrice(item.price)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Address */}
                              <div className="bg-white p-4 border border-[#EEEEEE] text-xs text-[#666666] leading-relaxed">
                                <p className="font-semibold text-[#111111] mb-1">
                                  {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                                </p>
                                <p>{order.shipping_address?.address}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pinCode}</p>
                                <p className="mt-2 text-[11px]">Phone: {order.shipping_address?.phone}</p>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Package size={40} className="mx-auto text-[#EEEEEE] mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#BBBBBB]">No orders found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

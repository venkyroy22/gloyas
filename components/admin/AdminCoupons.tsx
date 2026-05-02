'use client';

import { useState, useEffect, FormEvent } from 'react';
import { fetchAllCoupons, createCoupon, deleteCoupon, toggleCouponActive, Coupon } from '@/lib/coupons';
import { Tag, Plus, Trash2, Clock } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const loadCoupons = async () => {
    setIsLoading(true);
    const data = await fetchAllCoupons();
    setCoupons(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCoupons();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!code || !value) return;

    try {
      await createCoupon({
        code,
        type,
        value: parseFloat(value),
        min_order_amount: parseFloat(minOrder) || 0,
        max_uses: maxUses ? parseInt(maxUses) : null,
        is_active: true,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });

      // Reset form
      setCode('');
      setValue('');
      setMinOrder('');
      setMaxUses('');
      setExpiresAt('');
      setIsCreating(false);
      loadCoupons();
    } catch (error: unknown) {
      console.error('Coupon creation failed:', error);
      const message = error instanceof Error ? error.message : 'Make sure the code is unique.';
      alert(`Failed to create coupon: ${message}`);
    }
  };

  const handleToggle = async (id: string, currentActive: boolean) => {
    try {
      await toggleCouponActive(id, !currentActive);
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !currentActive } : c));
    } catch {
      alert('Failed to update coupon.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch {
      alert('Failed to delete coupon.');
    }
  };

  return (
    <div className="bg-white border border-[#EEEEEE] shadow-sm overflow-hidden mb-12">
      <div className="p-6 border-b border-[#EEEEEE] flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Coupon Engine</h2>
          <p className="text-[10px] text-[#666666] font-light mt-1">Manage discount codes and promotions</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#0066CC] transition-all"
        >
          {isCreating ? 'Cancel' : <><Plus size={14} /> New Coupon</>}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-6 border-b border-[#EEEEEE] bg-[#FAFAFA] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Coupon Code</label>
            <input
              required
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SUMMER20"
              className="w-full p-3 border border-[#E8E8E8] text-sm uppercase font-bold text-[#111111] focus:border-[#0080FF] outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Type & Value</label>
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}
                className="p-3 border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none"
              >
                <option value="percentage">% Off</option>
                <option value="flat">₹ Off</option>
              </select>
              <input
                required
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="10"
                className="w-full p-3 border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Min. Order Amount (₹)</label>
            <input
              type="number"
              value={minOrder}
              onChange={e => setMinOrder(e.target.value)}
              placeholder="e.g. 1000 (Optional)"
              className="w-full p-3 border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Usage Limit</label>
            <input
              type="number"
              value={maxUses}
              onChange={e => setMaxUses(e.target.value)}
              placeholder="e.g. 100 (Optional)"
              className="w-full p-3 border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Expiry Date</label>
            <input
              type="date"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              className="w-full p-3 border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none"
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="w-full py-3 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#006bdd] transition-all shadow-lg shadow-blue-500/10">
              Save Coupon
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-widest text-[#999999] border-b border-[#EEEEEE]">
              <th className="px-6 py-4">Code & Type</th>
              <th className="px-6 py-4">Conditions</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <div className="w-6 h-6 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Coupons...</p>
                </td>
              </tr>
            ) : coupons.length > 0 ? (
              coupons.map((coupon) => {
                const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                const isMaxedOut = coupon.max_uses !== null && coupon.used_count >= coupon.max_uses;
                const statusBadge = isExpired ? 'Expired' : isMaxedOut ? 'Limit Reached' : coupon.is_active ? 'Active' : 'Paused';

                return (
                  <tr key={coupon.id} className={`border-b border-[#EEEEEE] transition-colors ${!coupon.is_active || isExpired ? 'bg-[#FAFAFA] opacity-75' : 'hover:bg-[#FAFAFA]'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F0F7FF] text-[#0080FF]">
                          <Tag size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-[#111111] text-sm uppercase tracking-wider">{coupon.code}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF]">
                            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-[11px] text-[#666666] flex flex-col gap-1">
                        {coupon.min_order_amount > 0 && <span>Min Order: ₹{coupon.min_order_amount}</span>}
                        {coupon.expires_at && <span className="flex items-center gap-1"><Clock size={10}/> Exp: {new Date(coupon.expires_at).toLocaleDateString()}</span>}
                        {!coupon.min_order_amount && !coupon.expires_at && <span>No restrictions</span>}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#111111]">{coupon.used_count} <span className="text-[10px] font-normal text-[#999999]">used</span></span>
                        {coupon.max_uses && <span className="text-[10px] text-[#666666]">of {coupon.max_uses} limit</span>}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                          statusBadge === 'Active' ? 'text-[#00C853] bg-[#E8F5E9]' :
                          statusBadge === 'Paused' ? 'text-[#F59E0B] bg-[#FFF8E1]' :
                          'text-[#D50000] bg-[#FFEBEE]'
                        }`}>
                          {statusBadge}
                        </span>
                        <div className="w-px h-6 bg-[#EEEEEE] mx-1" />
                        <button 
                          onClick={() => handleToggle(coupon.id, coupon.is_active)}
                          className="text-[#666666] hover:text-[#0080FF] transition-colors text-[10px] font-bold uppercase"
                        >
                          {coupon.is_active ? 'Pause' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Tag size={40} className="mx-auto text-[#EEEEEE] mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#BBBBBB]">No coupons configured</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

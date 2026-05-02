'use client';

import { useAuthStore, UserProfile } from '@/context/AuthContext';
import Image from 'next/image';
import { useCartStore } from '@/context/CartContext';
import { useWishlistStore } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Package, Settings, Heart, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/products';
import { Order } from '@/lib/orders';
import Link from 'next/link';

type ProfileView = 'details' | 'address' | 'orders' | 'wishlist';

export default function ProfilePage() {
  const { user, profile, isAuthenticated, logout, fetchProfile } = useAuthStore();
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  
  const router = useRouter();
  const [activeView, setActiveView] = useState<ProfileView>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile) {
      const timer = setTimeout(() => setFormData(profile), 0);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  useEffect(() => {
    if (activeView === 'orders' && user) {
      const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!error) setOrders(data || []);
        setIsLoading(false);
      };
      fetchOrders();
    }
  }, [activeView, user]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (tabsRef.current) {
      const activeTab = tabsRef.current.querySelector('[data-active="true"]');
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeView]);

  if (!isAuthenticated || !user) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      alert(error.message);
    } else {
      await fetchProfile();
      setActiveView('details');
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'details' as ProfileView, label: 'Personal Info', icon: User },
    { id: 'address' as ProfileView, label: 'Address', icon: MapPin },
    { id: 'orders' as ProfileView, label: 'Orders', icon: Package },
    { id: 'wishlist' as ProfileView, label: 'Wishlist', icon: Heart },
  ];

  // For Admin users, add a direct link to the Admin Dashboard
  const adminTab = profile?.role === 'admin' ? { id: 'admin', label: 'Admin', icon: Settings, href: '/admin' } : null;

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 px-4 bg-[#F8F8F8]">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#EEEEEE] overflow-hidden"
        >
          {/* Top Header Section */}
          <div className="p-5 sm:p-8 md:p-12 border-b border-[#EEEEEE] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#111111] mb-1 sm:mb-2 uppercase">Account</h1>
              <p className="text-[#666666] text-xs sm:text-sm">Manage your orders and personal information</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="px-5 sm:px-6 py-2.5 sm:py-3 border border-[#EEEEEE] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#0080FF] hover:border-[#0080FF] hover:text-white transition-all duration-300"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Mobile Horizontal Tabs */}
            <div 
              ref={tabsRef}
              className="flex md:hidden overflow-x-auto hide-scrollbar border-b border-[#EEEEEE] bg-[#FAFAFA]"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-active={activeView === tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center justify-center gap-2 px-6 sm:px-5 py-4 text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 border-b-2 flex-1 sm:flex-shrink-0 ${
                    activeView === tab.id 
                      ? 'text-[#0080FF] border-[#0080FF] bg-white' 
                      : 'text-[#999999] border-transparent'
                  }`}
                >
                  <tab.icon size={16} strokeWidth={activeView === tab.id ? 2 : 1.5} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
              {adminTab && (
                <Link
                  href={adminTab.href}
                  className="flex items-center justify-center gap-2 px-6 sm:px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-[#0080FF] border-b-2 border-transparent flex-1 sm:flex-shrink-0 bg-blue-50/50"
                >
                  <adminTab.icon size={16} />
                  <span>{adminTab.label}</span>
                </Link>
              )}
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className="w-full md:w-64 border-r border-[#EEEEEE] bg-[#FAFAFA] hidden md:block">
              <nav className="flex flex-col py-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={`flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest transition-all duration-300 border-l-2 ${
                      activeView === tab.id 
                        ? 'bg-white text-[#0080FF] border-[#0080FF]' 
                        : 'text-[#999999] border-transparent hover:text-[#111111] hover:bg-white'
                    }`}
                  >
                    <tab.icon size={16} strokeWidth={activeView === tab.id ? 2 : 1.5} />
                    {tab.label}
                  </button>
                ))}
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-8 py-4 text-xs font-bold uppercase tracking-widest text-[#0080FF] hover:bg-white transition-all border-l-2 border-transparent mt-4"
                  >
                    <Settings size={16} />
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 sm:p-8 md:p-12 min-h-[400px] sm:min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* PERSONAL INFO VIEW */}
                  {activeView === 'details' && (
                    <section className="space-y-6 sm:space-y-8">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Profile Details</h2>
                        <button 
                          onClick={() => setActiveView('address')} 
                          className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline"
                        >
                          Update Info
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Full Name</p>
                          <p className="text-sm text-[#111111] font-light">{profile?.full_name || user.name}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Email Address</p>
                          <p className="text-sm text-[#111111] font-light break-all">{user.email}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Phone Number</p>
                          <p className="text-sm text-[#111111] font-light">{profile?.phone || 'Not provided'}</p>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* SHIPPING ADDRESS FORM VIEW */}
                  {activeView === 'address' && (
                    <form onSubmit={handleUpdateProfile} className="space-y-5 sm:space-y-6 max-w-2xl">
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111] mb-4 sm:mb-8">Shipping Information</h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Full Name</label>
                          <input 
                            type="text" 
                            className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={formData.full_name || ''}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Phone</label>
                          <input 
                            type="text" 
                            className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Address Line 1</label>
                        <input 
                          type="text" 
                          className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={formData.address_line1 || ''}
                          onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">City</label>
                          <input 
                            type="text" 
                            className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={formData.city || ''}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">State</label>
                          <input 
                            type="text" 
                            className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={formData.state || ''}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">PIN Code</label>
                          <input 
                            type="text" 
                            className="w-full p-3.5 sm:p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={formData.postal_code || ''}
                            onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto px-10 py-3.5 sm:py-4 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#006bdd] transition-all disabled:opacity-50"
                        >
                          {isLoading ? 'Saving...' : 'Save Address'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveView('details')}
                          className="w-full sm:w-auto px-10 py-3.5 sm:py-4 border border-[#EEEEEE] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#FAFAFA] transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ORDER HISTORY VIEW */}
                  {activeView === 'orders' && (
                    <section className="space-y-6">
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111] mb-4 sm:mb-8">Your Orders</h2>
                      
                      {isLoading ? (
                        <div className="py-20 flex justify-center">
                          <div className="w-8 h-8 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin" />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="border border-[#EEEEEE] p-4 sm:p-6 hover:border-[#0080FF] transition-colors group">
                              <div className="flex flex-wrap justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1">Order</p>
                                  <p className="text-xs sm:text-sm font-semibold">
                                    #GLY-{order.id.substring(0, 8).toUpperCase()}
                                  </p>
                                </div>
                                <div className="hidden sm:block">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1">Date</p>
                                  <p className="text-sm">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1">Total</p>
                                  <p className="text-xs sm:text-sm font-bold text-[#0080FF]">{formatPrice(order.total_amount)}</p>
                                </div>
                                <div className="px-2.5 py-1 bg-[#F9F9F9] border border-[#EEEEEE] text-[8px] font-bold uppercase tracking-widest">
                                  {order.status}
                                </div>
                              </div>
                              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                {order.order_items?.map((item) => (
                                  <div key={item.id} className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F9F9F9] border border-[#EEEEEE] flex-shrink-0 relative">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 sm:py-20 border border-dashed border-[#DDDDDD] bg-[#FAFAFA]">
                          <Package size={36} className="mx-auto text-[#CCCCCC] mb-4" strokeWidth={1} />
                          <p className="text-sm text-[#999999] font-light">You haven&apos;t placed any orders yet.</p>
                          <Link href="/products" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline">
                            Explore Collections
                          </Link>
                        </div>
                      )}
                    </section>
                  )}

                  {/* WISHLIST VIEW */}
                  {activeView === 'wishlist' && (
                    <section>
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111] mb-4 sm:mb-8">My Wishlist ({wishlistItems.length})</h2>
                      
                      {wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          {wishlistItems.map((item) => (
                            <div key={item.id} className="flex gap-4 sm:gap-6 p-3 sm:p-4 border border-[#EEEEEE] group relative">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F9F9F9] overflow-hidden flex-shrink-0 relative">
                                <Image src={item.image} alt={item.name} fill className="group-hover:scale-110 transition-transform duration-500 object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col justify-between min-w-0">
                                <div>
                                  <h3 className="text-xs sm:text-sm font-semibold text-[#111111] truncate">{item.name}</h3>
                                  <p className="text-xs text-[#999999] font-medium">{formatPrice(item.price)}</p>
                                </div>
                                <div className="flex gap-3 sm:gap-4">
                                  <button 
                                    onClick={() => {
                                      addItemToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        originalPrice: item.originalPrice,
                                        image: item.image,
                                        size: 'Adjustable',
                                        color: 'Default',
                                        quantity: 1,
                                      });
                                      removeFromWishlist(item.id);
                                    }}
                                    className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline"
                                  >
                                    Move to Cart
                                  </button>
                                  <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:underline"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 sm:py-20 border border-dashed border-[#DDDDDD] bg-[#FAFAFA]">
                          <Heart size={36} className="mx-auto text-[#CCCCCC] mb-4" strokeWidth={1} />
                          <p className="text-sm text-[#999999] font-light">Your wishlist is empty.</p>
                          <Link href="/products" className="inline-block mt-4 text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline">
                            Add some favorites
                          </Link>
                        </div>
                      )}
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

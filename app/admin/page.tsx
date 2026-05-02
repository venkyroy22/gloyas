'use client';

import Image from 'next/image';

import { useAuthStore } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Package, Users, DollarSign, TrendingUp, X, Check, Upload, Trash2, Mail, Calendar, Bell } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { uploadToStreamlet, deleteFromStreamlet } from '@/lib/streamlet';
import AdminReviews from '@/components/admin/AdminReviews';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminOrders from '@/components/admin/AdminOrders';

interface AdminProduct {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  price: number;
  stock_count: number;
  images: string[];
  description: string | null;
  colors: { name: string; hex: string }[];
  sizes: string[];
  product_story: string | null;
  created_at: string;
}

interface AdminSubscriber {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const { profile, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<'products' | 'newsletter' | 'orders' | 'reviews' | 'coupons'>('products');
  const [bulkPriceData, setBulkPriceData] = useState({ category: 'all', percentage: '', type: 'increase' as 'increase' | 'decrease' });
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'baseball-caps',
    subcategory: '',
    price: '',
    stock_count: '0',
    description: '',
    sizes: 'One Size Fits All',
    color_name: 'Midnight Black',
    color_hex: '#000000',
    product_story: '',
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [inventory, setInventory] = useState<AdminProduct[]>([]);
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>([]);
  const [isInventoryLoading, setIsInventoryLoading] = useState(true);
  const [isSubscribersLoading, setIsSubscribersLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchInventory();
    fetchSubscribers();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAddModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen]);

  const fetchInventory = async () => {
    setIsInventoryLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      const mappedData = (data as any[]).map(p => ({
        ...p,
        images: p.images || [],
        colors: p.colors || [],
        sizes: p.sizes || [],
        subcategory: p.subcategory || '',
        description: p.description || '',
        product_story: p.product_story || ''
      }));
      setInventory(mappedData);
    }
    setIsInventoryLoading(false);
  };

  const fetchSubscribers = async () => {
    setIsSubscribersLoading(true);
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSubscribers(data);
    setIsSubscribersLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    // 1. Get product images first
    const product = inventory.find(p => p.id === id);
    const imagesToDelete = product?.images || [];

    // 2. Delete product from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      // 3. Clean up images from Streamlet (async, don't wait for it)
      imagesToDelete.forEach(url => {
        if (url.includes('streamlet.in')) {
          deleteFromStreamlet(url);
        }
      });
      
      fetchInventory();
      alert('Product and associated images deleted successfully.');
    }
  };

  const handleEditClick = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || '',
      price: product.price.toString(),
      stock_count: (product.stock_count || 0).toString(),
      description: product.description || '',
      sizes: product.sizes ? product.sizes.join(', ') : 'One Size Fits All',
      color_name: product.colors?.[0]?.name || 'Midnight Black',
      color_hex: product.colors?.[0]?.hex || '#000000',
      product_story: product.product_story || '',
    });
    setPreviews(product.images || []);
    setIsAddModalOpen(true);
  };

  useEffect(() => {
    if (mounted && !isLoading && (!isAuthenticated || profile?.role !== 'admin')) {
      router.push('/');
    }
  }, [mounted, isLoading, isAuthenticated, profile, router]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of selectedFiles) {
      const cdnUrl = await uploadToStreamlet(file);
      urls.push(cdnUrl);
    }
    
    return urls;
  };

  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0 && !editingProductId && previews.length === 0) {
      alert('Please upload at least one image for a new product.');
      return;
    }

    setIsActionLoading(true);

    try {
      // 1. Upload new files if any
      const newImageUrls = await uploadImages();
      
      // 2. Prepare the images array (keep existing ones if editing)
      let finalImages = previews.filter(url => url.startsWith('http')); // Keep already uploaded URLs
      finalImages = [...finalImages, ...newImageUrls]; // Add newly uploaded URLs

      if (finalImages.length === 0) {
        throw new Error('No images uploaded. Please ensure you have selected files and your API keys are correct.');
      }

      const productData = {
        name: newProduct.name,
        category: newProduct.category,
        subcategory: newProduct.subcategory,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        images: finalImages,
        colors: [{ name: newProduct.color_name, hex: newProduct.color_hex }],
        sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
        is_new: true,
        stock_count: parseInt(newProduct.stock_count) || 0,
        rating: 5,
        review_count: 0,
        product_story: newProduct.product_story
      };

      if (editingProductId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProductId);
          
        if (error) throw error;
        alert('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('Product published successfully!');
      }

      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        category: 'baseball-caps',
        subcategory: '',
        price: '',
        stock_count: '0',
        description: '',
        sizes: 'One Size Fits All',
        color_name: 'Midnight Black',
        color_hex: '#000000',
        product_story: '',
      });
      setEditingProductId(null);
      setSelectedFiles([]);
      setPreviews([]);
      fetchInventory();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Submission error:', error);
      alert(`Error: ${message}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9]">
        <div className="w-10 h-10 border-4 border-[#0080FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || profile?.role !== 'admin') return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-[#111111] uppercase">Admin Dashboard</h1>
            <p className="text-[#666666] text-sm mt-1">Welcome back, Administrator</p>
          </div>
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-3 border border-[#E8E8E8] transition-all relative ${showNotifications ? 'bg-white border-[#0080FF]' : 'hover:bg-white'}`}
                >
                  <Bell size={20} className={inventory.some(p => p.price > 2000) ? 'text-orange-500' : 'text-[#999999]'} />
                  {inventory.some(p => p.price > 2000) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white border border-[#EEEEEE] shadow-xl z-50 p-4"
                    >
                      <div className="flex items-center justify-between mb-4 border-b pb-2">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#111111]">Inventory Alerts</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-[#999999] hover:text-[#111111] transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {inventory.filter(p => p.price > 2000).length > 0 ? (
                          inventory.filter(p => p.price > 2000).map(p => (
                            <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-[#F9F9F9] transition-colors border-l-2 border-orange-400">
                              <div className="w-8 h-8 bg-[#F5F5F5] overflow-hidden relative">
                                {p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" />}
                              </div>
                              <div className="flex-1">
                                <p className="text-[10px] font-bold text-[#111111] uppercase truncate">{p.name}</p>
                                <p className="text-[9px] text-orange-600 font-bold uppercase">Low Stock (5 Units)</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[10px] text-[#999999] text-center py-4 uppercase tracking-widest">All stock levels normal</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={() => setIsBulkPriceModalOpen(true)}
                className="px-6 py-3 border border-[#E8E8E8] text-[#111111] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:border-[#0080FF] transition-all"
              >
                <TrendingUp size={16} className="text-[#0080FF]" />
                Bulk Pricing
              </button>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#006bdd] transition-all shadow-lg shadow-blue-500/10"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Sales', value: '₹0', icon: DollarSign, trend: '0%' },
            { label: 'Products', value: inventory.length.toString(), icon: Package, trend: '+New' },
            { label: 'Subscribers', value: subscribers.length.toString(), icon: Users, trend: 'Newsletter' },
            { label: 'Revenue', value: '₹0', icon: TrendingUp, trend: '0%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 border border-[#EEEEEE] shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#F9F9F9] text-[#0080FF]">
                  <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 uppercase tracking-widest">
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#999999] mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-[#111111]">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-6 sm:gap-8 mb-8 border-b border-[#EEEEEE] overflow-x-auto hide-scrollbar whitespace-nowrap">
          {[
            { id: 'products', label: 'Inventory' },
            { id: 'orders', label: 'Orders' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'coupons', label: 'Coupons' },
            { id: 'newsletter', label: 'Subscribers' },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as 'products' | 'newsletter' | 'orders' | 'reviews' | 'coupons')}
              className={`pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                currentTab === tab.id ? 'text-[#0080FF]' : 'text-[#999999] hover:text-[#111111]'
              }`}
            >
              {tab.label}
              {currentTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0080FF]" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {currentTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {/* Product Inventory Table */}
              <div className="bg-white border border-[#EEEEEE] shadow-sm overflow-hidden mb-12">
                <div className="p-6 border-b border-[#EEEEEE] flex justify-between items-center">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Product Inventory</h2>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                    Total Items: {inventory.length}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-widest text-[#999999] border-b border-[#EEEEEE]">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {isInventoryLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center">
                            <div className="w-6 h-6 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Inventory...</p>
                          </td>
                        </tr>
                      ) : inventory.length > 0 ? (
                        inventory.map((product) => (
                          <tr key={product.id} className="border-b border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F9F9F9] border border-[#EEEEEE] overflow-hidden relative">
                                  {product.images?.[0] && <Image src={product.images[0]} alt="" fill className="object-cover" />}
                                </div>
                                <div>
                                  <p className="font-bold text-[#111111] uppercase text-[11px] tracking-tight">{product.name}</p>
                                  <p className="text-[9px] text-[#999999] uppercase tracking-widest">{product.subcategory || 'General'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#666666] bg-[#F5F5F5] px-2 py-1">
                                {product.category.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-[#111111]">₹{product.price}</td>
                            <td className="px-6 py-4">
                              {product.stock_count > 5 ? (
                                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-green-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                  In Stock
                                </span>
                              ) : product.stock_count > 0 ? (
                                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-orange-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                                  Low ({product.stock_count})
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-red-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                  Out of Stock
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditClick(product)}
                                className="p-2 text-[#666666] hover:text-[#0080FF] hover:bg-blue-50 transition-all"
                              >
                                {/* We'll reuse Check or Plus icon conceptually since Edit icon is not imported, wait let's just use Text */}
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-[#666666] hover:text-red-500 hover:bg-red-50 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <Package size={40} className="mx-auto text-[#EEEEEE] mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-[#BBBBBB]">No products found in inventory</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <AdminOrders />
            </motion.div>
          )}

          {currentTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <AdminReviews />
            </motion.div>
          )}

          {currentTab === 'coupons' && (
            <motion.div key="coupons" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <AdminCoupons />
            </motion.div>
          )}

          {currentTab === 'newsletter' && (
            <motion.div
              key="newsletter"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="bg-white border border-[#EEEEEE] shadow-sm overflow-hidden mb-12">
                <div className="p-6 border-b border-[#EEEEEE] flex justify-between items-center">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Newsletter Subscribers</h2>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                    Total: {subscribers.length}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-widest text-[#999999] border-b border-[#EEEEEE]">
                        <th className="px-6 py-4">Subscriber Email</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Date Joined</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {isSubscribersLoading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center">
                            <div className="w-6 h-6 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Subscribers...</p>
                          </td>
                        </tr>
                      ) : subscribers.length > 0 ? (
                        subscribers.map((sub) => (
                          <tr key={sub.id} className="border-b border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F0F7FF] text-[#0080FF]">
                                  <Mail size={14} />
                                </div>
                                <span className="font-medium text-[#111111]">{sub.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                                {sub.source?.replace('_', ' ') || 'Website'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#666666]">
                              <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-[#BBBBBB]" />
                                {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#00C853] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center">
                            <Users size={40} className="mx-auto text-[#EEEEEE] mb-4" />
                            <p className="text-xs font-bold uppercase tracking-widest text-[#BBBBBB]">No subscribers yet</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Management Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-2xl bg-white shadow-2xl overflow-hidden my-auto"
                >
                  <div className="flex items-center justify-between p-6 border-b border-[#EEEEEE]">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111111]">Add New Product</h2>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-[#999999] hover:text-[#111111]">
                      <X size={20} />
                    </button>
                  </div>

                  <form 
                    onSubmit={handleAddProduct} 
                    className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar overscroll-contain"
                    data-lenis-prevent
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Product Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Essential Curved Brim"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Price (₹)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="1499"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Category</label>
                        <select 
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all appearance-none"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option value="baseball-caps">Baseball Caps</option>
                          <option value="beanies">Beanies</option>
                          <option value="snapback-caps">Snapbacks</option>
                          <option value="dad-caps">Dad Caps</option>
                          <option value="trucker-caps">Trucker Caps</option>
                        </select>
                      </div>

                      {/* Subcategory */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Subcategory</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Winter Wear"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.subcategory}
                          onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                        />
                      </div>
                      
                      {/* Stock Count */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Stock Units</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 50"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.stock_count}
                          onChange={(e) => setNewProduct({...newProduct, stock_count: e.target.value})}
                        />
                      </div>
                      
                      {/* Sizes */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Sizes (Comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. One Size Fits All, S, M, L"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Color Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Color Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Midnight Black"
                          className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                          value={newProduct.color_name}
                          onChange={(e) => setNewProduct({...newProduct, color_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Color Hex</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            className="w-12 h-12 p-1 bg-[#FAFAFA] border border-[#EEEEEE] cursor-pointer"
                            value={newProduct.color_hex}
                            onChange={(e) => setNewProduct({...newProduct, color_hex: e.target.value})}
                          />
                          <input 
                            type="text" 
                            placeholder="#000000"
                            className="flex-1 p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                            value={newProduct.color_hex}
                            onChange={(e) => setNewProduct({...newProduct, color_hex: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Product Images</label>
                      <div className="grid grid-cols-4 gap-4">
                        {previews.map((preview, i) => (
                          <div key={i} className="relative aspect-square bg-[#F9F9F9] border border-[#EEEEEE] group overflow-hidden">
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <label className="aspect-square bg-[#FAFAFA] border border-dashed border-[#CCCCCC] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F7FF] hover:border-[#0080FF] transition-all">
                          <Upload size={20} className="text-[#999999] mb-2" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#999999]">Upload</span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Write something about the product..."
                        className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>

                    {/* Product Story */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Product Story</label>
                      <textarea 
                        rows={6}
                        placeholder="Tell the story behind this piece..."
                        className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm focus:border-[#0080FF] focus:bg-white outline-none transition-all font-light leading-relaxed"
                        value={newProduct.product_story}
                        onChange={(e) => setNewProduct({...newProduct, product_story: e.target.value})}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#0066CC] transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check size={16} />
                          {editingProductId ? 'Update Product' : 'Publish Product'}
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bulk Pricing Modal */}
        <AnimatePresence>
          {isBulkPriceModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsBulkPriceModalOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white p-8 shadow-2xl border border-[#EEEEEE]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111111]">Bulk Price Update</h2>
                  <button onClick={() => setIsBulkPriceModalOpen(false)} className="text-[#999999] hover:text-[#111111]">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Select Category</label>
                    <select 
                      className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm outline-none focus:border-[#0080FF] appearance-none"
                      value={bulkPriceData.category}
                      onChange={(e) => setBulkPriceData({...bulkPriceData, category: e.target.value})}
                    >
                      <option value="all">All Categories</option>
                      <option value="baseball-caps">Baseball Caps</option>
                      <option value="snapback-caps">Snapbacks</option>
                      <option value="beanies">Beanies</option>
                      <option value="trucker-caps">Trucker Caps</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Update Type</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setBulkPriceData({...bulkPriceData, type: 'increase'})}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${bulkPriceData.type === 'increase' ? 'bg-[#0080FF] text-white border-[#0080FF]' : 'bg-white text-[#999999] border-[#EEEEEE]'}`}
                      >
                        Increase
                      </button>
                      <button 
                        onClick={() => setBulkPriceData({...bulkPriceData, type: 'decrease'})}
                        className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all ${bulkPriceData.type === 'decrease' ? 'bg-[#0080FF] text-white border-[#0080FF]' : 'bg-white text-[#999999] border-[#EEEEEE]'}`}
                      >
                        Decrease
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Percentage (%)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10"
                      className="w-full p-4 bg-[#FAFAFA] border border-[#EEEEEE] text-sm outline-none focus:border-[#0080FF]"
                      value={bulkPriceData.percentage}
                      onChange={(e) => setBulkPriceData({...bulkPriceData, percentage: e.target.value})}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 border border-blue-100 flex gap-3">
                    <TrendingUp size={16} className="text-[#0080FF] flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-blue-700 leading-relaxed uppercase tracking-wider">
                      This will {bulkPriceData.type} prices by {bulkPriceData.percentage || '0'}% for all products in the selected category.
                    </p>
                  </div>

                  <button 
                    onClick={async () => {
                      if (!bulkPriceData.percentage) return alert('Enter a percentage');
                      setIsActionLoading(true);
                      try {
                        const multiplier = bulkPriceData.type === 'increase' 
                          ? 1 + (parseFloat(bulkPriceData.percentage) / 100)
                          : 1 - (parseFloat(bulkPriceData.percentage) / 100);

                        // Fetch products to update
                        let query = supabase.from('products').select('id, price');
                        if (bulkPriceData.category !== 'all') {
                          query = query.eq('category', bulkPriceData.category);
                        }
                        
                        const { data: productsToUpdate, error: fetchError } = await query;
                        if (fetchError) throw fetchError;
                        
                        if (productsToUpdate && productsToUpdate.length > 0) {
                          // Update each product
                          const updates = productsToUpdate.map(p => {
                            const newPrice = Math.round(Number(p.price) * multiplier);
                            return supabase.from('products').update({ price: newPrice }).eq('id', p.id);
                          });
                          
                          await Promise.all(updates);
                          alert(`Successfully updated prices for ${productsToUpdate.length} products.`);
                        } else {
                          alert('No products found to update.');
                        }

                        setIsBulkPriceModalOpen(false);
                        fetchInventory();
                      } finally {
                        setIsActionLoading(false);
                      }
                    }}
                    disabled={isActionLoading}
                    className="w-full py-4 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#0066CC] transition-all disabled:opacity-50"
                  >
                    Apply Bulk Update
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

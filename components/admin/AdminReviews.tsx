'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { fetchAllReviews, updateReviewStatus, deleteReview, Review } from '@/lib/reviews';
import { Star, CheckCircle, XCircle, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteFromStreamlet } from '@/lib/streamlet';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchAllReviews(statusFilter === 'all' ? undefined : statusFilter);
    setReviews(data);
    setIsLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadReviews]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateReviewStatus(id, status);
      // Remove from current list if filtering
      if (statusFilter !== 'all') {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this review?')) return;
    
    // 1. Get images first
    const review = reviews.find(r => r.id === id);
    const imagesToDelete = review?.images || [];

    try {
      // 2. Delete from Supabase
      await deleteReview(id);
      
      // 3. Clean up from Streamlet (async)
      imagesToDelete.forEach(url => {
        if (url.includes('streamlet.in')) {
          deleteFromStreamlet(url);
        }
      });

      setReviews(prev => prev.filter(r => r.id !== id));
    } catch {
      alert('Failed to delete review.');
    }
  };

  return (
    <div className="bg-white border border-[#EEEEEE] shadow-sm overflow-hidden mb-12">
      <div className="p-6 border-b border-[#EEEEEE] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111111]">Review Moderation</h2>
          <p className="text-[10px] text-[#666666] font-light mt-1">Approve or reject customer product reviews</p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter as 'all' | 'pending' | 'approved' | 'rejected')}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                statusFilter === filter 
                  ? 'bg-[#111111] text-white' 
                  : 'bg-[#F9F9F9] text-[#666666] hover:bg-[#EEEEEE]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-widest text-[#999999] border-b border-[#EEEEEE]">
              <th className="px-6 py-4">Review Details</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center">
                  <div className="w-6 h-6 border-2 border-[#0080FF]/30 border-t-[#0080FF] rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Reviews...</p>
                </td>
              </tr>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.id} className="border-b border-[#EEEEEE] hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#111111] text-sm">{review.user_name}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              fill={i < review.rating ? '#0080FF' : 'transparent'}
                              color={i < review.rating ? '#0080FF' : '#E8E8E8'}
                            />
                          ))}
                        </div>
                        {review.is_verified_purchase && (
                          <span className="text-[8px] text-green-600 bg-green-50 px-1 py-0.5 font-bold uppercase tracking-widest ml-2">Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-[#666666] font-light leading-relaxed">
                        {review.content}
                      </p>
                      
                      {/* Photos */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {review.images.map((img, i) => (
                            <button 
                              key={i} 
                              onClick={() => setLightboxImage(img)}
                              className="w-10 h-10 border border-[#EEEEEE] bg-white overflow-hidden hover:opacity-80 transition-opacity relative group"
                            >
                              <Image src={img} alt="Review" fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <ImageIcon size={12} className="text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      <span className="text-[9px] text-[#999999]">
                        {new Date(review.created_at).toLocaleString()}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-top pt-5">
                    <div className="flex items-center gap-1.5 group">
                      <span className="text-[10px] font-mono text-[#666666]">{review.product_id.substring(0, 8)}...</span>
                      <a href={`/products/${review.product_id}`} target="_blank" rel="noreferrer" className="text-[#0080FF] opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-top pt-5 text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${
                      review.status === 'approved' ? 'text-[#00C853] bg-[#E8F5E9]' :
                      review.status === 'rejected' ? 'text-[#D50000] bg-[#FFEBEE]' :
                      'text-[#F59E0B] bg-[#FFF8E1]'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 align-top pt-5 text-right">
                    <div className="flex justify-end gap-2">
                      {review.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusChange(review.id, 'approved')}
                          className="p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusChange(review.id, 'rejected')}
                          className="p-1.5 text-red-500 hover:bg-red-50 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <div className="w-px h-6 bg-[#EEEEEE] mx-1" />
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 text-[#999999] hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center">
                  <Star size={40} className="mx-auto text-[#EEEEEE] mb-4" strokeWidth={1} />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#BBBBBB]">No reviews found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
              <Image
                src={lightboxImage}
                alt="Review Full"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

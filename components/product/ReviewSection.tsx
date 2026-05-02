'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, Send, User, Edit2, Trash2, X, Camera, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Review, fetchProductReviews, submitReview, updateReview, deleteReview, checkVerifiedPurchase } from '@/lib/reviews';
import { uploadToStreamlet, deleteFromStreamlet } from '@/lib/streamlet';
import { useAuthStore } from '@/context/AuthContext';

interface ReviewSectionProps {
  productId: string;
  onReviewUpdate?: () => void;
}

export default function ReviewSection({ productId, onReviewUpdate }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile, isAuthenticated } = useAuthStore();

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Photo upload state
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verified purchase state
  const [isVerifiedPurchaser, setIsVerifiedPurchaser] = useState(false);

  // Lightbox state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchProductReviews(productId);
    setReviews(data);
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadReviews]);

  useEffect(() => {
    if (user && productId) {
      const timer = setTimeout(() => {
        checkVerifiedPurchase(user.id, productId).then(setIsVerifiedPurchaser);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user, productId]);

  const handleEdit = (review: Review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setContent(review.content);
    setExistingImages(review.images || []);
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setShowForm(true);
    window.scrollTo({ top: document.getElementById('review-form')?.offsetTop ? document.getElementById('review-form')!.offsetTop - 100 : 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    
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

      loadReviews();
      onReviewUpdate?.();
      alert('Review deleted.');
    } catch {
      alert('Failed to delete review.');
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Limit total photos to 4
    const totalPhotos = selectedPhotos.length + existingImages.length;
    const allowedNew = Math.max(0, 4 - totalPhotos);
    const newFiles = files.slice(0, allowedNew);

    if (newFiles.length === 0) {
      alert('Maximum 4 photos allowed per review.');
      return;
    }

    setSelectedPhotos(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPhotoPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (selectedPhotos.length === 0) return [];
    
    setIsUploading(true);
    const urls: string[] = [];

    for (const file of selectedPhotos) {
      try {
        const cdnUrl = await uploadToStreamlet(file);
        urls.push(cdnUrl);
      } catch (error) {
        console.error('Photo upload error:', error);
      }
    }

    setIsUploading(false);
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      alert('Please sign in to leave a review.');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload new photos
      const newImageUrls = await uploadPhotos();
      const allImages = [...existingImages, ...newImageUrls];

      if (editingReviewId) {
        await updateReview(editingReviewId, { rating, content, images: allImages });
      } else {
        await submitReview({
          product_id: productId,
          user_id: user.id,
          user_name: profile?.full_name || user.name || 'Anonymous',
          rating,
          content,
          images: allImages,
          is_verified_purchase: isVerifiedPurchaser,
        });
      }
      
      // Reset form and show success
      setRating(0);
      setContent('');
      setSelectedPhotos([]);
      setPhotoPreviews([]);
      setExistingImages([]);
      setShowForm(false);
      setEditingReviewId(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      loadReviews();
      onReviewUpdate?.();
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === '42P01') {
        alert('Database setup required: The "reviews" table has not been created yet.');
      } else {
        alert('Failed to process review: ' + (error.message || 'Please try again.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setContent('');
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    setExistingImages([]);
    setShowForm(false);
    setEditingReviewId(null);
  };

  // Calculate review stats
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="mt-16 sm:mt-24 border-t border-[#E8E8E8] pt-16">
      {/* Header + Stats */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Left: Title + Write Review */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] uppercase">Customer Reviews</h2>
              <p className="text-sm text-[#666666] mt-2 font-light">
                {reviews.length > 0 ? `${reviews.length} verified reviews for this product` : 'Share your experience with this product'}
              </p>
            </div>
            
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#0066CC] transition-all shadow-sm flex items-center gap-2"
              >
                <Star size={12} />
                Write a Review
              </button>
            )}
          </div>

          {/* Rating Summary Bar */}
          {reviews.length > 0 && (
            <div className="flex items-start gap-8 p-6 bg-[#FAFAFA] border border-[#EEEEEE]">
              {/* Average Score */}
              <div className="text-center flex-shrink-0">
                <p className="text-4xl font-bold text-[#111111]">{avgRating}</p>
                <div className="flex gap-0.5 justify-center mt-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      fill={i < Math.round(Number(avgRating)) ? '#0080FF' : 'transparent'}
                      color={i < Math.round(Number(avgRating)) ? '#0080FF' : '#E8E8E8'}
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-[#999999] font-bold uppercase tracking-widest">{reviews.length} Reviews</p>
              </div>

              {/* Distribution Bars */}
              <div className="flex-1 space-y-1.5">
                {ratingCounts.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#999999] w-3 text-right">{star}</span>
                    <Star size={10} fill="#0080FF" color="#0080FF" />
                    <div className="flex-1 h-2 bg-[#EEEEEE] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: (5 - star) * 0.1 }}
                        className="h-full bg-[#0080FF]"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#999999] w-6">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 p-4 bg-[#F0F7FF] border border-[#0080FF]/20 flex items-center gap-3"
          >
            <Clock size={16} className="text-[#0080FF] flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#111111]">
                {editingReviewId ? 'Review updated!' : 'Review submitted successfully!'}
              </p>
              <p className="text-xs text-[#666666] font-light">
                Your review is pending approval and will be visible once verified by our team.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            id="review-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12 bg-[#F9F9F9] p-6 sm:p-8 border border-[#EEEEEE]"
          >
            {!isAuthenticated ? (
              <div className="text-center py-4">
                <p className="text-sm text-[#666666] mb-4 font-light">You must be signed in to leave a review.</p>
                <a href="/signin" className="text-[10px] font-bold uppercase tracking-widest text-[#0080FF] hover:underline">
                  Sign In Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                      {editingReviewId ? 'Edit Your Review' : 'New Review'}
                    </h3>
                    {isVerifiedPurchaser && (
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                        <CheckCircle size={10} /> Verified Purchase
                      </p>
                    )}
                  </div>
                  <button type="button" onClick={handleCancel} className="text-[#999999] hover:text-[#111111]">
                    <X size={16} />
                  </button>
                </div>

                {/* Star Rating */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={28}
                          fill={(hoveredRating || rating) >= star ? '#0080FF' : 'transparent'}
                          color={(hoveredRating || rating) >= star ? '#0080FF' : '#BBBBBB'}
                          strokeWidth={1.5}
                        />
                      </button>
                    ))}
                    {rating > 0 && (
                      <span className="text-xs text-[#666666] font-light self-center ml-2">
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">Your Review</label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us what you think about the fit, quality, and style..."
                    className="w-full p-4 bg-white border border-[#E8E8E8] text-sm focus:border-[#0080FF] outline-none transition-all font-light"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#999999]">
                    Add Photos <span className="font-normal text-[#BBBBBB]">(optional, max 4)</span>
                  </label>
                  
                  <div className="flex gap-3 flex-wrap">
                    {/* Existing images (during edit) */}
                    {existingImages.map((url, i) => (
                      <div key={`existing-${i}`} className="relative w-20 h-20 bg-[#F9F9F9] border border-[#EEEEEE] group overflow-hidden">
                        <Image src={url} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(i)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* New photo previews */}
                    {photoPreviews.map((preview, i) => (
                      <div key={`new-${i}`} className="relative w-20 h-20 bg-[#F9F9F9] border border-[#EEEEEE] group overflow-hidden">
                        <Image src={preview} alt="" fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    {/* Upload button */}
                    {(selectedPhotos.length + existingImages.length) < 4 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 border border-dashed border-[#CCCCCC] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F7FF] hover:border-[#0080FF] transition-all"
                      >
                        <Camera size={18} className="text-[#999999] mb-1" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#999999]">Photo</span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoSelect}
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-1 py-4 bg-[#0080FF] text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0066CC] transition-all disabled:opacity-50"
                  >
                    {isSubmitting || isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isUploading ? 'Uploading Photos...' : 'Submitting...'}
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        {editingReviewId ? 'Update Review' : 'Submit Review'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-4 border border-[#E8E8E8] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-10">
        {isLoading ? (
          <div className="flex flex-col items-center py-10">
            <div className="w-8 h-8 border-2 border-[#0080FF]/20 border-t-[#0080FF] rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB]">Loading Reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review, i) => {
            const isOwner = user?.id === review.user_id;
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F9F9F9] rounded-full flex items-center justify-center text-[#999999] border border-[#EEEEEE]">
                      <User size={18} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold uppercase tracking-tight text-[#111111]">{review.user_name}</h4>
                        {review.is_verified_purchase && (
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-green-50 text-green-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle size={8} /> Verified Purchase
                          </span>
                        )}
                        {isOwner && (
                          <span className="text-[8px] font-bold uppercase tracking-widest bg-[#0080FF]/10 text-[#0080FF] px-1.5 py-0.5 rounded">You</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#999999] font-medium tracking-wider">
                        {new Date(review.created_at).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? '#0080FF' : 'transparent'}
                          color={i < review.rating ? '#0080FF' : '#E8E8E8'}
                          strokeWidth={1}
                        />
                      ))}
                    </div>
                    {isOwner && (
                      <div className="flex gap-3 mt-1">
                        <button 
                          onClick={() => handleEdit(review)}
                          className="text-[#999999] hover:text-[#0080FF] transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
                        >
                          <Edit2 size={10} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-[#999999] hover:text-red-500 transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest"
                        >
                          <Trash2 size={10} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-sm font-light text-[#666666] leading-relaxed pl-[52px]">
                  {review.content}
                </p>

                {/* Review Photos */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4 pl-[52px] flex-wrap">
                    {review.images.map((img, imgIdx) => (
                      <button
                        key={imgIdx}
                        onClick={() => setLightboxImage(img)}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9F9F9] border border-[#EEEEEE] overflow-hidden hover:opacity-80 transition-opacity cursor-pointer relative"
                      >
                        <Image src={img} alt={`Review photo ${imgIdx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 border-b border-[#F0F0F0] w-full" />
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#F9F9F9] border border-dashed border-[#E8E8E8]">
            <Star size={32} className="mx-auto text-[#DDDDDD] mb-4" strokeWidth={1} />
            <p className="text-sm font-light text-[#999999]">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[80vh] w-full"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="relative w-full aspect-square sm:aspect-video">
                <Image
                  src={lightboxImage}
                  alt="Review photo"
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

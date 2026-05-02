import { supabase } from './supabase';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  content: string;
  images: string[];
  is_verified_purchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  content: string;
  images: string[] | null;
  is_verified_purchase: boolean | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  created_at: string;
}

/**
 * Fetch approved reviews for a product (public-facing).
 * Only returns reviews with status = 'approved'.
 */
export const fetchProductReviews = async (productId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === '42P01') {
      console.warn('The "reviews" table does not exist in Supabase yet. Please run the SQL setup script.');
    } else {
      console.error('Error fetching reviews:', error.message || error);
    }
    return [];
  }

  return (data || []).map(mapReview);
};

/**
 * Fetch ALL reviews (for admin moderation panel).
 * Returns reviews of all statuses, optionally filtered.
 */
export const fetchAllReviews = async (statusFilter?: string): Promise<Review[]> => {
  let query = supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all reviews:', error.message || error);
    return [];
  }

  return (data || []).map(mapReview);
};

/**
 * Submit a new review. Status defaults to 'pending' (requires admin approval).
 */
export const submitReview = async (review: Omit<Review, 'id' | 'created_at' | 'status'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      ...review,
      status: 'pending',
    }])
    .select()
    .single();

  if (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
  
  return data;
};

/**
 * Check if a user has purchased a specific product (for verified purchase badge).
 */
export const checkVerifiedPurchase = async (userId: string, productId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('id, order_id')
    .eq('product_id', productId);

  if (error || !data || data.length === 0) return false;

  // Check if any of these orders belong to the user
  const orderIds = data.map((item: { order_id: string }) => item.order_id);
  const { data: orders, error: orderError } = await supabase
    .from('orders')
    .select('id')
    .in('id', orderIds)
    .eq('user_id', userId);

  if (orderError || !orders) return false;
  return orders.length > 0;
};

export const updateReview = async (id: string, updates: Partial<Pick<Review, 'rating' | 'content' | 'images'>>) => {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    throw error;
  }

  return data;
};

/**
 * Update review status (admin moderation).
 */
export const updateReviewStatus = async (id: string, status: 'approved' | 'rejected') => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating review status:', error);
    throw error;
  }

  return data;
};

export const deleteReview = async (id: string) => {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

/** Map raw Supabase row to our Review interface */
function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    product_id: row.product_id,
    user_id: row.user_id,
    user_name: row.user_name,
    rating: row.rating,
    content: row.content,
    images: row.images || [],
    is_verified_purchase: row.is_verified_purchase || false,
    status: row.status || 'pending',
    created_at: row.created_at,
  };
}

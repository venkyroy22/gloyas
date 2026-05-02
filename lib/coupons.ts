import { supabase } from './supabase';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon: Coupon | null;
  discount: number;
  message: string;
}

/**
 * Validate a coupon code against the order subtotal.
 * Returns the discount amount and validation status.
 */
export const validateCoupon = async (code: string, subtotal: number): Promise<CouponValidationResult> => {
  if (!code.trim()) {
    return { valid: false, coupon: null, discount: 0, message: 'Please enter a coupon code.' };
  }

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (error || !data) {
    return { valid: false, coupon: null, discount: 0, message: 'Invalid coupon code.' };
  }

  const coupon: Coupon = data;

  // Check if active
  if (!coupon.is_active) {
    return { valid: false, coupon: null, discount: 0, message: 'This coupon is no longer active.' };
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, coupon: null, discount: 0, message: 'This coupon has expired.' };
  }

  // Check usage limit
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, coupon: null, discount: 0, message: 'This coupon has reached its usage limit.' };
  }

  // Check minimum order
  if (subtotal < coupon.min_order_amount) {
    return { 
      valid: false, 
      coupon: null, 
      discount: 0, 
      message: `Minimum order of ₹${coupon.min_order_amount.toLocaleString('en-IN')} required for this coupon.` 
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round(subtotal * (coupon.value / 100));
  } else {
    discount = Math.min(coupon.value, subtotal); // Flat discount can't exceed subtotal
  }

  const label = coupon.type === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`;

  return { 
    valid: true, 
    coupon, 
    discount, 
    message: `Coupon applied! ${label} your order.` 
  };
};

/**
 * Increment the usage count of a coupon (call after successful order).
 */
export const incrementCouponUsage = async (couponId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_coupon_usage', { coupon_id: couponId });

  // Fallback if RPC doesn't exist: manual increment
  if (error) {
    const { data } = await supabase
      .from('coupons')
      .select('used_count')
      .eq('id', couponId)
      .single();

    if (data) {
      await supabase
        .from('coupons')
        .update({ used_count: (data.used_count || 0) + 1 })
        .eq('id', couponId);
    }
  }
};

/**
 * Fetch all coupons (admin use).
 */
export const fetchAllCoupons = async (): Promise<Coupon[]> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }

  return data || [];
};

/**
 * Create a new coupon (admin use).
 */
export const createCoupon = async (coupon: Omit<Coupon, 'id' | 'created_at' | 'used_count'>): Promise<Coupon> => {
  const { data, error } = await supabase
    .from('coupons')
    .insert([{
      ...coupon,
      code: coupon.code.toUpperCase().trim(),
      used_count: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }

  return data;
};

/**
 * Delete a coupon (admin use).
 */
export const deleteCoupon = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
};

/**
 * Toggle coupon active/inactive (admin use).
 */
export const toggleCouponActive = async (id: string, isActive: boolean): Promise<void> => {
  const { error } = await supabase
    .from('coupons')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error toggling coupon:', error);
    throw error;
  }
};

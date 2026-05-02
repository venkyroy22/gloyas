import { supabase } from './supabase';
import { CartItem } from '@/context/CartContext';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
  image: string;
}

export interface OrderData {
  user_id?: string | null;
  total_amount: number;
  shipping_address: ShippingAddress;
  items: CartItem[];
}

export interface Order {
  id: string;
  user_id: string | null;
  total_amount: number;
  shipping_address: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_id: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export const createOrder = async (orderData: OrderData) => {
  try {
    // 1. Insert the main order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id || null,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      color: item.color,
      image: item.image,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Decrement stock for each item
    for (const item of orderData.items) {
      // Fetch current stock
      const { data: product } = await supabase
        .from('products')
        .select('stock_count')
        .eq('id', item.id)
        .single();
        
      if (product) {
        const newStock = Math.max(0, (product.stock_count || 0) - item.quantity);
        await supabase
          .from('products')
          .update({ stock_count: newStock })
          .eq('id', item.id);
      }
    }

    return { order: order as Order, error: null };
  } catch (error: unknown) {
    console.error('Error creating order:', error);
    return { order: null, error };
  }
};

export const fetchUserOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const fetchOrderById = async (orderId: string): Promise<{ data: Order | null; error: unknown }> => {
  let cleanId = orderId.trim().toLowerCase();
  if (cleanId.startsWith('#')) cleanId = cleanId.substring(1);
  if (cleanId.toUpperCase().startsWith('GLY-')) cleanId = cleanId.substring(4);

  let result: { data: Order | null; error: unknown };

  // If it's a short ID (8 chars), search using range boundaries
  if (cleanId.length === 8) {
    result = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .gte('id', `${cleanId}-0000-0000-0000-000000000000`)
      .lte('id', `${cleanId}-ffff-ffff-ffff-ffffffffffff`)
      .single();
  } else {
    // Otherwise try exact match (full UUID)
    result = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', cleanId)
      .single();
  }

  // Fallback: If order found but items are empty, try fetching items separately
  // This helps bypass some complex RLS join issues
  if (result.data && (!result.data.order_items || result.data.order_items.length === 0)) {
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', result.data.id);
    
    if (items && items.length > 0) {
      result.data.order_items = items as OrderItem[];
    }
  }

  return result;
};

export const fetchAllOrders = async (): Promise<{ data: Order[] | null; error: unknown }> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<{ error: unknown }> => {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  return { error };
};

export const updateOrderTrackingId = async (orderId: string, trackingId: string): Promise<{ error: Error | null }> => {
  const { error } = await supabase
    .from('orders')
    .update({ tracking_id: trackingId, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  return { error: error as unknown as Error | null };
}

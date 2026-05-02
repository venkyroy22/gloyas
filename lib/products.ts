import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  stockCount: number;
  productStory?: string | null;
}

interface ProductRow {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  price: number;
  original_price: number | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: { name: string; hex: string }[] | null;
  is_new: boolean;
  is_sale: boolean;
  rating: number | null;
  review_count: number | null;
  description: string | null;
  details: string[] | null;
  stock_count: number | null;
  product_story: string | null;
  created_at: string;
}

export const products: Product[] = []; // We'll keep this as a fallback or cache

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data as ProductRow[]).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || '',
    price: Number(p.price),
    originalPrice: Number(p.original_price || p.price),
    images: p.images || [],
    sizes: p.sizes || ['One Size Fits All'],
    colors: p.colors || [],
    isNew: p.is_new,
    isSale: p.is_sale,
    rating: Number(p.rating || 5),
    reviewCount: Number(p.review_count || 0),
    description: p.description || '',
    details: p.details || [],
    stockCount: Number(p.stock_count || 0),
    productStory: p.product_story,
  }));
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    subcategory: data.subcategory || '',
    price: Number(data.price),
    originalPrice: Number(data.original_price || data.price),
    images: data.images || [],
    sizes: data.sizes || ['One Size Fits All'],
    colors: data.colors || [],
    isNew: data.is_new,
    isSale: data.is_sale,
    rating: Number(data.rating || 5),
    reviewCount: Number(data.review_count || 0),
    description: data.description || '',
    details: data.details || [],
    stockCount: Number(data.stock_count || 0),
    productStory: data.product_story,
  };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  let query = supabase.from('products').select('*');
  
  if (category === 'sale') {
    query = query.eq('is_sale', true);
  } else if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];

  return (data as ProductRow[]).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || '',
    price: Number(p.price),
    originalPrice: Number(p.original_price || p.price),
    images: p.images || [],
    sizes: p.sizes || ['One Size Fits All'],
    colors: p.colors || [],
    isNew: p.is_new,
    isSale: p.is_sale,
    rating: Number(p.rating || 5),
    reviewCount: Number(p.review_count || 0),
    description: p.description || '',
    details: p.details || [],
    stockCount: Number(p.stock_count || 0),
    productStory: p.product_story,
  }));
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_new', true)
    .limit(8);

  if (error) return [];

  return (data as ProductRow[]).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory || '',
    price: Number(p.price),
    originalPrice: Number(p.original_price || p.price),
    images: p.images || [],
    sizes: p.sizes || ['One Size Fits All'],
    colors: p.colors || [],
    isNew: p.is_new,
    isSale: p.is_sale,
    rating: Number(p.rating || 5),
    reviewCount: Number(p.review_count || 0),
    description: p.description || '',
    details: p.details || [],
    stockCount: Number(p.stock_count || 0),
  }));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export const categories = [
  {
    name: 'BASEBALL CAPS',
    slug: 'baseball-caps',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/baseballcap-1776881129562.webp',
  },
  {
    name: 'BEANIES',
    slug: 'beanies',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/beanie-1776881131917.webp',
  },
  {
    name: 'SNAPBACK CAPS',
    slug: 'snapback-caps',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/sanpbackcap-1776881145713.webp',
  },
  {
    name: 'DAD CAPS',
    slug: 'dad-caps',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/dadcap-1776881137186.webp',
  },
  {
    name: 'TRUCKER CAPS',
    slug: 'trucker-caps',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/truckercap-1776881150835.webp',
  },
  {
    name: 'DOCKER HAT',
    slug: 'docker-hat',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/dockerhat-1776881139510.webp',
  },
  {
    name: 'BUCKET HATS',
    slug: 'bucket-hats',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/buckethat-1776881134207.webp',
  },
  {
    name: '5 PANEL CAP',
    slug: '5-panel-cap',
    image: 'https://cdn.streamlet.in/69e90aee72e67a6c3dc22477/images/5panelcap-1776881125958.webp',
  },
];

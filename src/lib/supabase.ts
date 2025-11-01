import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  rating: number;
  stock: number;
  tags: string[];
  created_at: string;
  categories?: Category;
};

export type UserInteraction = {
  id: string;
  user_id: string;
  product_id: string;
  interaction_type: 'view' | 'like' | 'purchase';
  created_at: string;
};

export type Recommendation = {
  id: string;
  user_id: string;
  product_id: string;
  score: number;
  reason: string;
  created_at: string;
  products?: Product;
};

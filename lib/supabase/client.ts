import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  detectSessionInUrl: true,
  },
});

export type Chick = {
  id: string;
  name: string;
  description: string;
  price: number;
  sortie_date: string | null;
  quantity_available: number;
  image_url: string;
  is_featured: boolean;
  created_at: string;
};

export type Accessory = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  created_at: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  author: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  whatsapp_sent: boolean;
  notes: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  item_type: string;
  item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  whatsapp_number: string;
  is_admin: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  type: 'chick' | 'accessory';
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  item_id: string;
};

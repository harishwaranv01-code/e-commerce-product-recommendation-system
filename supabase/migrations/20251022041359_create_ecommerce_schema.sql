/*
  # E-Commerce Product Recommendation System Schema

  ## Overview
  Creates a comprehensive database schema for an e-commerce platform with product recommendations.

  ## New Tables
  
  ### 1. `categories`
  - `id` (uuid, primary key) - Unique category identifier
  - `name` (text) - Category name
  - `slug` (text, unique) - URL-friendly category identifier
  - `description` (text) - Category description
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `products`
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (decimal) - Product price
  - `image_url` (text) - Product image URL
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `rating` (decimal) - Average product rating (0-5)
  - `stock` (integer) - Available stock quantity
  - `tags` (text[]) - Array of product tags for filtering
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `user_preferences`
  - `id` (uuid, primary key) - Unique preference identifier
  - `user_id` (uuid) - User identifier (from auth.users)
  - `category_id` (uuid, foreign key) - Preferred category
  - `weight` (decimal) - Preference weight/score
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. `user_interactions`
  - `id` (uuid, primary key) - Unique interaction identifier
  - `user_id` (uuid) - User identifier (from auth.users)
  - `product_id` (uuid, foreign key) - Interacted product
  - `interaction_type` (text) - Type: 'view', 'like', 'purchase'
  - `created_at` (timestamptz) - Interaction timestamp

  ### 5. `recommendations`
  - `id` (uuid, primary key) - Unique recommendation identifier
  - `user_id` (uuid) - Target user identifier
  - `product_id` (uuid, foreign key) - Recommended product
  - `score` (decimal) - Recommendation confidence score
  - `reason` (text) - Recommendation reason/explanation
  - `created_at` (timestamptz) - Recommendation generation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for categories and products (anonymous browsing)
  - Authenticated users can read/write their own preferences and interactions
  - Authenticated users can read their own recommendations
  - Restrictive policies based on user_id for personal data

  ## Indexes
  - Added indexes on foreign keys for performance
  - Added indexes on commonly queried fields (category_id, user_id, product tags)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  image_url text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  stock integer DEFAULT 0 CHECK (stock >= 0),
  tags text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  weight decimal(5,2) DEFAULT 1.0 CHECK (weight >= 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category_id)
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('view', 'like', 'purchase')),
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  score decimal(5,2) DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_product ON user_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user ON recommendations(user_id);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_interactions
CREATE POLICY "Users can view own interactions"
  ON user_interactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interactions"
  ON user_interactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interactions"
  ON user_interactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interactions"
  ON user_interactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for recommendations
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Latest gadgets and electronic devices'),
  ('Fashion', 'fashion', 'Trending clothing and accessories'),
  ('Home & Living', 'home-living', 'Furniture and home decor'),
  ('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear'),
  ('Books & Media', 'books-media', 'Books, movies, and music'),
  ('Beauty & Health', 'beauty-health', 'Beauty products and health essentials')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Wireless Headphones Pro',
  'Premium noise-cancelling wireless headphones with 30-hour battery life',
  299.99,
  'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
  id,
  4.8,
  45,
  ARRAY['audio', 'wireless', 'premium']
FROM categories WHERE slug = 'electronics'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Smart Watch Ultra',
  'Advanced fitness tracking with heart rate monitor and GPS',
  399.99,
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
  id,
  4.6,
  32,
  ARRAY['wearable', 'fitness', 'smart']
FROM categories WHERE slug = 'electronics'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Leather Jacket Classic',
  'Genuine leather jacket with timeless design',
  189.99,
  'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
  id,
  4.7,
  28,
  ARRAY['clothing', 'leather', 'classic']
FROM categories WHERE slug = 'fashion'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Designer Sneakers',
  'Limited edition designer sneakers with premium materials',
  149.99,
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  id,
  4.9,
  15,
  ARRAY['footwear', 'designer', 'limited']
FROM categories WHERE slug = 'fashion'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Modern Coffee Table',
  'Minimalist coffee table with tempered glass top',
  249.99,
  'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
  id,
  4.5,
  12,
  ARRAY['furniture', 'modern', 'glass']
FROM categories WHERE slug = 'home-living'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Ergonomic Office Chair',
  'Premium ergonomic chair with lumbar support',
  329.99,
  'https://images.pexels.com/photos/6480707/pexels-photo-6480707.jpeg',
  id,
  4.8,
  20,
  ARRAY['furniture', 'office', 'ergonomic']
FROM categories WHERE slug = 'home-living'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Yoga Mat Premium',
  'Extra thick yoga mat with carrying strap',
  49.99,
  'https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg',
  id,
  4.7,
  67,
  ARRAY['fitness', 'yoga', 'exercise']
FROM categories WHERE slug = 'sports-outdoors'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Camping Tent 4-Person',
  'Waterproof camping tent with easy setup',
  179.99,
  'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg',
  id,
  4.6,
  23,
  ARRAY['camping', 'outdoor', 'waterproof']
FROM categories WHERE slug = 'sports-outdoors'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Bestseller Novel Collection',
  'Set of 5 bestselling fiction novels',
  79.99,
  'https://images.pexels.com/photos/1301585/pexels-photo-1301585.jpeg',
  id,
  4.9,
  40,
  ARRAY['books', 'fiction', 'collection']
FROM categories WHERE slug = 'books-media'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, image_url, category_id, rating, stock, tags)
SELECT 
  'Organic Skincare Set',
  'Complete organic skincare routine set',
  89.99,
  'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
  id,
  4.8,
  55,
  ARRAY['skincare', 'organic', 'beauty']
FROM categories WHERE slug = 'beauty-health'
ON CONFLICT DO NOTHING;
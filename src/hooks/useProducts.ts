import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';

export function useProducts(categoryId?: string, searchQuery?: string, tags?: string[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*, categories(*)')
          .order('created_at', { ascending: false });

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        if (tags && tags.length > 0) {
          query = query.contains('tags', tags);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categoryId, searchQuery, tags]);

  return { products, loading };
}

import { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';

export function useRecommendations(interactions: string[]) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateRecommendations() {
      setLoading(true);
      try {
        if (interactions.length === 0) {
          const { data, error } = await supabase
            .from('products')
            .select('*, categories(*)')
            .order('rating', { ascending: false })
            .limit(6);

          if (error) throw error;
          setRecommendations(data || []);
        } else {
          const { data: interactedProducts, error: interactedError } = await supabase
            .from('products')
            .select('category_id, tags')
            .in('id', interactions);

          if (interactedError) throw interactedError;

          const categoryIds = [...new Set(interactedProducts?.map(p => p.category_id) || [])];
          const allTags = [...new Set(interactedProducts?.flatMap(p => p.tags || []) || [])];

          let query = supabase
            .from('products')
            .select('*, categories(*)')
            .not('id', 'in', `(${interactions.join(',')})`)
            .order('rating', { ascending: false })
            .limit(6);

          if (categoryIds.length > 0) {
            query = query.in('category_id', categoryIds);
          }

          const { data, error } = await query;

          if (error) throw error;

          const scored = (data || []).map(product => {
            let score = product.rating || 0;
            if (allTags.some(tag => product.tags?.includes(tag))) {
              score += 2;
            }
            return { ...product, score };
          });

          scored.sort((a, b) => b.score - a.score);
          setRecommendations(scored);
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    generateRecommendations();
  }, [interactions]);

  return { recommendations, loading };
}

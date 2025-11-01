import { Sparkles } from 'lucide-react';
import { Product } from '../lib/supabase';
import { ProductCard } from './ProductCard';

interface RecommendationSectionProps {
  recommendations: Product[];
  loading: boolean;
  onInteraction: (productId: string, type: 'view' | 'like' | 'purchase') => void;
}

export function RecommendationSection({
  recommendations,
  loading,
  onInteraction,
}: RecommendationSectionProps) {
  if (loading) {
    return (
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Recommended For You
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-96 bg-gray-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-purple-500/50 animate-pulse-slow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Recommended For You
          </h2>
          <p className="text-gray-400 mt-1">
            Based on your interests and browsing history
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((product, index) => (
          <div
            key={product.id}
            style={{
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <ProductCard product={product} onInteraction={onInteraction} />
          </div>
        ))}
      </div>
    </div>
  );
}

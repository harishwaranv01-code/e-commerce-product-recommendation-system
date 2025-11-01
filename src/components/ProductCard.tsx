import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onInteraction: (productId: string, type: 'view' | 'like' | 'purchase') => void;
}

export function ProductCard({ product, onInteraction }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onInteraction(product.id, 'like');
  };

  const handleView = () => {
    onInteraction(product.id, 'view');
  };

  const handlePurchase = () => {
    onInteraction(product.id, 'purchase');
  };

  return (
    <div
      className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700/50"
      onClick={handleView}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative h-64 overflow-hidden bg-gray-950">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.image_url}
          alt={product.name}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 ${
            isLiked
              ? 'bg-red-500/90 text-white scale-110'
              : 'bg-gray-900/60 text-gray-300 hover:bg-gray-900/80 hover:scale-110'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            Only {product.stock} left
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300">
              {product.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <div className="flex gap-1">
            {product.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-lg font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePurchase();
              }}
              disabled={product.stock === 0}
              className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

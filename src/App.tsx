import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { RecommendationSection } from './components/RecommendationSection';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { useProducts } from './hooks/useProducts';
import { useCategories } from './hooks/useCategories';
import { useRecommendations } from './hooks/useRecommendations';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [interactions, setInteractions] = useState<string[]>([]);

  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading } = useProducts(
    selectedCategory || undefined,
    searchQuery || undefined
  );
  const { recommendations, loading: recommendationsLoading } = useRecommendations(interactions);

  useEffect(() => {
    const savedInteractions = localStorage.getItem('userInteractions');
    if (savedInteractions) {
      setInteractions(JSON.parse(savedInteractions));
    }
  }, []);

  const handleInteraction = (productId: string, type: 'view' | 'like' | 'purchase') => {
    const newInteractions = [...interactions];

    if (type === 'view' && !interactions.includes(productId)) {
      newInteractions.push(productId);
    } else if (type === 'like') {
      if (!interactions.includes(productId)) {
        newInteractions.push(productId);
      }
    } else if (type === 'purchase') {
      if (!interactions.includes(productId)) {
        newInteractions.push(productId);
      }
    }

    const uniqueInteractions = [...new Set(newInteractions)].slice(-20);
    setInteractions(uniqueInteractions);
    localStorage.setItem('userInteractions', JSON.stringify(uniqueInteractions));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 space-y-6">
          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>

          {!categoriesLoading && (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Products`
              : 'All Products'}
          </h2>
          <p className="text-gray-400">
            {productsLoading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        {productsLoading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                style={{
                  animation: `slideUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <ProductCard product={product} onInteraction={handleInteraction} />
              </div>
            ))}
          </div>
        )}

        <RecommendationSection
          recommendations={recommendations}
          loading={recommendationsLoading}
          onInteraction={handleInteraction}
        />
      </main>

      <footer className="mt-20 border-t border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <p className="text-sm">Powered by AI-driven recommendation engine</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

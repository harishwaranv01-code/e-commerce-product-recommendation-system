import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-500" />
      <div className="relative flex items-center">
        <Search className="absolute left-5 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors duration-300" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-14 pr-14 py-4 bg-gray-800 text-white placeholder-gray-400 rounded-2xl border-2 border-gray-700 focus:border-cyan-500 focus:outline-none transition-all duration-300"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 p-1 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}

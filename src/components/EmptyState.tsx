import { Package } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No products found' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse-slow" />
        <div className="relative p-8 bg-gray-800 rounded-full">
          <Package className="w-16 h-16 text-gray-500" />
        </div>
      </div>
      <h3 className="mt-8 text-2xl font-bold text-white">{message}</h3>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Try adjusting your filters or search terms to find what you're looking for
      </p>
    </div>
  );
}

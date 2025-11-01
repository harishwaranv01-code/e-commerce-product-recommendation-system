import { ShoppingBag, TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
      <div className="absolute inset-0 backdrop-blur-3xl" />

      <div className="relative container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-50 animate-pulse-slow" />
              <div className="relative p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                SmartShop
              </h1>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4" />
                AI-Powered Recommendations
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
              <p className="text-sm text-gray-400">Welcome to the future of shopping</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
    </header>
  );
}

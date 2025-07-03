import React, { useState } from 'react';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = [
  'Kurtas', 'Jeans', 'T-Shirts', 'Dresses', 'Sneakers', 'Sarees', 'Jackets', 'Handbags'
];

const recentSearches = [
  'Men shoes', 'Women dresses', 'Ethnic wear'
];

const MobileSearch: React.FC<MobileSearchProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  const handleQuickSearch = (query: string) => {
    window.location.href = `/products?search=${encodeURIComponent(query)}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 flex-1">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-4 pr-12 text-base border-2 border-gray-300 rounded-lg bg-white focus:border-hednor-gold focus:ring-2 focus:ring-hednor-gold/20 transition-all"
                autoFocus
              />
              <Button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-hednor-gold hover:bg-yellow-500 text-hednor-dark rounded-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-2 p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-gray-900">Recent Searches</h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(search)}
                  className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-gray-700">{search}</span>
                  <Search className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trending Searches */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">Trending Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((search, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-hednor-gold hover:text-hednor-dark transition-colors px-3 py-2 text-sm"
                onClick={() => handleQuickSearch(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearch;
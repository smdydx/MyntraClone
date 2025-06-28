
import { useState, useEffect } from "react";
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const categories = [
  { name: 'Men', icon: '👨' },
  { name: 'Women', icon: '👩' },
  { name: 'Kids', icon: '👶' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Home', icon: '🏠' },
];

export default function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setShowSuggestions(true);
    }
  }, [isOpen]);

  const handleSearch = (query: string = searchQuery) => {
    if (query.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(query.trim())}`;
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length === 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const searchSuggestions = searchQuery.length > 0 ? 
    trendingSearches.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5) : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0 rounded-none border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full bg-white">
          {/* Search Header */}
          <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:border-hednor-gold focus:ring-2 focus:ring-hednor-gold/20 bg-gray-50"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(true);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="ml-3 px-3 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Search Suggestions */}
            {searchQuery.length > 0 && searchSuggestions.length > 0 && (
              <div className="bg-white border-b border-gray-200">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-gray-800 flex-1">{suggestion}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Default Content (when no search query) */}
            {showSuggestions && searchQuery.length === 0 && (
              <div className="space-y-6 p-4">
                {/* Quick Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shop by Category</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          window.location.href = `/products?category=${category.name.toLowerCase()}`;
                          onClose();
                        }}
                        className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <span className="text-2xl mb-1">{category.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Trending Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-2 text-sm bg-gray-100 hover:bg-hednor-gold hover:text-hednor-dark rounded-full text-gray-700 transition-colors border border-gray-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center mb-3">
                      <Clock className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Recent Searches</h3>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="flex items-center py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
                        >
                          <Clock className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-700 flex-1">{search}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Tips */}
                <div className="bg-gradient-to-r from-hednor-gold/10 to-yellow-100 rounded-lg p-4 border border-hednor-gold/20">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Search Tips</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Try searching for brands like "Nike", "Adidas"</li>
                    <li>• Use specific terms like "red dress", "cotton shirt"</li>
                    <li>• Browse categories for better results</li>
                  </ul>
                </div>
              </div>
            )}

            {/* No Results */}
            {searchQuery.length > 0 && searchSuggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No suggestions found</h3>
                <p className="text-gray-600 text-center mb-4">
                  Try searching for something else or browse our categories
                </p>
                <Button 
                  onClick={() => handleSearch()}
                  className="bg-hednor-gold hover:bg-yellow-500 text-hednor-dark px-6 py-2 rounded-lg font-medium"
                >
                  Search Anyway
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Scroll to top when mobile search opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto top-[20%] translate-y-0 p-0 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Products</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                autoFocus
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium"
                disabled={!searchQuery.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-3 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Popular searches or recent searches could go here */}
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {['Shoes', 'T-shirts', 'Jeans', 'Dresses', 'Jackets'].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    window.location.href = `/products?search=${encodeURIComponent(term)}`;
                    onClose();
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function MobileSearch() {
  const { isMobileSearchOpen, setMobileSearchOpen } = useStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setMobileSearchOpen(false);
    }
  };

  const recentSearches = ["t-shirts", "dresses", "shoes", "jeans"];

  if (!isMobileSearchOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-white z-50 transform transition-transform duration-300">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSearchOpen(false)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <form onSubmit={handleSearch} className="flex-1">
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hednor-gold focus:border-transparent"
              autoFocus
            />
          </form>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold mb-4">Recent Searches</h3>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start p-2 bg-gray-50 hover:bg-gray-100 text-sm text-left"
              onClick={() => {
                setSearchQuery(search);
                window.location.href = `/products?search=${encodeURIComponent(search)}`;
                setMobileSearchOpen(false);
              }}
            >
              <Search className="h-4 w-4 mr-2" />
              {search}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

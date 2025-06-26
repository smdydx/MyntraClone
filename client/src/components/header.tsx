import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";
import CartSlideout from "./cart-slideout";
import MobileSearch from "./mobile-search";

const navigation = [
  { name: "Men", href: "/products?category=men" },
  { name: "Women", href: "/products?category=women" },
  { name: "Kids", href: "/products?category=kids" },
  { name: "Home & Living", href: "/products?category=home" },
  { name: "Beauty", href: "/products?category=beauty" },
  { name: "Studio", href: "/products?category=studio" },
];

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const {
    cartCount,
    isCartOpen,
    setCartOpen,
    isMobileSearchOpen,
    setMobileSearchOpen,
    wishlistItems,
  } = useStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        {/* Top Banner */}
        <div className="bg-hednor-gold text-hednor-dark text-center py-2 text-sm font-medium">
          <span>Free Shipping on Orders Above ₹1999 | Use Code: FREESHIP</span>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="font-poppins font-bold text-xl text-hednor-dark">HEDNOR</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-hednor-gold font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hednor-gold focus:border-transparent"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-700 hover:text-hednor-gold"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/profile" className="flex flex-col items-center text-gray-700 hover:text-hednor-gold cursor-pointer transition-colors">
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1">Profile</span>
                </Link>
                
                <div className="flex flex-col items-center text-gray-700 hover:text-hednor-gold cursor-pointer transition-colors relative">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs mt-1">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-sale-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center text-gray-700 hover:text-hednor-gold cursor-pointer transition-colors relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs mt-1">Bag</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-sale-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-gray-700 hover:text-hednor-gold">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-gray-700 hover:text-hednor-gold font-medium transition-colors py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t pt-4 mt-8">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 text-gray-700 hover:text-hednor-gold font-medium transition-colors py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <div className="flex items-center space-x-2 text-gray-700 hover:text-hednor-gold font-medium cursor-pointer transition-colors py-2">
                        <Heart className="h-5 w-5" />
                        <span>Wishlist ({wishlistItems.length})</span>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {/* Cart Slideout */}
      <CartSlideout />

      {/* Mobile Search */}
      <MobileSearch />
    </>
  );
}

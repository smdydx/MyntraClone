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
import AuthModal from "./auth-modal";

const navigation = [
  { 
    name: "Men", 
    href: "/products?category=men",
    submenu: [
      { name: "T-shirts & Polo", href: "/products?category=men&subcategory=tshirts" },
      { name: "Shirts", href: "/products?category=men&subcategory=shirts" },
      { name: "Jeans", href: "/products?category=men&subcategory=jeans" },
      { name: "Casual Shoes", href: "/products?category=men&subcategory=shoes" },
      { name: "Sports Shoes", href: "/products?category=men&subcategory=sports-shoes" },
      { name: "Watches", href: "/products?category=men&subcategory=watches" },
    ]
  },
  { 
    name: "Women", 
    href: "/products?category=women",
    submenu: [
      { name: "Dresses", href: "/products?category=women&subcategory=dresses" },
      { name: "Tops & Tees", href: "/products?category=women&subcategory=tops" },
      { name: "Jeans", href: "/products?category=women&subcategory=jeans" },
      { name: "Heels", href: "/products?category=women&subcategory=heels" },
      { name: "Handbags", href: "/products?category=women&subcategory=handbags" },
      { name: "Jewellery", href: "/products?category=women&subcategory=jewellery" },
    ]
  },
  { 
    name: "Kids", 
    href: "/products?category=kids",
    submenu: [
      { name: "Boys Clothing", href: "/products?category=kids&subcategory=boys" },
      { name: "Girls Clothing", href: "/products?category=kids&subcategory=girls" },
      { name: "Toys", href: "/products?category=kids&subcategory=toys" },
      { name: "School Supplies", href: "/products?category=kids&subcategory=school" },
    ]
  },
  { 
    name: "Home & Living", 
    href: "/products?category=home",
    submenu: [
      { name: "Bedsheets", href: "/products?category=home&subcategory=bedsheets" },
      { name: "Curtains", href: "/products?category=home&subcategory=curtains" },
      { name: "Cushions", href: "/products?category=home&subcategory=cushions" },
      { name: "Kitchen", href: "/products?category=home&subcategory=kitchen" },
    ]
  },
  { 
    name: "Beauty", 
    href: "/products?category=beauty",
    submenu: [
      { name: "Makeup", href: "/products?category=beauty&subcategory=makeup" },
      { name: "Skincare", href: "/products?category=beauty&subcategory=skincare" },
      { name: "Haircare", href: "/products?category=beauty&subcategory=haircare" },
      { name: "Fragrance", href: "/products?category=beauty&subcategory=fragrance" },
    ]
  },
  { 
    name: "Studio", 
    href: "/products?category=studio",
    submenu: [
      { name: "New Arrivals", href: "/products?category=studio&subcategory=new" },
      { name: "Premium", href: "/products?category=studio&subcategory=premium" },
      { name: "Limited Edition", href: "/products?category=studio&subcategory=limited" },
    ]
  },
];

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
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
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        {/* Top Banner */}
        <div className="bg-hednor-gold text-hednor-dark text-center py-2 text-sm font-medium">
          <span>Free Shipping on Orders Above ₹1999 | Use Code: FREESHIP</span>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center mr-6">
              <img 
                src={hednorLogoPath} 
                alt="Hednor" 
                className="w-14 h-14 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 flex-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-pink-600 font-semibold text-sm uppercase tracking-wide transition-colors px-2 py-1"
                  >
                    {item.name}
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-1 w-52 bg-white shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-3">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search for products, brands and more"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:ring-1 focus:ring-pink-400 focus:border-pink-400 text-sm"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-700 hover:text-pink-600 p-2"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Login Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-700 hover:text-pink-600 p-2"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-5">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center text-gray-700 hover:text-pink-600 cursor-pointer transition-colors p-2"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium hidden md:block">Profile</span>
                </Button>
                
                <div className="flex flex-col items-center text-gray-700 hover:text-pink-600 cursor-pointer transition-colors relative p-2">
                  <Heart className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium hidden md:block">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                      {wishlistItems.length}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center text-gray-700 hover:text-pink-600 cursor-pointer transition-colors relative p-2"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <span className="text-xs mt-1 font-medium hidden md:block">Bag</span>
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center p-0 text-[10px]">
                    {cartCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden text-gray-700 hover:text-pink-600 p-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="font-semibold text-lg text-gray-800">Menu</h2>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto">
                      <div className="p-4 space-y-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-medium text-sm py-3 px-3 rounded-md transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name.toUpperCase()}
                          </Link>
                        ))}
                      </div>

                      {/* User Actions */}
                      <div className="border-t border-gray-200 p-4 space-y-1">
                        <Button
                          variant="ghost"
                          className="flex items-center space-x-3 text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors py-3 px-3 w-full justify-start rounded-md"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                        >
                          <User className="h-4 w-4" />
                          <span>Login / Register</span>
                        </Button>
                        <div className="flex items-center space-x-3 text-gray-800 hover:bg-pink-50 hover:text-pink-600 font-medium cursor-pointer transition-colors py-3 px-3 rounded-md">
                          <Heart className="h-4 w-4" />
                          <span>Wishlist ({wishlistItems.length})</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-xs text-gray-500 text-center">
                        © 2025 Hednor. All rights reserved.
                      </p>
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
      
      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}

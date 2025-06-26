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
      <header className="bg-gradient-to-r from-yellow-50/80 via-amber-50/90 to-yellow-50/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-amber-200/50">
        {/* Top Banner */}
        <div className="bg-hednor-gold text-hednor-dark text-center py-2 text-sm font-medium">
          <span>Free Shipping on Orders Above ₹1999 | Use Code: FREESHIP</span>
        </div>

        {/* Main Navigation */}
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src={hednorLogoPath} 
                alt="Hednor" 
                className="w-20 h-20 object-contain filter brightness-110 contrast-110"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-hednor-gold font-medium transition-colors flex items-center space-x-1"
                  >
                    <span>{item.name}</span>
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-hednor-gold hover:text-hednor-dark transition-colors"
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

              {/* Mobile Login Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-700 hover:text-hednor-gold"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Desktop User Actions */}
              <div className="hidden md:flex items-center space-x-6">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="flex flex-col items-center text-gray-700 hover:text-hednor-gold cursor-pointer transition-colors"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs mt-1">Login</span>
                </Button>
                
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
                      <div key={item.name} className="space-y-2">
                        <Link
                          href={item.href}
                          className="text-gray-700 hover:text-hednor-gold font-medium transition-colors py-2 flex items-center justify-between"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                        <div className="pl-4 space-y-1">
                          {item.submenu.slice(0, 4).map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block text-sm text-gray-600 hover:text-hednor-gold transition-colors py-1"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 mt-8">
                      <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-700 hover:text-hednor-gold font-medium transition-colors py-2 w-full justify-start"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsAuthModalOpen(true);
                        }}
                      >
                        <User className="h-5 w-5" />
                        <span>Login / Register</span>
                      </Button>
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
      
      {/* Auth Modal */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </>
  );
}

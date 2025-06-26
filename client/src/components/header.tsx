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
      { name: "Topwear", href: "/products?category=men&subcategory=topwear", isCategory: true },
      { name: "T-Shirts", href: "/products?category=men&subcategory=tshirts" },
      { name: "Casual Shirts", href: "/products?category=men&subcategory=casual-shirts" },
      { name: "Formal Shirts", href: "/products?category=men&subcategory=formal-shirts" },
      { name: "Sweatshirts", href: "/products?category=men&subcategory=sweatshirts" },
      { name: "Sweaters", href: "/products?category=men&subcategory=sweaters" },
      { name: "Jackets", href: "/products?category=men&subcategory=jackets" },
      { name: "Blazers & Coats", href: "/products?category=men&subcategory=blazers-coats" },
      { name: "Suits", href: "/products?category=men&subcategory=suits" },
      { name: "Rain Jackets", href: "/products?category=men&subcategory=rain-jackets" },
      { name: "Indian & Festive Wear", href: "/products?category=men&subcategory=indian-festive", isCategory: true },
      { name: "Kurtas & Kurta Sets", href: "/products?category=men&subcategory=kurtas" },
      { name: "Sherwanis", href: "/products?category=men&subcategory=sherwanis" },
      { name: "Nehru Jackets", href: "/products?category=men&subcategory=nehru-jackets" },
      { name: "Dhotis", href: "/products?category=men&subcategory=dhotis" },
      { name: "Bottomwear", href: "/products?category=men&subcategory=bottomwear", isCategory: true },
      { name: "Jeans", href: "/products?category=men&subcategory=jeans" },
      { name: "Casual Trousers", href: "/products?category=men&subcategory=casual-trousers" },
      { name: "Formal Trousers", href: "/products?category=men&subcategory=formal-trousers" },
      { name: "Shorts", href: "/products?category=men&subcategory=shorts" },
      { name: "Track Pants & Joggers", href: "/products?category=men&subcategory=track-pants" },
      { name: "Innerwear & Sleepwear", href: "/products?category=men&subcategory=innerwear", isCategory: true },
      { name: "Briefs & Trunks", href: "/products?category=men&subcategory=briefs-trunks" },
      { name: "Boxers", href: "/products?category=men&subcategory=boxers" },
      { name: "Vests", href: "/products?category=men&subcategory=vests" },
      { name: "Sleepwear & Loungewear", href: "/products?category=men&subcategory=sleepwear" },
      { name: "Thermals", href: "/products?category=men&subcategory=thermals" },
      { name: "Plus Size", href: "/products?category=men&subcategory=plus-size" },
      { name: "Footwear", href: "/products?category=men&subcategory=footwear", isCategory: true },
      { name: "Casual Shoes", href: "/products?category=men&subcategory=casual-shoes" },
      { name: "Sports Shoes", href: "/products?category=men&subcategory=sports-shoes" },
      { name: "Formal Shoes", href: "/products?category=men&subcategory=formal-shoes" },
      { name: "Sneakers", href: "/products?category=men&subcategory=sneakers" },
      { name: "Sandals & Floaters", href: "/products?category=men&subcategory=sandals" },
      { name: "Flip Flops", href: "/products?category=men&subcategory=flip-flops" },
      { name: "Socks", href: "/products?category=men&subcategory=socks" },
      { name: "Personal Care & Grooming", href: "/products?category=men&subcategory=grooming", isCategory: true },
      { name: "Sunglasses & Frames", href: "/products?category=men&subcategory=sunglasses" },
      { name: "Watches", href: "/products?category=men&subcategory=watches" },
      { name: "Fashion Accessories", href: "/products?category=men&subcategory=accessories", isCategory: true },
      { name: "Wallets", href: "/products?category=men&subcategory=wallets" },
      { name: "Belts", href: "/products?category=men&subcategory=belts" },
      { name: "Perfumes & Body Mists", href: "/products?category=men&subcategory=perfumes" },
      { name: "Trimmers", href: "/products?category=men&subcategory=trimmers" },
      { name: "Deodorants", href: "/products?category=men&subcategory=deodorants" },
    ]
  },
  { 
    name: "Women", 
    href: "/products?category=women",
    submenu: [
      { name: "Indian & Fusion Wear", href: "/products?category=women&subcategory=indian-fusion", isCategory: true },
      { name: "Kurtas & Suits", href: "/products?category=women&subcategory=kurtas-suits" },
      { name: "Kurtis, Tunics & Tops", href: "/products?category=women&subcategory=kurtis-tunics" },
      { name: "Sarees", href: "/products?category=women&subcategory=sarees" },
      { name: "Ethnic Wear", href: "/products?category=women&subcategory=ethnic" },
      { name: "Leggings, Salwars & Churidars", href: "/products?category=women&subcategory=leggings-salwars" },
      { name: "Skirts & Palazzos", href: "/products?category=women&subcategory=skirts-palazzos" },
      { name: "Dress Materials", href: "/products?category=women&subcategory=dress-materials" },
      { name: "Lehenga Cholis", href: "/products?category=women&subcategory=lehenga-cholis" },
      { name: "Dupattas & Shawls", href: "/products?category=women&subcategory=dupattas-shawls" },
      { name: "Western Wear", href: "/products?category=women&subcategory=western", isCategory: true },
      { name: "Dresses", href: "/products?category=women&subcategory=dresses" },
      { name: "Tops", href: "/products?category=women&subcategory=tops" },
      { name: "T-shirts", href: "/products?category=women&subcategory=tshirts" },
      { name: "Jeans", href: "/products?category=women&subcategory=jeans" },
      { name: "Trousers & Capris", href: "/products?category=women&subcategory=trousers-capris" },
      { name: "Shorts & Skirts", href: "/products?category=women&subcategory=shorts-skirts" },
      { name: "Co-ords", href: "/products?category=women&subcategory=coords" },
      { name: "Playsuits", href: "/products?category=women&subcategory=playsuits" },
      { name: "Jumpsuits", href: "/products?category=women&subcategory=jumpsuits" },
      { name: "Shrugs", href: "/products?category=women&subcategory=shrugs" },
      { name: "Sweaters & Sweatshirts", href: "/products?category=women&subcategory=sweaters" },
      { name: "Jackets & Coats", href: "/products?category=women&subcategory=jackets-coats" },
      { name: "Blazers & Waistcoats", href: "/products?category=women&subcategory=blazers" },
      { name: "Plus Size", href: "/products?category=women&subcategory=plus-size" },
      { name: "Maternity", href: "/products?category=women&subcategory=maternity" },
      { name: "Footwear", href: "/products?category=women&subcategory=footwear", isCategory: true },
      { name: "Flats", href: "/products?category=women&subcategory=flats" },
      { name: "Casual Shoes", href: "/products?category=women&subcategory=casual-shoes" },
      { name: "Heels", href: "/products?category=women&subcategory=heels" },
      { name: "Boots", href: "/products?category=women&subcategory=boots" },
      { name: "Sports Shoes & Floaters", href: "/products?category=women&subcategory=sports-shoes" },
      { name: "Lingerie & Sleepwear", href: "/products?category=women&subcategory=lingerie", isCategory: true },
      { name: "Bra", href: "/products?category=women&subcategory=bra" },
      { name: "Briefs", href: "/products?category=women&subcategory=briefs" },
      { name: "Shapewear", href: "/products?category=women&subcategory=shapewear" },
      { name: "Sleepwear & Loungewear", href: "/products?category=women&subcategory=sleepwear" },
      { name: "Swimwear", href: "/products?category=women&subcategory=swimwear" },
      { name: "Beauty & Personal Care", href: "/products?category=women&subcategory=beauty", isCategory: true },
      { name: "Makeup", href: "/products?category=women&subcategory=makeup" },
      { name: "Skincare", href: "/products?category=women&subcategory=skincare" },
      { name: "Premium Beauty", href: "/products?category=women&subcategory=premium-beauty" },
      { name: "Lipsticks", href: "/products?category=women&subcategory=lipsticks" },
      { name: "Fragrances", href: "/products?category=women&subcategory=fragrances" },
      { name: "Jewellery", href: "/products?category=women&subcategory=jewellery", isCategory: true },
      { name: "Fashion Jewellery", href: "/products?category=women&subcategory=fashion-jewellery" },
      { name: "Fine Jewellery", href: "/products?category=women&subcategory=fine-jewellery" },
      { name: "Earrings", href: "/products?category=women&subcategory=earrings" },
      { name: "Handbags, Bags & Wallets", href: "/products?category=women&subcategory=handbags" },
    ]
  },
  { 
    name: "Kids", 
    href: "/products?category=kids",
    submenu: [
      { name: "Boys Clothing", href: "/products?category=kids&subcategory=boys", isCategory: true },
      { name: "T-Shirts", href: "/products?category=kids&subcategory=boys-tshirts" },
      { name: "Shirts", href: "/products?category=kids&subcategory=boys-shirts" },
      { name: "Shorts", href: "/products?category=kids&subcategory=boys-shorts" },
      { name: "Jeans", href: "/products?category=kids&subcategory=boys-jeans" },
      { name: "Trousers", href: "/products?category=kids&subcategory=boys-trousers" },
      { name: "Boys Clothing Sets", href: "/products?category=kids&subcategory=boys-sets" },
      { name: "Ethnic Wear", href: "/products?category=kids&subcategory=boys-ethnic" },
      { name: "Track Pants & Pyjamas", href: "/products?category=kids&subcategory=boys-trackpants" },
      { name: "Boys Jackets & Sweatshirts", href: "/products?category=kids&subcategory=boys-jackets" },
      { name: "Party Wear", href: "/products?category=kids&subcategory=boys-party" },
      { name: "Innerwear & Thermals", href: "/products?category=kids&subcategory=boys-innerwear" },
      { name: "Nightwear & Loungewear", href: "/products?category=kids&subcategory=boys-nightwear" },
      { name: "Girls Clothing", href: "/products?category=kids&subcategory=girls", isCategory: true },
      { name: "Dresses", href: "/products?category=kids&subcategory=girls-dresses" },
      { name: "Tops", href: "/products?category=kids&subcategory=girls-tops" },
      { name: "T-shirts", href: "/products?category=kids&subcategory=girls-tshirts" },
      { name: "Girls Clothing Sets", href: "/products?category=kids&subcategory=girls-sets" },
      { name: "Lehenga choli", href: "/products?category=kids&subcategory=girls-lehenga" },
      { name: "Kurta Sets", href: "/products?category=kids&subcategory=girls-kurta" },
      { name: "Party wear", href: "/products?category=kids&subcategory=girls-party" },
      { name: "Dungarees & Jumpsuits", href: "/products?category=kids&subcategory=girls-dungarees" },
      { name: "Skirts & shorts", href: "/products?category=kids&subcategory=girls-skirts" },
      { name: "Tights & Leggings", href: "/products?category=kids&subcategory=girls-tights" },
      { name: "Jeans, Trousers & Capris", href: "/products?category=kids&subcategory=girls-jeans" },
      { name: "Girls Jackets & Sweatshirts", href: "/products?category=kids&subcategory=girls-jackets" },
      { name: "Footwear", href: "/products?category=kids&subcategory=footwear", isCategory: true },
      { name: "Casual Shoes", href: "/products?category=kids&subcategory=casual-shoes" },
      { name: "Flipflops", href: "/products?category=kids&subcategory=flipflops" },
      { name: "Sports Shoes", href: "/products?category=kids&subcategory=sports-shoes" },
      { name: "Flats", href: "/products?category=kids&subcategory=flats" },
      { name: "Sandals", href: "/products?category=kids&subcategory=sandals" },
      { name: "Heels", href: "/products?category=kids&subcategory=heels" },
      { name: "School Shoes", href: "/products?category=kids&subcategory=school-shoes" },
      { name: "Socks", href: "/products?category=kids&subcategory=socks" },
      { name: "Toys & Games", href: "/products?category=kids&subcategory=toys", isCategory: true },
      { name: "Learning & Development", href: "/products?category=kids&subcategory=learning-toys" },
      { name: "Activity Toys", href: "/products?category=kids&subcategory=activity-toys" },
      { name: "Soft Toys", href: "/products?category=kids&subcategory=soft-toys" },
      { name: "Action Figure / Play set", href: "/products?category=kids&subcategory=action-figures" },
      { name: "Infants", href: "/products?category=kids&subcategory=infants", isCategory: true },
      { name: "Bodysuits", href: "/products?category=kids&subcategory=bodysuits" },
      { name: "Rompers & Sleepsuits", href: "/products?category=kids&subcategory=rompers" },
      { name: "Kids Accessories", href: "/products?category=kids&subcategory=accessories", isCategory: true },
      { name: "Bags & Backpacks", href: "/products?category=kids&subcategory=bags" },
      { name: "Watches", href: "/products?category=kids&subcategory=watches" },
      { name: "Jewellery & Hair accessory", href: "/products?category=kids&subcategory=jewellery" },
      { name: "Sunglasses", href: "/products?category=kids&subcategory=sunglasses" },
      { name: "Caps & Hats", href: "/products?category=kids&subcategory=caps" },
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
      <header className="bg-gray-100 shadow-sm sticky top-0 z-40 border-b border-gray-300">
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
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-96 overflow-y-auto">
                    <div className="py-3">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            subItem.isCategory 
                              ? "font-semibold text-gray-800 bg-gray-50 border-b border-gray-200 hover:bg-gray-100" 
                              : "text-gray-600 hover:bg-pink-50 hover:text-pink-600 pl-6"
                          }`}
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

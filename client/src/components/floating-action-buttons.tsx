import React, { useState } from 'react';
import { Phone, MessageCircle, Search, Menu, User, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { useLocation } from 'wouter';

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const [location, setLocation] = useLocation();
  const { cartCount, wishlistItems, setCartOpen } = useStore();
  const { user, isAuthenticated } = useAuthStore();

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {/* Right Side - Support Buttons */}
      <div className={`fixed bottom-6 right-4 z-50 flex flex-col gap-3 md:hidden ${isVisible ? '' : 'hidden'}`}>
        {/* WhatsApp Support */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300"
          onClick={() => window.open('https://wa.me/1234567890', '_blank')}
        >
          <MessageCircle className="h-5 w-5" />
        </Button>

        {/* Call Support */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
          onClick={() => window.open('tel:+911234567890', '_blank')}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>

      {/* Left Side - Quick Access Icons */}
      <div className={`fixed bottom-6 left-4 z-50 flex flex-col gap-3 md:hidden ${isVisible ? '' : 'hidden'}`}>
        {/* Search */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-hednor-gold hover:bg-yellow-500 text-hednor-dark shadow-lg transition-all duration-300"
          onClick={() => setLocation('/products')}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Wishlist */}
        <div className="relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-300"
            onClick={() => setLocation('/wishlist')}
          >
            <Heart className="h-5 w-5" />
          </Button>
          {wishlistItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-white text-red-500 text-xs rounded-full w-6 h-6 flex items-center justify-center p-0 border-2 border-red-500">
              {wishlistItems.length}
            </Badge>
          )}
        </div>

        {/* Cart */}
        <div className="relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg transition-all duration-300"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-white text-purple-500 text-xs rounded-full w-6 h-6 flex items-center justify-center p-0 border-2 border-purple-500">
              {cartCount}
            </Badge>
          )}
        </div>

        {/* Profile */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-gray-700 hover:bg-gray-800 text-white shadow-lg transition-all duration-300"
          onClick={() => {
            if (isAuthenticated && user) {
              setLocation('/profile');
            } else {
              setLocation('/products');
            }
          }}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}
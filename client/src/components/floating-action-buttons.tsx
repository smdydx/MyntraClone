import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, Phone, MessageCircle, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false);
  const { cartCount, wishlistItems } = useStore();

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Quick Actions */}
      <div className="flex flex-col gap-2">
        {/* WhatsApp Support */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          onClick={() => window.open('https://wa.me/1234567890', '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        {/* Call Support */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => window.open('tel:+911234567890', '_blank')}
        >
          <Phone className="h-6 w-6" />
        </Button>

        {/* Quick Search */}
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Search className="h-6 w-6" />
        </Button>

        {/* Wishlist */}
        <div className="relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="h-6 w-6" />
          </Button>
          {wishlistItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center p-0 animate-bounce">
              {wishlistItems.length}
            </Badge>
          )}
        </div>

        {/* Cart */}
        <div className="relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-hednor-gold hover:bg-yellow-500 text-hednor-dark shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <ShoppingCart className="h-6 w-6" />
          </Button>
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center p-0 animate-bounce">
              {cartCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Back to Top */}
      {isVisible && (
        <Button
          size="icon"
          onClick={scrollToTop}
          className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
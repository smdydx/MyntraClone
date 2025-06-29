import React, { useState } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${isVisible ? '' : 'hidden'}`}>
      {/* WhatsApp Support */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300"
        onClick={() => window.open('https://wa.me/1234567890', '_blank')}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Call Support */}
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
        onClick={() => window.open('tel:+911234567890', '_blank')}
      >
        <Phone className="h-6 w-6" />
      </Button>
    </div>
  );
}
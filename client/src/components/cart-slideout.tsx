
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { Link } from 'wouter';

interface CartSlideoutProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSlideout: React.FC<CartSlideoutProps> = ({ isOpen, onClose }) => {
  const { cartItems = [], removeFromCart, updateCartQuantity, cartTotal, cartCount } = useStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString('en-IN')}`;
  };

  const calculateDiscount = (originalPrice: string, salePrice?: string) => {
    if (!salePrice) return 0;
    const original = parseFloat(originalPrice);
    const sale = parseFloat(salePrice);
    return Math.round(((original - sale) / original) * 100);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Cart Slideout */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-hednor-gold" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Shopping Bag</h2>
            {cartCount > 0 && (
              <Badge variant="secondary" className="bg-hednor-gold text-hednor-dark text-xs">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your bag is empty</h3>
              <p className="text-sm text-gray-500 mb-6">Add some items to get started</p>
              <Button 
                onClick={onClose}
                className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex space-x-2 sm:space-x-3">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-1 sm:space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 pr-2">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                            {item.brand}
                          </p>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                            {item.name}
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.productId)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Size and Color */}
                      {(item.size || item.color) && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 text-xs text-gray-600">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      )}

                      {/* Price and Quantity */}
                      <div className="flex items-end justify-between gap-2">
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center flex-wrap gap-1">
                            {item.salePrice ? (
                              <>
                                <span className="font-semibold text-gray-900 text-sm">
                                  {formatPrice(item.salePrice)}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(item.price)}
                                </span>
                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                  {calculateDiscount(item.price, item.salePrice)}% OFF
                                </Badge>
                              </>
                            ) : (
                              <span className="font-semibold text-gray-900 text-sm">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-1 border border-gray-300 rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium px-1 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Move to Wishlist */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 hover:text-hednor-gold p-0 h-auto justify-start"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        Move to Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Only show when cart has items */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-3 sm:p-4 space-y-3 sm:space-y-4">
            {/* Price Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-hednor-gold">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link href="/cart" className="block w-full">
                <Button 
                  className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold py-2.5 sm:py-3 text-sm sm:text-base"
                  onClick={onClose}
                >
                  View Bag
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark py-2.5 sm:py-3 text-sm sm:text-base"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center space-x-3 sm:space-x-4 text-xs text-gray-500 pt-1 sm:pt-2">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Secure Checkout
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                Easy Returns
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSlideout;

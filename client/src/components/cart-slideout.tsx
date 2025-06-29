
import { useEffect } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useStore } from "@/lib/store";

export default function CartSlideout() {
  const [, setLocation] = useLocation();
  const {
    isCartOpen,
    setCartOpen,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  } = useStore();

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[400px] md:w-[450px] max-w-[100vw] flex flex-col p-0 h-full"
      >
        {/* Fixed Header */}
        <SheetHeader className="px-4 py-4 border-b border-gray-200 bg-white">
          <SheetTitle className="flex items-center justify-between text-lg font-semibold">
            <span>Shopping Bag</span>
            <Badge variant="secondary" className="bg-hednor-gold text-hednor-dark">{cartCount} items</Badge>
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            View and manage items in your shopping bag
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Your bag is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Add some items to get started</p>
              <Button 
                onClick={() => setCartOpen(false)}
                className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="font-medium text-sm sm:text-base line-clamp-2">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-600 mb-2">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ", "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    
                    {/* Price */}
                    <div className="flex items-center mb-3">
                      {item.salePrice ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm sm:text-base">
                            {formatPrice(item.salePrice)}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-semibold text-sm sm:text-base">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:bg-gray-100"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:bg-gray-100"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fixed Footer with Total and Checkout */}
            <div className="border-t border-gray-200 bg-white p-4 space-y-4">
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                  <span className="font-medium">{formatPrice(cartTotal.toString())}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg text-hednor-gold">
                    {formatPrice(cartTotal.toString())}
                  </span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Button 
                className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold py-3 text-base rounded-lg"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
              
              {/* Continue Shopping Link */}
              <Button 
                variant="outline"
                className="w-full border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark py-2 text-sm"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

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
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Bag
            <Badge variant="secondary">{cartCount} items</Badge>
          </SheetTitle>
          <SheetDescription>
            View and manage items in your shopping bag
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Your bag is empty</h3>
              <p className="text-gray-500 text-sm mb-4">Add some items to get started</p>
              <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ", "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        {item.salePrice ? (
                          <>
                            <span className="font-semibold text-sm">
                              {formatPrice(item.salePrice)}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-sm">
                            {formatPrice(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-6 h-6"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon" 
                          className="w-6 h-6 text-sale-red hover:text-sale-red hover:bg-red-50"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  {formatPrice(cartTotal.toString())}
                </span>
              </div>
              <Button 
                className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
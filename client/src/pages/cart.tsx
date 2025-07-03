
import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  Tag,
  Gift,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function Cart() {
  const [, setLocation] = useLocation();
  const { cartItems = [], removeFromCart, updateCartQuantity, cartTotal, cartCount } = useStore();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [savedForLater, setSavedForLater] = useState<string[]>([]);

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

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleSaveForLater = (productId: string) => {
    setSavedForLater([...savedForLater, productId]);
    removeFromCart(productId);
    toast({
      title: "Saved for Later",
      description: "Item moved to saved for later",
    });
  };

  const handleMoveToCart = (productId: string) => {
    setSavedForLater(savedForLater.filter(id => id !== productId));
    toast({
      title: "Moved to Cart",
      description: "Item moved back to cart",
    });
  };

  const applyPromoCode = () => {
    // Mock promo codes
    const promoCodes = {
      'SAVE10': 10,
      'FIRST20': 20,
      'WELCOME15': 15
    };

    if (promoCodes[promoCode as keyof typeof promoCodes]) {
      const discount = promoCodes[promoCode as keyof typeof promoCodes];
      setAppliedPromo(promoCode);
      setPromoDiscount((cartTotal * discount) / 100);
      toast({
        title: "Promo Applied!",
        description: `${discount}% discount applied successfully`,
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "Please enter a valid promo code",
        variant: "destructive"
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo('');
    setPromoDiscount(0);
    setPromoCode('');
  };

  const shippingCost = cartTotal > 1000 ? 0 : 99;
  const finalTotal = cartTotal - promoDiscount + shippingCost;

  const proceedToCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
        variant: "destructive"
      });
      return;
    }
    setLocation('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/products')}
            className="p-0 h-auto text-gray-600 hover:text-hednor-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Button>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Bag</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your bag is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't made your choice yet</p>
            <Button 
              onClick={() => setLocation('/products')}
              className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 px-8 py-3"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Shopping Bag ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </h1>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 text-green-700">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-green-700">
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm font-medium">Easy Returns</span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.productId} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                {item.brand}
                              </p>
                              <h3 className="font-medium text-gray-900 line-clamp-2">
                                {item.name}
                              </h3>
                              {(item.size || item.color) && (
                                <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.color && <span>Color: {item.color}</span>}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price and Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.salePrice ? (
                                <>
                                  <span className="font-semibold text-lg text-gray-900">
                                    {formatPrice(item.salePrice)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(item.price)}
                                  </span>
                                  <Badge variant="destructive" className="text-xs">
                                    {calculateDiscount(item.price, item.salePrice)}% OFF
                                  </Badge>
                                </>
                              ) : (
                                <span className="font-semibold text-lg text-gray-900">
                                  {formatPrice(item.price)}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center border border-gray-300 rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium px-3 min-w-[40px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveForLater(item.productId)}
                              className="text-sm text-gray-600 hover:text-hednor-gold p-0 h-auto"
                            >
                              <Heart className="w-4 h-4 mr-1" />
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Saved for Later */}
              {savedForLater.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Saved for Later ({savedForLater.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-gray-600">Items saved for later will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Promo Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Tag className="w-5 h-5 mr-2" />
                      Apply Promo Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!appliedPromo ? (
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="flex-1"
                        />
                        <Button 
                          onClick={applyPromoCode}
                          variant="outline"
                          className="border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark"
                        >
                          Apply
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Percent className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                        </div>
                        <Button
                          onClick={removePromoCode}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-1">Available Offers:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• SAVE10 - 10% off</li>
                        <li>• FIRST20 - 20% off for new users</li>
                        <li>• WELCOME15 - 15% off</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Price Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Total MRP ({cartCount} items)</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Discount ({appliedPromo})</span>
                        <span>-{formatPrice(promoDiscount)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span className={shippingCost === 0 ? "text-green-600" : ""}>
                        {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                      </span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-hednor-gold">{formatPrice(finalTotal)}</span>
                    </div>

                    {finalTotal < cartTotal && (
                      <div className="text-sm text-green-600 font-medium">
                        You will save {formatPrice(cartTotal - finalTotal)} on this order
                      </div>
                    )}

                    <Button
                      onClick={proceedToCheckout}
                      className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold py-3 text-base"
                      size="lg"
                    >
                      Place Order
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {!isAuthenticated && (
                      <p className="text-xs text-gray-500 text-center">
                        Please login to proceed with checkout
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Gift Options */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Gift className="w-5 h-5 text-hednor-gold" />
                      <div>
                        <p className="text-sm font-medium">Add Gift Wrap</p>
                        <p className="text-xs text-gray-500">Make it special for ₹49</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

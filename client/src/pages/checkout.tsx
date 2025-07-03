import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CreditCard, Smartphone, Banknote, Wallet, Truck, Shield, ArrowLeft, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, clearCart } = useStore();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });
  const [billingAddress, setBillingAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });
  const [upiId, setUpiId] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => {
    if (cartCount === 0) {
      setLocation("/products");
      return;
    }
    if (!isAuthenticated) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isAuthenticated, cartCount, setLocation]);

  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || ""
      }));
      setBillingAddress(prev => ({
        ...prev,
        fullName: `${user.firstName} ${user.lastName}`,
        phone: user.phone || ""
      }));
    }
  }, [user]);

  const formatPrice = (price: string | number) => {
    return `₹${parseFloat(price.toString()).toLocaleString('en-IN')}`;
  };

  const shippingCost = cartTotal > 1000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const codFee = paymentMethod === "cod" ? 40 : 0;
  const finalAmount = cartTotal + shippingCost + tax + codFee;

  const orderData = {
    items: cartItems,
    totalAmount: cartTotal,
    shippingAmount: shippingCost,
    taxAmount: tax,
    finalAmount,
    shippingAddress: sameAsShipping ? shippingAddress : shippingAddress,
    billingAddress: sameAsShipping ? shippingAddress : billingAddress
  };

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessing(true);

      if (!window.Razorpay) {
        toast({
          title: "Payment Gateway Error",
          description: "Payment gateway is not available. Please refresh and try again.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ amount: finalAmount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to create order");
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Hednor",
        description: "Purchase from Hednor Fashion Store",
        order_id: data.orderId,
        timeout: 300,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/payment/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              clearCart();
              toast({
                title: "Payment Successful!",
                description: `Order ${verifyData.orderId} has been placed successfully.`
              });
              setLocation(`/order-confirmation/${verifyData.orderId}`);
            } else {
              toast({
                title: "Payment Failed",
                description: "Payment verification failed. Please try again.",
                variant: "destructive"
              });
            }
          } catch (error) {
            toast({
              title: "Payment Failed",
              description: "Something went wrong. Please try again.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: user?.firstName + " " + user?.lastName,
          email: user?.email,
          contact: shippingAddress.phone
        },
        theme: {
          color: "#F59E0B"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGPayPayment = async () => {
    try {
      setIsProcessing(true);
  
      const response = await fetch("/api/payment/gpay/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          orderData
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        clearCart();
        toast({
          title: "Google Pay Payment Initiated",
          description: data.message
        });
        setLocation(`/order-confirmation/${data.orderId}`);
      } else {
        toast({
          title: "Payment Failed",
          description: "Google Pay payment failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate Google Pay payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePhonePePayment = async () => {
    try {
      setIsProcessing(true);
  
      const response = await fetch("/api/payment/phonepe/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          orderData
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        clearCart();
        toast({
          title: "PhonePe Payment Initiated",
          description: data.message
        });
        setLocation(`/order-confirmation/${data.orderId}`);
      } else {
        toast({
          title: "Payment Failed",
          description: "PhonePe payment failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate PhonePe payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaytmPayment = async () => {
    try {
      setIsProcessing(true);
  
      const response = await fetch("/api/payment/paytm/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          orderData
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        clearCart();
        toast({
          title: "Paytm Payment Initiated",
          description: data.message
        });
        setLocation(`/order-confirmation/${data.orderId}`);
      } else {
        toast({
          title: "Payment Failed",
          description: "Paytm payment failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate Paytm payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUPIPayment = async () => {
    try {
      setIsProcessing(true);
  
      const response = await fetch("/api/payment/upi/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          upiId,
          orderData
        })
      });
  
      const data = await response.json();
  
      if (data.success) {
        clearCart();
        toast({
          title: "UPI Payment Initiated",
          description: data.message
        });
        setLocation(`/order-confirmation/${data.orderId}`);
      } else {
        toast({
          title: "Payment Failed",
          description: "UPI payment failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate UPI payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCODPayment = async () => {
    try {
      setIsProcessing(true);
  
      const response = await fetch("/api/payment/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ orderData })
      });
  
      const data = await response.json();
  
      if (data.success) {
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: `Order ${data.orderId} has been placed. Pay on delivery.`
        });
        setLocation(`/order-confirmation/${data.orderId}`);
      } else {
        toast({
          title: "Order Failed",
          description: "Failed to place order. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      toast({
        title: "Address Required",
        description: "Please fill in all required address fields.",
        variant: "destructive"
      });
      return;
    }

    switch (paymentMethod) {
      case "razorpay":
        handleRazorpayPayment();
        break;
      case "gpay":
        handleGPayPayment();
        break;
      case "phonepe":
        handlePhonePePayment();
        break;
      case "paytm":
        handlePaytmPayment();
        break;
      case "upi":
        if (!upiId) {
          toast({
            title: "UPI ID Required",
            description: "Please enter your UPI ID.",
            variant: "destructive"
          });
          return;
        }
        handleUPIPayment();
        break;
      case "cod":
        handleCODPayment();
        break;
      default:
        toast({
          title: "Payment Method Not Available",
          description: "Selected payment method is not available yet.",
          variant: "destructive"
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/products")}
            className="p-0 h-auto hover:text-hednor-gold"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Continue Shopping
          </Button>
          <span>/</span>
          <span>Checkout</span>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-hednor-gold to-yellow-500 text-white rounded-t-lg">
                <CardTitle className="text-xl">Sign in to Continue</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-8">
                <div className="w-16 h-16 bg-hednor-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-hednor-gold" />
                </div>
                <p className="text-gray-600 mb-6">Please sign in to proceed with your order</p>
                <Button 
                  onClick={() => {
                    const authModal = document.querySelector('[data-auth-modal]') as HTMLElement;
                    if (authModal) {
                      authModal.click();
                    }
                  }}
                  className="w-full bg-hednor-gold text-white hover:bg-yellow-500 font-medium py-3"
                  size="lg"
                >
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section - Address & Payment */}
            <div className="lg:col-span-8 space-y-6">
              {/* Delivery Address */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                    <div className="w-8 h-8 bg-hednor-gold text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      1
                    </div>
                    <MapPin className="w-5 h-5 mr-2 text-hednor-gold" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        className="mt-1 border-gray-300 focus:border-hednor-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Mobile Number</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="mt-1 border-gray-300 focus:border-hednor-gold"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-700">Address</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                      placeholder="House No., Building, Street, Area"
                      className="mt-1 border-gray-300 focus:border-hednor-gold"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        placeholder="City"
                        className="mt-1 border-gray-300 focus:border-hednor-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        placeholder="State"
                        className="mt-1 border-gray-300 focus:border-hednor-gold"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        placeholder="6-digit pincode"
                        className="mt-1 border-gray-300 focus:border-hednor-gold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Options */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                    <div className="w-8 h-8 bg-hednor-gold text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                      2
                    </div>
                    <CreditCard className="w-5 h-5 mr-2 text-hednor-gold" />
                    Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    {/* Razorpay */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="razorpay" id="razorpay" className="text-hednor-gold" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                              <div>
                                <div className="font-medium text-gray-900">Credit/Debit Card</div>
                                <div className="text-sm text-gray-500">Visa, MasterCard, RuPay</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Secure
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* UPI */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="upi" id="upi" className="text-hednor-gold" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className="w-5 h-5 text-orange-600 mr-3" />
                              <div>
                                <div className="font-medium text-gray-900">UPI</div>
                                <div className="text-sm text-gray-500">Pay using UPI ID</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Instant
                            </Badge>
                          </div>
                        </Label>
                      </div>
                      {paymentMethod === "upi" && (
                        <div className="mt-3 pl-8">
                          <Input
                            placeholder="Enter your UPI ID (e.g., yourname@paytm)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="border-gray-300 focus:border-hednor-gold"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cash on Delivery */}
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="cod" id="cod" className="text-hednor-gold" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Banknote className="w-5 h-5 text-green-600 mr-3" />
                              <div>
                                <div className="font-medium text-gray-900">Cash on Delivery</div>
                                <div className="text-sm text-gray-500">Pay when you receive</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              +₹40 COD Fee
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Section - Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Order Items */}
                    <div className="max-h-64 overflow-y-auto border-b">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center p-4 border-b last:border-b-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-md"
                          />
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(item.salePrice || item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Details */}
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Bag total</span>
                        <span className="font-medium">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                          {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">GST (18%)</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                      </div>
                      {paymentMethod === "cod" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">COD charges</span>
                          <span className="font-medium">{formatPrice(40)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-base font-bold">
                        <span>Total Amount</span>
                        <span className="text-hednor-gold">{formatPrice(finalAmount)}</span>
                      </div>

                      {shippingCost === 0 && (
                        <div className="flex items-center text-green-600 text-xs bg-green-50 p-2 rounded">
                          <Shield className="w-4 h-4 mr-1" />
                          Free shipping on orders above ₹1,000
                        </div>
                      )}
                    </div>

                    {/* Place Order Button */}
                    <div className="p-4 pt-0">
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-hednor-gold text-white hover:bg-yellow-500 font-semibold py-3 text-base"
                        size="lg"
                      >
                        {isProcessing ? "Processing..." : 
                         paymentMethod === "cod" ? "Place Order" : "Continue"}
                      </Button>

                      <p className="text-xs text-gray-500 text-center mt-3">
                        By placing this order, you agree to our 
                        <span className="text-hednor-gold cursor-pointer"> Terms & Conditions</span>
                      </p>
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
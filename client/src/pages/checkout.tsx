
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CreditCard, Smartphone, Banknote, Wallet, Truck, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
    if (cartCount === 0) {
      setLocation("/products");
      return;
    }
    
    // Load Razorpay script
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
  const finalAmount = cartTotal + shippingCost + tax;

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

      // Create Razorpay order
      const response = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ amount: finalAmount })
      });

      if (!response.ok) throw new Error("Failed to create order");

      const data = await response.json();

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Hednor",
        description: "Purchase from Hednor Fashion Store",
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/cart")}
            className="p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address and Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                    placeholder="House no, Building name, Street"
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({...shippingAddress, addressLine2: e.target.value})}
                    placeholder="Landmark, Area"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Razorpay */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <div className="flex-1">
                        <Label htmlFor="razorpay" className="flex items-center cursor-pointer">
                          <CreditCard className="w-5 h-5 mr-2" />
                          <div>
                            <div className="font-medium">Credit/Debit Card, Net Banking</div>
                            <div className="text-sm text-gray-500">Powered by Razorpay</div>
                          </div>
                        </Label>
                      </div>
                      <Badge variant="secondary">Secure</Badge>
                    </div>

                    {/* UPI */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <div className="flex-1">
                        <Label htmlFor="upi" className="flex items-center cursor-pointer">
                          <Smartphone className="w-5 h-5 mr-2" />
                          <div>
                            <div className="font-medium">UPI Payment</div>
                            <div className="text-sm text-gray-500">Pay using UPI ID</div>
                          </div>
                        </Label>
                        {paymentMethod === "upi" && (
                          <div className="mt-3">
                            <Input
                              placeholder="Enter UPI ID (e.g., yourname@paytm)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary">Instant</Badge>
                    </div>

                    {/* Cash on Delivery */}
                    <div className="flex items-center space-x-3 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <div className="flex-1">
                        <Label htmlFor="cod" className="flex items-center cursor-pointer">
                          <Banknote className="w-5 h-5 mr-2" />
                          <div>
                            <div className="font-medium">Cash on Delivery</div>
                            <div className="text-sm text-gray-500">Pay when you receive</div>
                          </div>
                        </Label>
                      </div>
                      <Badge variant="outline">₹40 COD Fee</Badge>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.salePrice || item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                      {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-sm">
                      <span>COD Fee</span>
                      <span>{formatPrice(40)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalAmount + (paymentMethod === "cod" ? 40 : 0))}</span>
                </div>

                {shippingCost === 0 && (
                  <div className="flex items-center text-green-600 text-sm">
                    <Shield className="w-4 h-4 mr-1" />
                    Free shipping on orders above ₹1,000
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : 
                   paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms & Conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

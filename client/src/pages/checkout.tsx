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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
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
    shippingAddress: shippingAddress,
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

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
                "Authorization": `Bearer ${token}`
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
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/gpay/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/phonepe/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/paytm/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/upi/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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
  
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with payment.",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch("/api/payment/cod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
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

  const refreshTokenIfNeeded = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Token expired, try to refresh or redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with payment.",
        variant: "destructive"
      });
      return;
    }

    // Verify token before proceeding
    const isValidToken = await refreshTokenIfNeeded();
    if (!isValidToken) {
      return;
    }

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

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/products")}
            className="p-0 h-auto hover:text-hednor-gold text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden xs:inline">Continue Shopping</span>
            <span className="xs:hidden">Back</span>
          </Button>
          <span>/</span>
          <span>Checkout</span>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-sm sm:max-w-md mx-auto px-2 sm:px-0">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-hednor-gold to-yellow-500 text-white rounded-t-lg p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Sign in to Continue</CardTitle>
              </CardHeader>
              <CardContent className="text-center p-6 sm:p-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-hednor-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-hednor-gold" />
                </div>
                <p className="text-gray-600 mb-6 text-sm sm:text-base">Please sign in to proceed with your order</p>
                <Button 
                  onClick={() => {
                    const authModal = document.querySelector('[data-auth-modal]') as HTMLElement;
                    if (authModal) {
                      authModal.click();
                    }
                  }}
                  className="w-full bg-hednor-gold text-white hover:bg-yellow-500 font-medium py-3 text-sm sm:text-base"
                  size="lg"
                >
                  Sign In to Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
            {/* Left Section - Address & Payment */}
            <div className="xl:col-span-8 space-y-4 sm:space-y-6">
              {/* Delivery Address */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-lg font-semibold text-gray-800">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-hednor-gold text-white rounded-full flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">
                      1
                    </div>
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-hednor-gold" />
                    <span className="text-sm sm:text-base">Delivery Address</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <Label htmlFor="fullName" className="text-xs sm:text-sm font-medium text-gray-700">Full Name</Label>
                      <Input
                        id="fullName"
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                        placeholder="Enter your full name"
                        className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-xs sm:text-sm font-medium text-gray-700">Mobile Number</Label>
                      <Input
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="addressLine1" className="text-xs sm:text-sm font-medium text-gray-700">Address</Label>
                    <Input
                      id="addressLine1"
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({...shippingAddress, addressLine1: e.target.value})}
                      placeholder="House No., Building, Street, Area"
                      className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="city" className="text-xs sm:text-sm font-medium text-gray-700">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        placeholder="City"
                        className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs sm:text-sm font-medium text-gray-700">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        placeholder="State"
                        className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="pincode" className="text-xs sm:text-sm font-medium text-gray-700">Pincode</Label>
                      <Input
                        id="pincode"
                        value={shippingAddress.pincode}
                        onChange={(e) => setShippingAddress({...shippingAddress, pincode: e.target.value})}
                        placeholder="6-digit pincode"
                        className="mt-1 border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Options */}
              <Card className="border-0 shadow-md">
                <CardHeader className="bg-white border-b p-4 sm:p-6">
                  <CardTitle className="flex items-center text-base sm:text-lg font-semibold text-gray-800">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-hednor-gold text-white rounded-full flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm font-bold">
                      2
                    </div>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-hednor-gold" />
                    <span className="text-sm sm:text-base">Payment Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2 sm:space-y-3">
                    {/* Razorpay */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="razorpay" id="razorpay" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Credit/Debit Card</div>
                                <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-1 sm:space-x-2 flex-wrap">
                                  <span>Visa</span>
                                  <span>•</span>
                                  <span>MasterCard</span>
                                  <span className="hidden xs:inline">•</span>
                                  <span className="hidden xs:inline">RuPay</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs flex-shrink-0">
                              <Shield className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                              Secure
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Google Pay */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="gpay" id="gpay" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="gpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 48 48" fill="none">
                                  <path d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" fill="#4285F4"/>
                                  <path d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" fill="#34A853"/>
                                  <path d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" fill="#FBBC05"/>
                                  <path d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" fill="#EA4335"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Google Pay</div>
                                <div className="text-xs sm:text-sm text-gray-500">Quick & secure payment</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                              Instant
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* PhonePe */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="phonepe" id="phonepe" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="phonepe" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93v-4.42c0-.55.45-1 1-1h1v-3c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v3h1c.55 0 1 .45 1 1v4.42c3.95-.49 7-3.85 7-7.93 0-4.41-3.59-8-8-8s-8 3.59-8 8c0 4.08 3.05 7.44 7 7.93z" fill="currentColor"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">PhonePe</div>
                                <div className="text-xs sm:text-sm text-gray-500">Pay via PhonePe wallet</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs flex-shrink-0">
                              Fast
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* Paytm */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="paytm" id="paytm" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="paytm" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Paytm</div>
                                <div className="text-xs sm:text-sm text-gray-500">Pay via Paytm wallet</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs flex-shrink-0">
                              Wallet
                            </Badge>
                          </div>
                        </Label>
                      </div>
                    </div>

                    {/* UPI */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="upi" id="upi" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5zm-2 8h4v2h-4v-2zm0 4h4v2h-4v-2z" fill="currentColor"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">UPI</div>
                                <div className="text-xs sm:text-sm text-gray-500">Pay using UPI ID</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs flex-shrink-0">
                              Instant
                            </Badge>
                          </div>
                        </Label>
                      </div>
                      {paymentMethod === "upi" && (
                        <div className="mt-3 pl-8 sm:pl-13">
                          <Input
                            placeholder="Enter your UPI ID (e.g., yourname@paytm)"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="border-gray-300 focus:border-hednor-gold text-sm sm:text-base h-10 sm:h-11"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cash on Delivery */}
                    <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-hednor-gold transition-colors">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <RadioGroupItem value="cod" id="cod" className="text-hednor-gold flex-shrink-0" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none">
                                  <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" fill="currentColor"/>
                                </svg>
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 text-sm sm:text-base">Cash on Delivery</div>
                                <div className="text-xs sm:text-sm text-gray-500">Pay when you receive</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs flex-shrink-0">
                              <Truck className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
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
            <div className="xl:col-span-4">
              <div className="xl:sticky xl:top-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gray-50 border-b p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
                      Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Order Items */}
                    <div className="max-h-48 sm:max-h-64 overflow-y-auto border-b">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex items-center p-3 sm:p-4 border-b last:border-b-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 flex-shrink-0">
                            {formatPrice(item.salePrice || item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Details */}
                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Bag total</span>
                        <span className="font-medium">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                          {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">GST (18%)</span>
                        <span className="font-medium">{formatPrice(tax)}</span>
                      </div>
                      {paymentMethod === "cod" && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">COD charges</span>
                          <span className="font-medium">{formatPrice(40)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-sm sm:text-base font-bold">
                        <span>Total Amount</span>
                        <span className="text-hednor-gold">{formatPrice(finalAmount)}</span>
                      </div>

                      {shippingCost === 0 && (
                        <div className="flex items-center text-green-600 text-xs bg-green-50 p-2 rounded">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="text-xs">Free shipping on orders above ₹1,000</span>
                        </div>
                      )}
                    </div>

                    {/* Place Order Button */}
                    <div className="p-3 sm:p-4 pt-0">
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-hednor-gold text-white hover:bg-yellow-500 font-semibold py-3 sm:py-4 text-sm sm:text-base touch-target"
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
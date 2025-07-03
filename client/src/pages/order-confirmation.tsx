
import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { CheckCircle, Package, Truck, CreditCard, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface OrderDetails {
  orderId: string;
  items: any[];
  totalAmount: number;
  shippingAmount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  shippingAddress: any;
  estimatedDelivery: string;
}

export default function OrderConfirmation() {
  const [match, params] = useRoute("/order-confirmation/:orderId");
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!match || !params?.orderId) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch order details",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrderDetails();
    } else {
      setIsLoading(false);
    }
  }, [match, params?.orderId, isAuthenticated, toast]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hednor-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
            {params?.orderId && (
              <p className="text-sm text-gray-500 mt-2">Order ID: #{params.orderId}</p>
            )}
          </div>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="capitalize">{orderDetails?.paymentMethod || "Card"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <Badge variant="default">Confirmed</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Order Status:</span>
                      <Badge variant="secondary">Processing</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Method:</span>
                      <span>Standard Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Shipment</p>
                    <p className="text-sm text-gray-600">You'll receive tracking information once shipped</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-600">Your order will be delivered to your address</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.href = '/products'}
              className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/profile'}
              className="border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark"
            >
              View Orders
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

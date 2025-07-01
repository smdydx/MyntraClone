
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function OrderTracking() {
  const [trackingId, setTrackingId] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const { data: orderData, isLoading } = useQuery({
    queryKey: [`/api/orders/${trackingId}`],
    enabled: !!trackingId && searchAttempted,
  });

  const handleTrackOrder = () => {
    if (trackingId.trim()) {
      setSearchAttempted(true);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enter Tracking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter Order ID or Tracking Number"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                />
                <Button onClick={handleTrackOrder} disabled={!trackingId.trim()}>
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hednor-gold mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching for your order...</p>
              </CardContent>
            </Card>
          )}

          {searchAttempted && !isLoading && !orderData && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-600">Please check your order ID and try again.</p>
              </CardContent>
            </Card>
          )}

          {orderData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Order #{orderData.orderId}
                    <Badge variant={orderData.status === 'delivered' ? 'default' : 'secondary'}>
                      {orderData.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Order Details</h4>
                      <p className="text-sm text-gray-600">Order Date: {new Date(orderData.createdAt).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">Total: ₹{orderData.finalAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Delivery Address</h4>
                      <p className="text-sm text-gray-600">
                        {orderData.shippingAddress?.street}, {orderData.shippingAddress?.city}<br />
                        {orderData.shippingAddress?.state} - {orderData.shippingAddress?.zipCode}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tracking Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'confirmed', label: 'Order Confirmed', date: orderData.createdAt },
                      { status: 'processing', label: 'Processing', date: orderData.updatedAt },
                      { status: 'shipped', label: 'Shipped', date: orderData.shippedAt },
                      { status: 'delivered', label: 'Delivered', date: orderData.deliveredAt }
                    ].map((step, index) => (
                      <div key={step.status} className="flex items-center space-x-4">
                        {getStatusIcon(step.status)}
                        <div className="flex-1">
                          <p className="font-medium">{step.label}</p>
                          {step.date && (
                            <p className="text-sm text-gray-500">
                              {new Date(step.date).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

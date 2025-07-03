
import { ArrowLeft, Truck, Clock, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Shipping Information</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-hednor-gold">Home</Link>
              <span>/</span>
              <span>Shipping</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <Truck className="h-12 w-12 text-hednor-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Fast & Reliable Shipping</h2>
            <p className="text-gray-600">
              We deliver across India with multiple shipping options to suit your needs.
            </p>
          </CardContent>
        </Card>

        {/* Shipping Options */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-hednor-gold mr-2" />
                Delivery Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-hednor-gold pl-4">
                <h4 className="font-semibold text-gray-800 mb-1">Standard Delivery</h4>
                <p className="text-sm text-gray-600 mb-2">5-7 business days | ₹99</p>
                <p className="text-sm text-gray-500">Available across India</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-1">Express Delivery</h4>
                <p className="text-sm text-gray-600 mb-2">2-3 business days | ₹199</p>
                <p className="text-sm text-gray-500">Available in major cities</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-1">Same Day Delivery</h4>
                <p className="text-sm text-gray-600 mb-2">Within 24 hours | ₹299</p>
                <p className="text-sm text-gray-500">Available in Mumbai, Delhi, Bangalore</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-1">Free Shipping</h4>
                <p className="text-sm text-gray-600 mb-2">5-7 business days | Free</p>
                <p className="text-sm text-gray-500">On orders above ₹1999</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 text-hednor-gold mr-2" />
                Delivery Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Pan India Delivery</h4>
                <p className="text-gray-600 mb-3">
                  We deliver to all major cities and towns across India, including remote locations.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Metro Cities</h4>
                <p className="text-sm text-gray-600">
                  Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Tier 2 Cities</h4>
                <p className="text-sm text-gray-600">
                  Jaipur, Lucknow, Kanpur, Nagpur, Visakhapatnam, Bhopal, Patna, Vadodara
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Rural Areas</h4>
                <p className="text-sm text-gray-600">
                  Extended delivery time of 7-10 business days may apply to remote locations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Processing & Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Order Confirmed</h4>
                <p className="text-sm text-gray-600">
                  Your order is confirmed and payment is processed successfully.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Processing</h4>
                <p className="text-sm text-gray-600">
                  Your items are picked, packed, and prepared for shipping within 1-2 business days.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">In Transit</h4>
                <p className="text-sm text-gray-600">
                  Your package is on its way! Track your shipment using the provided tracking number.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">4</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Delivered</h4>
                <p className="text-sm text-gray-600">
                  Your order arrives at your doorstep. Enjoy your new purchases!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 text-hednor-gold mr-2" />
                Packaging & Handling
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Secure Packaging</h4>
                <p className="text-gray-600">
                  All items are carefully packed in protective packaging to ensure they arrive in perfect condition.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Eco-Friendly Materials</h4>
                <p className="text-gray-600">
                  We use recyclable and biodegradable packaging materials wherever possible.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Quality Check</h4>
                <p className="text-gray-600">
                  Every order goes through a quality check before packaging to ensure accuracy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Order Tracking</h4>
                <p className="text-gray-600">
                  Track your order anytime using the tracking number sent to your email and SMS.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Address Accuracy</h4>
                <p className="text-gray-600">
                  Please ensure your delivery address is complete and accurate to avoid delays.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Delivery Attempts</h4>
                <p className="text-gray-600">
                  Our delivery partner will make 3 attempts. Please be available or arrange for someone to receive.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Cash on Delivery</h4>
                <p className="text-gray-600">
                  COD available for orders below ₹5000. Additional charges may apply.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Shipping Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Track Your Order</h4>
                <p className="text-gray-600 mb-2">Get real-time updates</p>
                <Button className="bg-hednor-gold hover:bg-yellow-500 text-hednor-dark">
                  Track Order
                </Button>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Shipping Help</h4>
                <p className="text-gray-600 mb-2">shipping@hednor.com</p>
                <p className="text-sm text-gray-500">Response within 2 hours</p>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Call Support</h4>
                <p className="text-gray-600 mb-2">+91 12345 67890</p>
                <p className="text-sm text-gray-500">24/7 shipping support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

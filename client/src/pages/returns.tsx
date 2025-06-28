
import { ArrowLeft, RotateCcw, Clock, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Returns() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Returns & Exchanges</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <RotateCcw className="h-12 w-12 text-hednor-gold mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Easy Returns & Exchanges</h2>
            <p className="text-gray-600">
              Not satisfied with your purchase? We offer hassle-free returns within 30 days.
            </p>
          </CardContent>
        </Card>

        {/* Return Policy */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 text-hednor-gold mr-2" />
                Return Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">30-Day Return Window</h4>
                <p className="text-gray-600">
                  You have 30 days from the date of delivery to return items for a full refund or exchange.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Condition Requirements</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Items must be in original condition with tags attached</li>
                  <li>• No signs of wear, damage, or alteration</li>
                  <li>• Original packaging must be included</li>
                  <li>• Hygiene items cannot be returned</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What We Accept</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Clothing and accessories</li>
                  <li>• Shoes (unworn with original box)</li>
                  <li>• Bags and wallets</li>
                  <li>• Home & living items</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 text-hednor-gold mr-2" />
                What Cannot Be Returned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Non-Returnable Items</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Undergarments and intimate wear</li>
                  <li>• Cosmetics and beauty products</li>
                  <li>• Earrings and pierced jewelry</li>
                  <li>• Personalized or customized items</li>
                  <li>• Gift cards and e-vouchers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Sale Items</h4>
                <p className="text-gray-600">
                  Final sale items marked with "FINAL SALE" are not eligible for returns or exchanges.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Damaged Items</h4>
                <p className="text-gray-600">
                  If you receive a damaged item, please contact us within 48 hours for immediate replacement.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How to Return Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Initiate Return</h4>
                <p className="text-sm text-gray-600">
                  Log into your account and select the items you want to return from your order history.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Print Label</h4>
                <p className="text-sm text-gray-600">
                  Download and print the prepaid return shipping label we'll email to you.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Pack & Ship</h4>
                <p className="text-sm text-gray-600">
                  Pack items securely in original packaging and attach the return label.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-hednor-dark">4</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Get Refund</h4>
                <p className="text-sm text-gray-600">
                  Once we receive your return, we'll process your refund within 5-7 business days.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Info */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RotateCcw className="h-5 w-5 text-hednor-gold mr-2" />
                Exchanges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Size Exchanges</h4>
                <p className="text-gray-600">
                  Need a different size? We offer free size exchanges within 30 days for the same item.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Color Exchanges</h4>
                <p className="text-gray-600">
                  Want a different color? Exchange for the same item in a different color, subject to availability.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Exchange Process</h4>
                <p className="text-gray-600">
                  Select "Exchange" when initiating your return and choose your preferred replacement item.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-hednor-gold mr-2" />
                Refund Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Processing Time</h4>
                <p className="text-gray-600">
                  Refunds are processed within 5-7 business days after we receive your return.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Refund Method</h4>
                <p className="text-gray-600">
                  Refunds will be credited to your original payment method (credit card, UPI, wallet, etc.).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Shipping Costs</h4>
                <p className="text-gray-600">
                  Original shipping charges are non-refundable unless the item was damaged or incorrect.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
                <p className="text-gray-600 mb-2">returns@hednor.com</p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
                <p className="text-gray-600 mb-2">+91 12345 67890</p>
                <p className="text-sm text-gray-500">Mon-Fri: 9 AM - 9 PM</p>
              </div>

              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-2">Live Chat</h4>
                <p className="text-gray-600 mb-2">Available on website</p>
                <p className="text-sm text-gray-500">24/7 support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

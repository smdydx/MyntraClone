
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Privacy() {
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
            <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Privacy Policy</CardTitle>
            <p className="text-gray-600">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Information We Collect</h3>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Personal information (name, email, phone number)</li>
                <li>Payment information (credit card details, billing address)</li>
                <li>Shipping address and preferences</li>
                <li>Purchase history and product preferences</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support</li>
                <li>Send order confirmations and shipping notifications</li>
                <li>Improve our products and services</li>
                <li>Send promotional emails (with your consent)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Information Sharing</h3>
              <p className="text-gray-600">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information with trusted partners who help us operate our business.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h3>
              <p className="text-gray-600">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h3>
              <p className="text-gray-600">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: privacy@hednor.com<br />
                Phone: +91 12345 67890
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

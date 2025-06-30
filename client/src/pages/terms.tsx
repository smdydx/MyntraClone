import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import Footer from "@/components/footer";

export default function Terms() {
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
            <h1 className="text-2xl font-bold text-gray-800">Terms of Service</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Acceptance of Terms</h3>
              <p className="text-gray-600">
                By accessing and using this website, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Use License</h3>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the materials on Hednor's 
                website for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>This is the grant of a license, not a transfer of title</li>
                <li>You may not modify or copy the materials</li>
                <li>You may not use the materials for commercial purposes</li>
                <li>You may not attempt to reverse engineer any software</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Information</h3>
              <p className="text-gray-600">
                We strive to provide accurate product information, but we do not warrant that 
                product descriptions or other content is accurate, complete, reliable, or error-free.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Orders and Payment</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>All orders are subject to availability and confirmation</li>
                <li>We reserve the right to refuse any order</li>
                <li>Payment must be received before shipment</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
              <p className="text-gray-600">
                In no event shall Hednor or its suppliers be liable for any damages arising out of 
                the use or inability to use the materials on this website.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Information</h3>
              <p className="text-gray-600">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: legal@hednor.com<br />
                Phone: +91 12345 67890
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
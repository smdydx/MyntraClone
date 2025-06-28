
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Cookies() {
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
            <h1 className="text-2xl font-bold text-gray-800">Cookie Policy</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800">Cookie Policy</CardTitle>
            <p className="text-gray-600">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">What Are Cookies</h3>
              <p className="text-gray-600">
                Cookies are small text files that are placed on your computer or mobile device when 
                you visit our website. They help us provide you with a better experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800">Essential Cookies</h4>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function properly. They enable 
                    basic functions like page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Performance Cookies</h4>
                  <p className="text-gray-600">
                    These cookies help us understand how visitors interact with our website by 
                    collecting anonymous information about page views and user behavior.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Functionality Cookies</h4>
                  <p className="text-gray-600">
                    These cookies remember your preferences and choices to provide a more 
                    personalized experience.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">How We Use Cookies</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Keep you logged in during your visit</li>
                <li>Remember items in your shopping cart</li>
                <li>Understand how you use our website</li>
                <li>Improve website performance and user experience</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Managing Cookies</h3>
              <p className="text-gray-600">
                You can control and manage cookies through your browser settings. However, 
                disabling certain cookies may affect the functionality of our website.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Contact Us</h3>
              <p className="text-gray-600">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <p className="text-gray-600 mt-2">
                Email: cookies@hednor.com<br />
                Phone: +91 12345 67890
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

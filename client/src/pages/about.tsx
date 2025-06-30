import { ArrowLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";
import Footer from "@/components/Footer"; // Assuming Footer component is in "@/components/Footer"

export default function About() {
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
            <h1 className="text-2xl font-bold text-gray-800">About Us</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <img
            src={hednorLogoPath}
            alt="Hednor Logo"
            className="w-32 h-32 object-contain mx-auto mb-6"
          />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Hednor</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted fashion destination for the latest trends and timeless styles. 
            We bring you quality fashion that fits your lifestyle and budget.
          </p>
        </div>

        {/* Our Story */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h3>
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                Founded with a passion for fashion and a commitment to quality, Hednor has been serving 
                fashion enthusiasts across India with the latest trends and timeless classics. Our journey 
                began with a simple vision: to make high-quality fashion accessible to everyone.
              </p>
              <p className="text-gray-600 mb-4">
                From our humble beginnings to becoming a trusted name in online fashion retail, we've 
                consistently focused on providing our customers with an exceptional shopping experience. 
                Our carefully curated collection spans across men's, women's, and kids' fashion, ensuring 
                that every member of your family finds something they love.
              </p>
              <p className="text-gray-600">
                At Hednor, we believe that fashion is not just about clothing – it's about expressing 
                your personality, boosting your confidence, and feeling great in your own skin. That's 
                why we're committed to offering diverse styles that cater to different tastes, occasions, 
                and budgets.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hednor-dark">Q</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Quality</h4>
              <p className="text-gray-600">
                We source our products from trusted manufacturers and ensure every item meets our high quality standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hednor-dark">A</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Affordability</h4>
              <p className="text-gray-600">
                Fashion shouldn't break the bank. We offer competitive prices without compromising on quality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-hednor-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-hednor-dark">S</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Service</h4>
              <p className="text-gray-600">
                Our customer service team is always ready to help you with any questions or concerns.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-hednor-gold mr-3" />
                  <span className="text-gray-600">123 Fashion Street, Mumbai, Maharashtra 400001</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-hednor-gold mr-3" />
                  <span className="text-gray-600">+91 12345 67890</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-hednor-gold mr-3" />
                  <span className="text-gray-600">support@hednor.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-hednor-gold mr-3" />
                  <span className="text-gray-600">24/7 Customer Support</span>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Business Hours</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700/50">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get exclusive access to new arrivals, special offers, and insider fashion updates delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 flex-1"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={hednorLogoPath} 
                  alt="Hednor Logo" 
                  className="w-12 h-12 object-contain"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Hednor
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Redefining fashion with cutting-edge designs and premium quality. Your style, our passion.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">+91 12345 67890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">support@hednor.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <div className="p-2 bg-gray-800/50 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
                <div className="p-2 bg-gray-800/50 hover:bg-blue-400 rounded-lg transition-colors cursor-pointer group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
                <div className="p-2 bg-gray-800/50 hover:bg-pink-600 rounded-lg transition-colors cursor-pointer group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
                <div className="p-2 bg-gray-800/50 hover:bg-red-600 rounded-lg transition-colors cursor-pointer group">
                  <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">Quick Links</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/about" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">About Us</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Contact</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">FAQ</Link>
                <Link href="/size-guide" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Size Guide</Link>
                <Link href="/live-chat" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Live Chat</Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">Categories</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/products?category=men" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Men's Fashion</Link>
                <Link href="/products?category=women" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Women's Fashion</Link>
                <Link href="/products?category=kids" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Kids' Fashion</Link>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Accessories</Link>
                <Link href="/products?category=beauty" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Beauty & Care</Link>
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-3">Customer Service</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/order-tracking" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Track Orders</Link>
                <Link href="/shipping" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Shipping Info</Link>
                <Link href="/returns" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Returns & Exchanges</Link>
                <Link href="/wishlist" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">Wishlist</Link>
                <Link href="/profile" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm">My Account</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700/50 bg-black/30">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Hednor. All rights reserved. Crafted with passion.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      </footer>
  );
}
import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-auto">
      

      {/* Main Footer Content */}
      <div className="py-8 lg:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Brand Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md text-center mx-auto mt-4">
              Redefining fashion with cutting-edge designs and premium quality. Your style, our passion.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm">+91 12345 67890</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm">support@hednor.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex justify-center space-x-3 mt-4">
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

          {/* Footer Links - 1 row × 3 columns layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 text-center sm:text-left">Quick Links</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/about" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">About Us</Link>
                <Link href="/contact" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Contact</Link>
                <Link href="/faq" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">FAQ</Link>
                <Link href="/size-guide" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Size Guide</Link>
                <Link href="/live-chat" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Live Chat</Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 text-center sm:text-left">Categories</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/products?category=men" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Men's Fashion</Link>
                <Link href="/products?category=women" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Women's Fashion</Link>
                <Link href="/products?category=kids" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Kids' Fashion</Link>
                <Link href="/products?category=accessories" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Accessories</Link>
                <Link href="/products?category=beauty" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Beauty & Care</Link>
              </div>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2 text-center sm:text-left">Customer Service</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/order-tracking" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Track Orders</Link>
                <Link href="/shipping" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Shipping Info</Link>
                <Link href="/returns" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Returns & Exchanges</Link>
                <Link href="/wishlist" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">Wishlist</Link>
                <Link href="/profile" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all text-sm text-center sm:text-left">My Account</Link>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700/50 bg-black/30">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
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
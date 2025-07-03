
import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Globe, MapPin, Phone, Mail } from "lucide-react";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Back to Top */}
      <div className="bg-gray-800 hover:bg-gray-700 transition-colors">
        <div className="container mx-auto px-4 py-3 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-white hover:text-gray-300 text-sm font-medium"
          >
            Back to top
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Get to Know Us */}
            <div>
              <h3 className="text-white font-bold text-base mb-4">Get to Know Us</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">About Hednor</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Press Releases</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Investor Relations</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Sustainability</Link></li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="text-white font-bold text-base mb-4">Make Money with Us</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Sell on Hednor</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Become an Affiliate</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Advertise Your Products</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Supply to Hednor</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Host a Hub</Link></li>
              </ul>
            </div>

            {/* Hednor Payment Products */}
            <div>
              <h3 className="text-white font-bold text-base mb-4">Hednor Payment Products</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Hednor Business Card</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Shop with Points</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Reload Your Balance</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Hednor Currency Converter</Link></li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="text-white font-bold text-base mb-4">Let Us Help You</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Your Account</Link></li>
                <li><Link href="/order-tracking" className="text-gray-300 hover:text-white text-sm transition-colors">Your Orders</Link></li>
                <li><Link href="/shipping" className="text-gray-300 hover:text-white text-sm transition-colors">Shipping Rates & Policies</Link></li>
                <li><Link href="/returns" className="text-gray-300 hover:text-white text-sm transition-colors">Returns & Replacements</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">Help</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section with Logo and Contact */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            
            {/* Logo and Contact Info */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-24 h-24 object-contain"
              />
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 12345 67890</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">support@hednor.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Links Section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 text-xs">
            
            {/* Hednor Fashion */}
            <div>
              <h4 className="text-white font-semibold mb-2">Hednor Fashion</h4>
              <ul className="space-y-1">
                <li><Link href="/products?category=men" className="text-gray-400 hover:text-white transition-colors">Men's Fashion</Link></li>
                <li><Link href="/products?category=women" className="text-gray-400 hover:text-white transition-colors">Women's Fashion</Link></li>
                <li><Link href="/products?category=kids" className="text-gray-400 hover:text-white transition-colors">Kids' Fashion</Link></li>
              </ul>
            </div>

            {/* Hednor Lifestyle */}
            <div>
              <h4 className="text-white font-semibold mb-2">Hednor Lifestyle</h4>
              <ul className="space-y-1">
                <li><Link href="/products?category=home" className="text-gray-400 hover:text-white transition-colors">Home & Living</Link></li>
                <li><Link href="/products?category=beauty" className="text-gray-400 hover:text-white transition-colors">Beauty & Personal Care</Link></li>
                <li><Link href="/products?category=accessories" className="text-gray-400 hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-white font-semibold mb-2">Customer Care</h4>
              <ul className="space-y-1">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/live-chat" className="text-gray-400 hover:text-white transition-colors">Live Chat</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="text-white font-semibold mb-2">Policies</h4>
              <ul className="space-y-1">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-2">Support</h4>
              <ul className="space-y-1">
                <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">Size Guide</Link></li>
                <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-2">Connect</h4>
              <div className="flex space-x-3">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-xs">
              © 2025 Hednor, Inc. All rights reserved.
            </p>
            <div className="flex space-x-4 text-xs">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="pt-8 pb-16 mt-8 w-full clear-both" style={{ backgroundColor: 'rgb(112 113 35 / 50%)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-8">
          {/* Company Info Section - Larger space */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-20 h-20 object-contain mr-3"
              />
              <div>
                <h2 className="text-xl font-bold text-hednor-dark">Hednor</h2>
                <p className="text-sm text-gray-600">Fashion Forward</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Your trusted fashion destination for the latest trends and timeless styles. 
              We bring quality fashion that fits your lifestyle and budget.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <h4 className="font-semibold text-hednor-dark text-sm">Follow Us:</h4>
              </div>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-600 hover:text-hednor-gold cursor-pointer transition-all duration-300 hover:scale-110" />
                <Twitter className="w-6 h-6 text-gray-600 hover:text-hednor-gold cursor-pointer transition-all duration-300 hover:scale-110" />
                <Instagram className="w-6 h-6 text-gray-600 hover:text-hednor-gold cursor-pointer transition-all duration-300 hover:scale-110" />
                <Youtube className="w-6 h-6 text-gray-600 hover:text-hednor-gold cursor-pointer transition-all duration-300 hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Navigation Links - Better organized */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Shop Categories */}
            <div>
              <h3 className="font-bold text-hednor-dark mb-4 text-sm uppercase tracking-wide">Shop</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/products?category=men" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Men's Fashion</span>
                </Link></li>
                <li><Link href="/products?category=women" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Women's Fashion</span>
                </Link></li>
                <li><Link href="/products?category=kids" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Kids' Fashion</span>
                </Link></li>
                <li><Link href="/products?category=accessories" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Accessories</span>
                </Link></li>
                <li><Link href="/products?category=beauty" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Beauty</span>
                </Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h3 className="font-bold text-hednor-dark mb-4 text-sm uppercase tracking-wide">Customer Care</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">About Us</span>
                </Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link></li>
                <li><Link href="/size-guide" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Size Guide</span>
                </Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Returns</span>
                </Link></li>
                <li><Link href="/shipping" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Shipping Info</span>
                </Link></li>
              </ul>
            </div>

            {/* Support & Help */}
            <div>
              <h3 className="font-bold text-hednor-dark mb-4 text-sm uppercase tracking-wide">Support</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-gray-600 flex items-center">
                  <span className="text-hednor-gold mr-2">⭐</span>
                  24/7 Support
                </li>
                <li className="text-gray-600 flex items-center">
                  <span className="text-hednor-gold mr-2">📞</span>
                  +91 12345 67890
                </li>
                <li className="text-gray-600 flex items-center">
                  <span className="text-hednor-gold mr-2">📧</span>
                  support@hednor.com
                </li>
                <li><Link href="/live-chat" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="text-hednor-gold mr-2">💬</span>
                  <span className="group-hover:translate-x-1 transition-transform">Live Chat</span>
                </Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-hednor-gold transition-colors flex items-center group">
                  <span className="text-hednor-gold mr-2">❓</span>
                  <span className="group-hover:translate-x-1 transition-transform">FAQ</span>
                </Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6 pb-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <p className="text-gray-600 text-sm text-center md:text-left">
            © 2025 Hednor. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-hednor-gold transition-colors whitespace-nowrap">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-hednor-gold transition-colors whitespace-nowrap">Terms of Service</Link>
            <Link href="/cookies" className="text-gray-600 hover:text-hednor-gold transition-colors whitespace-nowrap">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
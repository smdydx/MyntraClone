import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="pt-8 pb-16 mt-8 w-full clear-both" style={{ backgroundColor: 'rgb(112 113 35 / 50%)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-8 mb-6">
          {/* Company Info */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto lg:mx-0">
              Your trusted fashion destination for the latest trends and timeless styles.
            </p>
            <div className="flex justify-center lg:justify-start space-x-4">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links and Categories Row - Single Row with 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Links - Left Column */}
            <div className="text-left">
              <h3 className="font-semibold text-hednor-dark mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="text-gray-600 hover:text-hednor-gold transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-600 hover:text-hednor-gold transition-colors">Contact</Link></li>
                  <li><Link href="/size-guide" className="text-gray-600 hover:text-hednor-gold transition-colors">Size Guide</Link></li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/returns" className="text-gray-600 hover:text-hednor-gold transition-colors">Returns</Link></li>
                  <li><Link href="/shipping" className="text-gray-600 hover:text-hednor-gold transition-colors">Shipping Info</Link></li>
                  <li><Link href="/faq" className="text-gray-600 hover:text-hednor-gold transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>

            {/* Categories - Right Column */}
            <div className="text-left">
              <h3 className="font-semibold text-hednor-dark mb-4">Categories</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products?category=men" className="text-gray-600 hover:text-hednor-gold transition-colors">Men's Fashion</Link></li>
                  <li><Link href="/products?category=women" className="text-gray-600 hover:text-hednor-gold transition-colors">Women's Fashion</Link></li>
                  <li><Link href="/products?category=kids" className="text-gray-600 hover:text-hednor-gold transition-colors">Kids' Fashion</Link></li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/products?category=accessories" className="text-gray-600 hover:text-hednor-gold transition-colors">Accessories</Link></li>
                  <li><Link href="/products?category=beauty" className="text-gray-600 hover:text-hednor-gold transition-colors">Beauty</Link></li>
                  <li><Link href="/products?category=home" className="text-gray-600 hover:text-hednor-gold transition-colors">Home & Living</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Customer Support */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 lg:col-span-4">
              <h3 className="font-semibold text-hednor-dark mb-4">Customer Support</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">24/7 Support</div>
                  <div className="text-gray-600">📞 +91 12345 67890</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">📧 support@hednor.com</div>
                  <Link href="/live-chat" className="block text-gray-600 hover:text-hednor-gold transition-colors">Live Chat</Link>
                </div>
                <div className="space-y-2 text-sm">
                  <Link href="/privacy" className="block text-gray-600 hover:text-hednor-gold transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="block text-gray-600 hover:text-hednor-gold transition-colors">Terms of Service</Link>
                </div>
                <div className="space-y-2 text-sm">
                  <Link href="/cookies" className="block text-gray-600 hover:text-hednor-gold transition-colors">Cookie Policy</Link>
                  <div className="text-gray-600">Help Center</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6 pb-4 text-center">
          <p className="text-gray-600 text-sm">
            © 2025 Hednor. All rights reserved. | Made with ❤️ for fashion lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
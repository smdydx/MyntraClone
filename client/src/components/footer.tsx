import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import hednorLogoPath from "@assets/Hednor Logo 22 updated-5721x3627_1750949407940.png";

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src={hednorLogoPath} 
                alt="Hednor Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="font-poppins font-bold text-lg text-hednor-dark">HEDNOR</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted fashion destination for the latest trends and timeless styles.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-600 hover:text-hednor-gold cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-hednor-dark mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-hednor-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-hednor-gold transition-colors">Contact</Link></li>
              <li><Link href="/size-guide" className="text-gray-600 hover:text-hednor-gold transition-colors">Size Guide</Link></li>
              <li><Link href="/returns" className="text-gray-600 hover:text-hednor-gold transition-colors">Returns</Link></li>
              <li><Link href="/shipping" className="text-gray-600 hover:text-hednor-gold transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-hednor-dark mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=men" className="text-gray-600 hover:text-hednor-gold transition-colors">Men's Fashion</Link></li>
              <li><Link href="/products?category=women" className="text-gray-600 hover:text-hednor-gold transition-colors">Women's Fashion</Link></li>
              <li><Link href="/products?category=kids" className="text-gray-600 hover:text-hednor-gold transition-colors">Kids' Fashion</Link></li>
              <li><Link href="/products?category=accessories" className="text-gray-600 hover:text-hednor-gold transition-colors">Accessories</Link></li>
              <li><Link href="/products?category=beauty" className="text-gray-600 hover:text-hednor-gold transition-colors">Beauty</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-hednor-dark mb-4">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">24/7 Support</li>
              <li className="text-gray-600">📞 +91 12345 67890</li>
              <li className="text-gray-600">📧 support@hednor.com</li>
              <li><Link href="/live-chat" className="text-gray-600 hover:text-hednor-gold transition-colors">Live Chat</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-hednor-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2025 Hednor. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-hednor-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-hednor-gold transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-gray-600 hover:text-hednor-gold transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

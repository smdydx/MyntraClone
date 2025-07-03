import { Link } from "wouter";
import type { Category } from "@shared/schema";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const categorySlug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return (
    <Link href={`/products?category=${encodeURIComponent(categorySlug)}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] border border-gray-200/50">
        {/* Main Image Container with proper aspect ratio */}
        <div className="relative aspect-square overflow-hidden image-container">
          <img
            src={category.image || "/api/placeholder/300/300"}
            alt={category.name}
            className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 category-image"
            loading="lazy"
            style={{ imageRendering: 'auto' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#f9fafb;stop-opacity:1" />
                      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bg)"/>
                  <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" font-weight="600" fill="#6b7280" text-anchor="middle" dy=".3em">${category.name}</text>
                  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="10" fill="#9ca3af" text-anchor="middle" dy=".3em">Category</text>
                </svg>
              `)}`;
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 animate-shine" />
          </div>
        </div>

        {/* Content - Responsive Text */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 text-wrap leading-tight">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-white/90 text-xs sm:text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100 text-wrap">
              {category.description}
            </p>
          )}
        </div>

        {/* Floating Badge - Responsive */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-hednor-gold text-hednor-dark px-2 sm:px-3 py-1 rounded-full text-xs font-bold transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200">
          <span className="hidden sm:inline">Shop Now</span>
          <span className="sm:hidden">Shop</span>
        </div>
      </div>
    </Link>
  );
}
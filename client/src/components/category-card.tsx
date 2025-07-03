
import { Link } from "wouter";
import type { Category } from "@shared/schema";
import { ArrowRight, Sparkles } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group cursor-pointer relative">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 hover:border-hednor-gold/30 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 h-48 md:h-56">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-hednor-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Image Container */}
          <div className="relative overflow-hidden h-32 md:h-36">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img
              src={category.image || ""}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              style={{
                imageRendering: 'auto',
                filter: 'contrast(1.1) saturate(1.1)'
              }}
            />
            
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 group-hover:animate-shine"></div>
            </div>

            {/* Icon Overlay */}
            <div className="absolute top-3 right-3 z-20">
              <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <Sparkles className="w-4 h-4 text-hednor-gold" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-4 flex flex-col justify-between h-16 md:h-20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm md:text-base lg:text-lg uppercase tracking-wide leading-tight group-hover:text-hednor-gold transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  Explore Collection
                </p>
              </div>
              
              <div className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-8 h-8 bg-hednor-gold rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-hednor-dark" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Border Animation */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-hednor-gold to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </div>
      </div>
    </Link>
  );
}

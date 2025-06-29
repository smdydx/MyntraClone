import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow h-40 md:h-48 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <img
              src={category.image || ""}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 text-center h-16 flex items-center justify-center">
            <h3 className="font-semibold text-gray-800 text-xs md:text-sm uppercase tracking-wide line-clamp-2 leading-tight">
              {category.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

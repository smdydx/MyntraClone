import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <img
            src={category.image || ""}
            alt={category.name}
            className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="p-3 text-center">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
              {category.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

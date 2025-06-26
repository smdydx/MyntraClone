import { Link } from "wouter";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`}>
      <div className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
          <img
            src={category.image || ""}
            alt={category.name}
            className="w-full h-32 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all"></div>
          <div className="absolute bottom-2 left-2 text-white font-semibold">
            {category.name}
          </div>
        </div>
      </div>
    </Link>
  );
}

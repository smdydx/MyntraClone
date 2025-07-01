
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import type { Product } from "@shared/schema";

interface RelatedProductsProps {
  categoryId?: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/products", { category: categoryId, limit: 5 }],
  });

  const relatedProducts = (productsResponse?.products || [])
    .filter((product: Product) => product.id !== currentProductId)
    .slice(0, 5);

  if (isLoading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="font-bold text-xl md:text-2xl text-gray-800 uppercase tracking-wide mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {relatedProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-6">
          <Link href="/products">
            <Button variant="outline" className="px-8 py-2">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

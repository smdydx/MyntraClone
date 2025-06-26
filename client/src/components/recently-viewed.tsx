
import { useEffect, useState } from "react";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./product-card";
import type { Product } from "@shared/schema";

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const recent = localStorage.getItem('recently-viewed');
    if (recent) {
      setRecentProducts(JSON.parse(recent));
    }
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Eye className="h-6 w-6 text-hednor-gold" />
            <h2 className="font-poppins font-bold text-2xl text-hednor-dark">
              Recently Viewed
            </h2>
          </div>
          <Button 
            variant="outline" 
            className="text-hednor-gold border-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {recentProducts.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

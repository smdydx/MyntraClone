import { Heart, Star } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        salePrice: product.salePrice || undefined,
        image: product.images?.[0] || "",
      });
    }
  };

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const renderStars = (rating: string) => {
    const numRating = parseFloat(rating);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= numRating 
              ? "text-hednor-gold fill-hednor-gold" 
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.isOnSale && product.salePrice && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium">
                {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`w-4 h-4 ${
                inWishlist 
                  ? "text-red-500 fill-red-500" 
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </Button>
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
            {product.brand}
          </p>
          <h3 className="font-normal text-sm text-gray-800 mb-2 line-clamp-1">
            {product.name}
          </h3>
          
          <div className="flex items-baseline space-x-2 mb-2">
            {product.salePrice ? (
              <>
                <span className="font-bold text-sm text-gray-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold text-sm text-gray-900">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex items-center bg-green-600 text-white text-xs px-1.5 py-0.5 rounded mr-2">
              <span className="font-medium">{product.rating || "4.0"}</span>
              <Star className="w-2.5 h-2.5 ml-0.5 fill-current" />
            </div>
            <span className="text-xs text-gray-400">
              ({product.reviewCount?.toLocaleString() || "1.2k"})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

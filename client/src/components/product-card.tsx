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
      <div className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isOnSale && product.salePrice && (
              <Badge className="bg-sale-red text-white text-xs px-2 py-1">
                {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
              </Badge>
            )}
            {!product.isOnSale && (
              <Badge className="bg-success-green text-white text-xs px-2 py-1">
                NEW
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`w-4 h-4 ${
                inWishlist 
                  ? "text-sale-red fill-sale-red" 
                  : "text-gray-400 hover:text-sale-red"
              }`}
            />
          </Button>
        </div>

        <div className="p-3">
          <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
            {product.brand}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {product.name}
          </p>
          
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="font-semibold text-hednor-dark">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-hednor-dark">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center mt-1">
            <div className="flex">
              {renderStars(product.rating || "0")}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              ({product.reviewCount?.toLocaleString() || 0})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

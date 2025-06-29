import { ShoppingCart, Heart, Star, Eye, ArrowUpDown, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCart } = useStore();
  const inWishlist = isInWishlist(product.id);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images?.[0] || "",
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images?.[0] || "",
      quantity: 1,
    });
    setLocation('/checkout');
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
    <div className={`group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow rounded-lg overflow-hidden w-full ${
      viewMode === 'list' ? 'flex flex-row' : 'max-w-sm mx-auto'
    }`}>
      <Link href={`/products/${product.slug}`} className={viewMode === 'list' ? 'flex flex-row w-full' : ''}>
        <div className={`relative overflow-hidden bg-gray-50 ${
          viewMode === 'list' ? 'w-32 sm:w-40 md:w-48 flex-shrink-0' : ''
        }`}>
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              viewMode === 'list' 
                ? 'w-full h-32 sm:h-40 md:h-48' 
                : 'w-full h-40 sm:h-48 md:h-56'
            }`}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
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
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white shadow-sm"
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

        <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-3 sm:p-4`}>
          <div className={viewMode === 'list' ? 'flex-1' : ''}>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {product.brand}
            </p>
            <h3 className={`font-medium text-gray-800 mb-2 leading-tight ${
              viewMode === 'list' ? 'text-sm sm:text-base line-clamp-3' : 'text-sm sm:text-base line-clamp-2'
            }`}>
              {product.name}
            </h3>

            <div className="flex items-baseline space-x-2 mb-2">
              {product.salePrice ? (
                <>
                  <span className={`font-bold text-gray-900 ${
                    viewMode === 'list' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                  }`}>
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className={`text-gray-400 line-through ${
                    viewMode === 'list' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                  }`}>
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className={`font-bold text-gray-900 ${
                  viewMode === 'list' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                }`}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center mb-3">
              <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                <span className="font-medium">{product.rating || "4.0"}</span>
                <Star className="w-3 h-3 ml-1 fill-current" />
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviewCount?.toLocaleString() || "1.2k"})
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className={`px-3 pb-3 sm:px-4 sm:pb-4 ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
        <div className={`gap-2 ${
          viewMode === 'list' 
            ? 'flex flex-col sm:flex-row sm:w-40 md:w-48' 
            : 'grid grid-cols-1 sm:grid-cols-2'
        }`}>
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className={`border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark font-medium transition-all duration-300 py-2 ${
              viewMode === 'list' 
                ? 'text-xs px-2 flex-1' 
                : 'w-full text-xs sm:text-sm'
            }`}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {!product.inStock ? 'Out of Stock' : viewMode === 'list' ? 'Cart' : 'Add to Cart'}
          </Button>
          <Button 
            onClick={handleBuyNow}
            size="sm"
            className={`bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-medium transition-all duration-300 py-2 ${
              viewMode === 'list' 
                ? 'text-xs px-2 flex-1' 
                : 'w-full text-xs sm:text-sm'
            }`}
            disabled={!product.inStock}
          >
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {viewMode === 'list' ? 'Buy' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
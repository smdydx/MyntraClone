import React from "react";
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
  const [imageLoaded, setImageLoaded] = React.useState(false);

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

    // Prevent multiple rapid clicks
    const button = e.currentTarget as HTMLButtonElement;
    if (button.disabled) return;
    
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 1000);

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

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with purchase.",
        variant: "destructive"
      });
      return;
    }

    // Prevent multiple rapid clicks
    const button = e.currentTarget as HTMLButtonElement;
    if (button.disabled) return;
    
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 2000);

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
      description: "Redirecting to checkout...",
    });

    // Small delay to ensure cart is updated before redirect
    setTimeout(() => {
      setLocation("/checkout");
    }, 1000);
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
      viewMode === 'list' ? 'flex flex-row' : 'max-w-full'
    }`}>
      <Link href={`/products/${product.slug}`} className={viewMode === 'list' ? 'flex flex-row w-full' : ''}>
        <div className={`relative overflow-hidden bg-gray-50 ${
          viewMode === 'list' ? 'w-24 xs:w-32 sm:w-40 md:w-48 flex-shrink-0' : 'aspect-[4/5]'
        }`}>
          <img
            src={product.images?.[0] || ""}
            alt={product.name}
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              viewMode === 'list' 
                ? 'w-full h-24 xs:h-32 sm:h-40 md:h-48' 
                : 'w-full h-full'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

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
            className="absolute top-1 xs:top-2 right-1 xs:right-2 w-6 h-6 xs:w-8 xs:h-8 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={`w-3 h-3 xs:w-4 xs:h-4 ${
                inWishlist 
                  ? "text-red-500 fill-red-500" 
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </Button>
        </div>

        <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''} p-2 xs:p-3 sm:p-4`}>
          <div className={viewMode === 'list' ? 'flex-1' : ''}>
            <p className="text-[10px] xs:text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              {product.brand}
            </p>
            <h3 className={`font-medium text-gray-800 mb-2 leading-tight ${
              viewMode === 'list' ? 'text-xs xs:text-sm sm:text-base line-clamp-3' : 'text-xs xs:text-sm sm:text-base line-clamp-2'
            }`}>
              {product.name}
            </h3>

            <div className="flex items-baseline space-x-1 xs:space-x-2 mb-2">
              {product.salePrice ? (
                <>
                  <span className={`font-bold text-gray-900 ${
                    viewMode === 'list' ? 'text-sm xs:text-base sm:text-lg' : 'text-xs xs:text-sm sm:text-base'
                  }`}>
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className={`text-gray-400 line-through ${
                    viewMode === 'list' ? 'text-xs xs:text-sm sm:text-base' : 'text-[10px] xs:text-xs sm:text-sm'
                  }`}>
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className={`font-bold text-gray-900 ${
                  viewMode === 'list' ? 'text-sm xs:text-base sm:text-lg' : 'text-xs xs:text-sm sm:text-base'
                }`}>
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center mb-2 xs:mb-3">
              <div className="flex items-center bg-green-600 text-white text-[10px] xs:text-xs px-1.5 xs:px-2 py-0.5 xs:py-1 rounded mr-1 xs:mr-2">
                <span className="font-medium">{product.rating || "4.0"}</span>
                <Star className="w-2.5 h-2.5 xs:w-3 xs:h-3 ml-0.5 xs:ml-1 fill-current" />
              </div>
              <span className="text-[10px] xs:text-xs text-gray-400">
                ({product.reviewCount?.toLocaleString() || "1.2k"})
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className={`px-2 pb-2 xs:px-3 xs:pb-3 sm:px-4 sm:pb-4 ${viewMode === 'list' ? 'flex-shrink-0 w-20 xs:w-auto' : ''}`}>
        <div className={`gap-1 xs:gap-2 ${
          viewMode === 'list' 
            ? 'flex flex-col' 
            : 'grid grid-cols-1 xs:grid-cols-2 gap-1 xs:gap-2'
        }`}>
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className="border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark font-medium transition-all duration-300 py-1.5 xs:py-2 px-1 xs:px-2 text-[9px] xs:text-[10px] sm:text-xs min-h-[28px] xs:min-h-[32px] flex items-center justify-center"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-0.5 xs:mr-1 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden text-ellipsis ${viewMode === 'list' ? 'hidden xs:inline' : ''}`}>
              {!product.inStock ? 'Out of Stock' : viewMode === 'list' ? 'Cart' : 'Add to Cart'}
            </span>
          </Button>
          <Button 
            onClick={handleBuyNow}
            size="sm"
            className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 hover:shadow-md font-medium transition-all duration-300 py-1.5 xs:py-2 px-1 xs:px-2 text-[9px] xs:text-[10px] sm:text-xs min-h-[28px] xs:min-h-[32px] flex items-center justify-center"
            disabled={!product.inStock}
          >
            <CreditCard className="mr-0.5 xs:mr-1 w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
            <span className={`whitespace-nowrap overflow-hidden text-ellipsis ${viewMode === 'list' ? 'hidden xs:inline' : ''}`}>
              {viewMode === 'list' ? 'Buy' : 'Buy Now'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
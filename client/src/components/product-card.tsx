
import { Link } from "wouter";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onQuickView, viewMode = 'grid' }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useStore();
  const isInWishlist = wishlistItems.some(item => item.productId === (product._id || product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product._id || product.id,
      name: product.name,
      brand: product.brand,
      price: product.salePrice?.toString() || product.price.toString(),
      salePrice: product.salePrice?.toString(),
      image: product.images[0],
      quantity: 1,
      size: product.sizes?.[0],
      color: product.colors?.[0]
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        productId: productId,
        name: product.name,
        brand: product.brand,
        price: product.salePrice?.toString() || product.price.toString(),
        salePrice: product.salePrice?.toString(),
        image: product.images[0]
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString('en-IN')}`;
  };

  const discountPercentage = product.salePrice 
    ? Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Card className="myntra-card overflow-hidden hover:shadow-xl transition-all duration-300 flex">
        <Link href={`/product/${product._id || product.id}`} className="flex w-full">
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100">
            {product.images && product.images[0] && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
            )}
            
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1">
                {discountPercentage}% OFF
              </Badge>
            )}

            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleToggleWishlist}
            >
              <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {product.brand}
              </p>
              
              <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-hednor-gold transition-colors">
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviewCount?.toLocaleString() || "0"})
                </span>
              </div>

              <div className="space-y-1">
                {product.salePrice && Number(product.salePrice) < Number(product.price) ? (
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-hednor-dark text-lg">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-gray-900 text-lg">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <Button
              size="sm"
              className="mt-4 bg-hednor-gold text-hednor-dark hover:bg-yellow-500 w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="myntra-card group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
      <Link href={`/product/${product._id || product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {product.images && product.images[0] && (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          )}

          {/* Sale Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 font-semibold">
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>

          {/* Quick View Button */}
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-12 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          )}

          {/* Add to Cart Button - Shows on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-3 space-y-2">
        {/* Brand */}
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {product.brand}
        </p>

        {/* Product Name */}
        <Link href={`/product/${product._id || product.id}`}>
          <h3 className="font-medium text-gray-800 line-clamp-2 text-sm hover:text-hednor-gold transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            ({product.reviewCount?.toLocaleString() || "0"})
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          {product.salePrice && Number(product.salePrice) < Number(product.price) ? (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 text-base">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-bold text-gray-900 text-base">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export { ProductCard };

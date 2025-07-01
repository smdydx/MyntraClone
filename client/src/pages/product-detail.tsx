import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Star, Heart, ShoppingBag, Plus, Minus, ArrowLeft, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import SizeGuide from "@/components/size-guide";
import ReviewForm from "@/components/review-form";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RelatedProducts from "@/components/related-products";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/slug/${slug}`],
    enabled: !!slug,
  });

  const inWishlist = product ? isInWishlist(product.id) : false;

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
          className={`w-4 h-4 ${
            i <= numRating 
              ? "text-hednor-gold fill-hednor-gold" 
              : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images?.[0] || "",
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        salePrice: product.salePrice || undefined,
        image: product.images?.[0] || "",
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex space-x-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-16 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link href="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-hednor-gold">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-hednor-gold">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
          {/* Product Images */}
          <div className="space-y-2 md:space-y-4 sticky top-24">
            <div 
              className="relative bg-white rounded-lg overflow-hidden cursor-zoom-in"
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                <img
                  src={product.images?.[selectedImageIndex] || ""}
                  alt={product.name}
                  className={`w-full h-64 xs:h-80 sm:h-96 md:h-[500px] lg:h-[600px] object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }
                      : {}
                  }
                />
                
                {/* Zoom indicator */}
                <div className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {product.isOnSale && product.salePrice && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white z-10">
                  {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-1 xs:space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 rounded border-2 overflow-hidden transition-all hover:scale-105 ${
                      selectedImageIndex === index ? 'border-hednor-gold shadow-lg' : 'border-gray-200 hover:border-hednor-gold'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {renderStars(product.rating || "0")}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount?.toLocaleString() || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-hednor-dark">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-hednor-dark">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Size</h3>
                  <SizeGuide />
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-hednor-gold bg-hednor-gold text-hednor-dark'
                          : 'border-gray-300 text-gray-700 hover:border-hednor-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-hednor-gold bg-hednor-gold text-hednor-dark'
                          : 'border-gray-300 hover:border-hednor-gold'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart/Wishlist */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold"
                size="lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleWishlistToggle}
                className={`${
                  inWishlist 
                    ? "border-sale-red text-sale-red hover:bg-red-50" 
                    : "border-gray-300 hover:border-sale-red hover:text-sale-red"
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-sale-red" : ""}`} />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-success-green' : 'bg-sale-red'}`}></div>
              <span className={`text-sm font-medium ${product.inStock ? 'text-success-green' : 'text-sale-red'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stockQuantity && product.stockQuantity < 10 && (
                <span className="text-sm text-orange-600">
                  Only {product.stockQuantity} left!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Product Description</h3>
              <p className="text-gray-600">
                {product.description || "This is a high-quality product that combines style, comfort, and durability. Perfect for everyday wear and special occasions."}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Brand:</span> {product.brand}
                </div>
                <div>
                  <span className="font-medium">Category:</span> Fashion
                </div>
                {product.sizes && (
                  <div>
                    <span className="font-medium">Available Sizes:</span> {product.sizes.join(", ")}
                  </div>
                )}
                {product.colors && (
                  <div>
                    <span className="font-medium">Available Colors:</span> {product.colors.join(", ")}
                  </div>
                )}
                <div>
                  <span className="font-medium">Stock:</span> {product.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Existing Reviews */}
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Customer Reviews</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex">
                    {renderStars(product.rating || "0")}
                  </div>
                  <span className="text-lg font-semibold">{product.rating || "0"} out of 5</span>
                  <span className="text-gray-600">({product.reviewCount?.toLocaleString() || 0} reviews)</span>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">Priya S.</span>
                      <span className="text-sm text-gray-500">Verified Purchase</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Excellent quality and perfect fit! Highly recommend this product."
                    </p>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">Rahul K.</span>
                      <span className="text-sm text-gray-500">Verified Purchase</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Good value for money. Fast delivery and nice packaging."
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              <ReviewForm 
                productId={product.id} 
                productName={product.name}
                onReviewSubmitted={() => {
                  // Could refresh reviews here
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />

      

      {/* Promo Banner */}

      <Footer />
    </div>
  );
}
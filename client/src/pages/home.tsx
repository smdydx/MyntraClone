import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import HeroSlider from "@/components/hero-slider";
import ReviewsSection from "@/components/reviews-section";
import TrendingBrands from "@/components/trending-brands";
import type { Product, Category } from "@shared/schema";
import NewsletterPopup from "@/components/newsletter-popup";
import RecentlyViewed from "@/components/recently-viewed";
import FloatingCartIcon from "@/components/floating-cart-icon";
import BackToTop from "@/components/back-to-top";
import FloatingActionButtons from "@/components/floating-action-buttons";
import { NotificationManager } from "@/components/notification-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Clock, Zap, Heart, ShoppingCart } from "lucide-react";

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: featuredProductsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { featured: true }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: saleProductsResponse } = useQuery({
    queryKey: ["/api/products", { onSale: true }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: productsResponse } = useQuery({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const featuredProducts = featuredProductsResponse?.products || [];
  const saleProducts = saleProductsResponse?.products || [];
  const products = productsResponse?.products || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Slider */}
      <div className="w-full overflow-hidden">
        <HeroSlider />
      </div>

      {/* Enhanced Offer Banner */}
      <div className="bg-gradient-to-r from-hednor-dark via-gray-900 to-hednor-dark text-white py-6 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-hednor-gold/10 via-transparent to-hednor-gold/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-hednor-gold flex items-center justify-center">
                <Zap className="w-6 h-6 text-hednor-dark" />
              </div>
              <div className="text-left">
                <p className="text-xs md:text-sm font-semibold text-hednor-gold uppercase tracking-wide">
                  Limited Time Offer
                </p>
                <p className="text-lg md:text-xl font-bold">
                  Free Shipping on Orders Above ₹1999
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-hednor-gold text-hednor-dark rounded-full font-bold text-sm">
                Use Code: FREESHIP
              </div>
              <Link href="/products">
                <Button className="bg-white text-hednor-dark hover:bg-gray-100 font-semibold px-6 py-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      

      {/* Promotional Ticker */}
      <div className="bg-gradient-to-r from-hednor-gold via-yellow-400 to-hednor-gold text-hednor-dark py-3 overflow-hidden">
        <div className="relative">
          <div className="flex animate-scroll space-x-12 text-sm font-semibold whitespace-nowrap">
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span>Flash Sale: Extra 20% Off - Limited Time</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Star className="w-4 h-4" />
              <span>Up to 70% Off on Premium Brands</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Heart className="w-4 h-4" />
              <span>Buy 2 Get 1 Free on Selected Items</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Zap className="w-4 h-4" />
              <span>New User Special: Extra 15% Discount</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <ShoppingCart className="w-4 h-4" />
              <span>Mega Sale: Upto 80% Off Fashion</span>
            </div>
            {/* Duplicate for seamless scroll */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Clock className="w-4 h-4" />
              <span>Flash Sale: Extra 20% Off - Limited Time</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Star className="w-4 h-4" />
              <span>Up to 70% Off on Premium Brands</span>
            </div>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Heart className="w-4 h-4" />
              <span>Buy 2 Get 1 Free on Selected Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <section className="container mx-auto px-4 py-8 bg-gray-50">
        <h2 className="font-bold text-xl md:text-2xl text-center mb-6 text-gray-800 uppercase tracking-wide">
          Shop by Category
        </h2>

        {categoriesLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 md:h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories
              .filter(category => !category.parentId)
              .map((category) => (
                <CategoryCard key={category._id || category.id} category={category} />
              ))}
          </div>
        )}
      </section>

      {/* Trending Now */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl md:text-2xl text-gray-800 uppercase tracking-wide">
              Trending Now
            </h2>
            <Link href="/products?featured=true" className="text-pink-600 hover:text-pink-700 font-medium text-sm uppercase">
              See More
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 md:h-64 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-responsive">
              {featuredProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals for You */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 uppercase tracking-wide">
              Deals for You
            </h2>
            <Link href="/products?onSale=true" className="text-pink-600 hover:text-pink-700 font-medium text-sm uppercase self-start sm:self-auto">
              See More
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 md:h-64 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {saleProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Top Picks for You */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 uppercase tracking-wide">
              Related Top Picks for You
            </h2>
            <Link href="/products" className="text-pink-600 hover:text-pink-700 font-medium text-sm uppercase self-start sm:self-auto">
              See More
            </Link>
          </div>

          {productsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex bg-white border border-gray-100 rounded-lg overflow-hidden">
                  <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48" />
                  <div className="flex-1 p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.filter(p => p.rating >= 4.0).slice(0, 6).map((product) => (
                <div key={product._id || product.id} className="flex bg-white border border-gray-100 hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="flex w-full">
                    <div className="relative overflow-hidden bg-gray-50 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
                      <img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.isOnSale && product.salePrice && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium">
                            {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          {product.brand}
                        </p>
                        <h3 className="font-medium text-sm sm:text-base md:text-lg text-gray-800 mb-2 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex flex-col space-y-1 mb-2">
                            {product.salePrice ? (
                              <div className="space-y-1">
                                <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 block">
                                  ₹{parseFloat(product.salePrice).toLocaleString('en-IN')}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                  </span>
                                  <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                                    {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 block">
                                ₹{parseFloat(product.price).toLocaleString('en-IN')}
                              </span>
                            )}</div>
                          <div className="flex items-center">
                            <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                              <span className="font-medium">{product.rating || "4.0"}</span>
                              <Star className="w-3 h-3 ml-1 fill-current" />
                            </div>
                            <span className="text-xs text-gray-400">
                              ({product.reviewCount?.toLocaleString() || "1.2k"})
                            </span>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Must-Have Items */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 uppercase tracking-wide">
              Must-Have Items
            </h2>
            <Link href="/products?category=trending" className="text-pink-600 hover:text-pink-700 font-medium text-sm uppercase self-start sm:self-auto">
              See More
            </Link>
          </div>

          {productsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex bg-white border border-gray-100 rounded-lg overflow-hidden">
                  <Skeleton className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48" />
                  <div className="flex-1 p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.filter(p => p.reviewCount >= 500 || p.isFeatured).slice(0, 6).map((product) => (
                <div key={product._id || product.id} className="flex bg-white border border-gray-100 hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                  <Link href={`/products/${product.slug}`} className="flex w-full">
                    <div className="relative overflow-hidden bg-gray-50 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex-shrink-0">
                      <img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.isOnSale && product.salePrice && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium">
                            {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                          {product.brand}
                        </p>
                        <h3 className="font-medium text-sm sm:text-base md:text-lg text-gray-800 mb-2 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex flex-col space-y-1 mb-2">
                            {product.salePrice ? (
                              <div className="space-y-1">
                                <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 block">
                                  ₹{parseFloat(product.salePrice).toLocaleString('en-IN')}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs sm:text-sm text-gray-400 line-through">
                                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                                  </span>
                                  <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                                    {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                                  </Badge>
                                </div>
                              </div>
                            ) : (
                              <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 block">
                                ₹{parseFloat(product.price).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                              <span className="font-medium">{product.rating || "4.0"}</span>
                              <Star className="w-3 h-3 ml-1 fill-current" />
                            </div>
                            <span className="text-xs text-gray-400">
                              ({product.reviewCount?.toLocaleString() || "1.2k"})
                            </span>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-hednor-gold text-hednor-gold hover:bg-hednor-gold hover:text-hednor-dark"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals for You in Clothing and Accessories */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800 uppercase tracking-wide">
              Deals for You in Clothing & Accessories
            </h2>
            <Link href="/products?category=fashion&onSale=true" className="text-pink-600 hover:text-pink-700 font-medium text-sm uppercase self-start sm:self-auto">
              See More
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-40 sm:h-48 md:h-56 lg:h-64 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {products.filter(p => {
                const clothingCategories = categories.filter(cat => 
                  cat.name.toLowerCase().includes('clothing') || 
                  cat.name.toLowerCase().includes('fashion') ||
                  cat.name.toLowerCase().includes('accessories') ||
                  cat.name.toLowerCase().includes('apparel')
                ).map(cat => cat.id.toString());
                return clothingCategories.includes(p.categoryId?.toString() || '') && (p.isOnSale || p.salePrice);
              }).slice(0, 6).map((product) => (
                <div key={product._id || product.id} className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative overflow-hidden bg-gray-50">
                      <img
                        src={product.images?.[0] || ""}
                        alt={product.name}
                        className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {product.isOnSale && product.salePrice && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-red-500 text-white text-xs px-2 py-1 font-medium">
                            {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                        {product.brand}
                      </p>
                      <h3 className="font-medium text-sm sm:text-base text-gray-800 mb-2 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex flex-col space-y-1 mb-2">
                        {product.salePrice ? (
                          <div className="space-y-1">
                            <span className="font-bold text-sm sm:text-base text-gray-900 block">
                              ₹{parseFloat(product.salePrice).toLocaleString('en-IN')}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ₹{parseFloat(product.price).toLocaleString('en-IN')}
                              </span>
                              <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                                {Math.round(((parseFloat(product.price) - parseFloat(product.salePrice)) / parseFloat(product.price)) * 100)}% OFF
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-sm sm:text-base text-gray-900 block">
                            ₹{parseFloat(product.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">
                          <span className="font-medium">{product.rating || "4.0"}</span>
                          <Star className="w-3 h-3 ml-1 fill-current" />
                        </div>
                        <span className="text-xs text-gray-400">
                          ({product.reviewCount?.toLocaleString() || "1.2k"})
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-gradient-to-r from-hednor-gold to-yellow-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-4xl text-hednor-dark mb-4">
            End of Season Sale
          </h2>
          <p className="text-lg text-hednor-dark mb-6">Up to 70% off on selected items</p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Link href="/products?category=men&onSale=true">
              <Button className="bg-hednor-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Shop Men's Sale
              </Button>
            </Link>
            <Link href="/products?category=women&onSale=true">
              <Button className="bg-white text-hednor-dark px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Women's Sale
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Brands */}
      <TrendingBrands />

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Newsletter */}
      <section className="bg-hednor-dark py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new collections, exclusive deals, and fashion trends.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full md:flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-hednor-gold focus:border-transparent"
            />
            <Button className="w-full md:w-auto bg-hednor-gold text-hednor-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Professional Features Section - Before Footer */}
      <section className="bg-white border-t border-gray-100 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Why Choose Hednor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the best in fashion with our premium services and guaranteed satisfaction</p>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {/* Free Shipping */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-hednor-gold to-yellow-500 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Free Shipping</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">Above ₹1999</p>
              <p className="text-xs text-gray-500 leading-relaxed">Fast delivery across India with no extra charges</p>
            </div>

            {/* Authentic Products */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Authentic Products</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">100% Genuine</p>
              <p className="text-xs text-gray-500 leading-relaxed">Only original products from verified brands</p>
            </div>

            {/* Easy Returns */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Easy Returns</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">30 Day Policy</p>
              <p className="text-xs text-gray-500 leading-relaxed">Hassle-free returns and exchanges</p>
            </div>

            {/* 24/7 Support */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">24/7 Support</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">Live Chat</p>
              <p className="text-xs text-gray-500 leading-relaxed">Round-the-clock customer assistance</p>
            </div>
          </div>

          {/* Additional Features Row for Mobile */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mt-6 md:mt-8">
            {/* Secure Payment */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Secure Payment</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">SSL Protected</p>
              <p className="text-xs text-gray-500 leading-relaxed">Safe and secure payment processing</p>
            </div>

            {/* Quality Assurance */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Quality Assurance</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">Premium Quality</p>
              <p className="text-xs text-gray-500 leading-relaxed">Rigorous quality checks on all products</p>
            </div>

            {/* Fast Delivery */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Fast Delivery</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">Express Shipping</p>
              <p className="text-xs text-gray-500 leading-relaxed">Quick delivery in metro cities</p>
            </div>

            {/* Size Guide */}
            <div className="flex flex-col items-center text-center p-4 md:p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2V3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 21a4 4 0 004-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4zM17 3h2a2 2 0 012 2v12a4 4 0 01-4 4h-2V3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 text-base md:text-lg mb-2">Size Guide</h3>
              <p className="text-sm md:text-base text-gray-600 mb-1">Perfect Fit</p>
              <p className="text-xs text-gray-500 leading-relaxed">Detailed size charts for accurate fitting</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8 lg:mt-12">
            <Link href="/products">
              <Button className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 px-8 py-3 text-lg font-semibold rounded-lg transition-colors">
                Start Shopping Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed />

      {/* Footer */}
      <div className="-mt-8">
        <Footer />
      </div>

      {/* Floating Cart Icon */}
      <FloatingCartIcon />

      {/* Back to Top */}
      <BackToTop />

      {/* Newsletter Popup */}
      <NewsletterPopup />
      <FloatingActionButtons />
      <NotificationManager />
    </div>
  );
}
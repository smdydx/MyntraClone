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
import { ArrowRight, Star, Clock, Zap, Heart } from "lucide-react";

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: saleProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { onSale: true }],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Slider */}
      <div className="w-full overflow-hidden">
        <HeroSlider />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 sm:h-40 md:h-48 lg:h-56 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {products.filter(p => p.rating >= 4.0).slice(0, 6).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 sm:h-40 md:h-48 lg:h-56 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {products.filter(p => p.reviewCount >= 500 || p.isFeatured).slice(0, 6).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 sm:h-40 md:h-48 lg:h-56 rounded" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
              {products.filter(p => {
                const clothingCategories = categories.filter(cat => 
                  cat.name.toLowerCase().includes('clothing') || 
                  cat.name.toLowerCase().includes('fashion') ||
                  cat.name.toLowerCase().includes('accessories') ||
                  cat.name.toLowerCase().includes('apparel')
                ).map(cat => cat.id.toString());
                return clothingCategories.includes(p.categoryId?.toString() || '') && (p.isOnSale || p.salePrice);
              }).slice(0, 6).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
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

      {/* Recently Viewed */}
      <RecentlyViewed />

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
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
import type { Product, Category } from "@shared/schema";

const brands = ["H&M", "Zara", "Nike", "Adidas", "Puma", "Levi's"];

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-8 text-hednor-dark">
          Shop by Category
        </h2>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 md:h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-hednor-dark">
              Featured Products
            </h2>
            <Link href="/products" className="text-hednor-gold hover:text-yellow-600 font-medium">
              View All
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 md:h-64 rounded-t-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-8 text-hednor-dark">
            Trending Brands
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <div
                key={brand}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="font-bold text-lg text-gray-700">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <Footer />
    </div>
  );
}

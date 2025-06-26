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



export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { featured: true }],
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

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
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {featuredProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {/* Dummy Product 1 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
                  alt="Cotton Shirt"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">25% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Premium Cotton Shirt</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,499</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.2</span>
                  </div>
                  <span className="text-xs text-gray-400">(2.1k)</span>
                </div>
              </div>
            </div>

            {/* Dummy Product 2 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=400&fit=crop"
                  alt="Casual Jeans"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">30% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Slim Fit Jeans</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,399</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.4</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.8k)</span>
                </div>
              </div>
            </div>

            {/* Dummy Product 3 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop"
                  alt="Designer Dress"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">40% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Elegant Dress</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,799</span>
                  <span className="text-xs text-gray-400 line-through">₹2,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.6</span>
                  </div>
                  <span className="text-xs text-gray-400">(3.2k)</span>
                </div>
              </div>
            </div>

            {/* Dummy Product 4 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=400&fit=crop"
                  alt="Sneakers"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">35% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Sports Sneakers</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,299</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.3</span>
                  </div>
                  <span className="text-xs text-gray-400">(2.7k)</span>
                </div>
              </div>
            </div>

            {/* Dummy Product 5 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=400&fit=crop"
                  alt="Handbag"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">20% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Designer Handbag</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,599</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.5</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.5k)</span>
                </div>
              </div>
            </div>

            {/* Dummy Product 6 */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop"
                  alt="Watch"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">15% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Classic Watch</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹2,549</span>
                  <span className="text-xs text-gray-400 line-through">₹2,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.7</span>
                  </div>
                  <span className="text-xs text-gray-400">(4.1k)</span>
                </div>
              </div>
            </div>
          </div>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {/* Similar dummy products for Related Top Picks */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop"
                  alt="Formal Shirt"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Formal Shirt</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,799</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.4</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.9k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=400&fit=crop"
                  alt="Fashion Top"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Fashion Top</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹899</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.2</span>
                  </div>
                  <span className="text-xs text-gray-400">(2.3k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop"
                  alt="Jacket"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Stylish Jacket</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹2,499</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.5</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.7k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop"
                  alt="Sneakers"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Running Shoes</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.6</span>
                  </div>
                  <span className="text-xs text-gray-400">(3.4k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop"
                  alt="Backpack"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Travel Backpack</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,299</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.3</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.1k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1580902394112-8ac6c7eb5418?w=300&h=400&fit=crop"
                  alt="Sunglasses"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Sunglasses</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹799</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.1</span>
                  </div>
                  <span className="text-xs text-gray-400">(892)</span>
                </div>
              </div>
            </div>
          </div>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {/* Clothing and Accessories dummy products */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=400&fit=crop"
                  alt="Fashion Dress"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">50% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Summer Dress</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹999</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.3</span>
                  </div>
                  <span className="text-xs text-gray-400">(2.5k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop"
                  alt="Men's Shirt"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">40% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Casual Shirt</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,199</span>
                  <span className="text-xs text-gray-400 line-through">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.4</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.8k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop"
                  alt="Jewelry"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">30% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Gold Necklace</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹3,499</span>
                  <span className="text-xs text-gray-400 line-through">₹4,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.7</span>
                  </div>
                  <span className="text-xs text-gray-400">(956)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop"
                  alt="Belt"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">25% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Leather Belt</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹899</span>
                  <span className="text-xs text-gray-400 line-through">₹1,199</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.2</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.3k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop"
                  alt="Cap"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">35% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Baseball Cap</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹649</span>
                  <span className="text-xs text-gray-400 line-through">₹999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.0</span>
                  </div>
                  <span className="text-xs text-gray-400">(743)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1506629905853-b52dfd14bd5d?w=300&h=400&fit=crop"
                  alt="Scarf"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-red-500 text-white text-xs px-1.5 py-0.5 font-medium rounded">45% OFF</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Silk Scarf</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹549</span>
                  <span className="text-xs text-gray-400 line-through">₹999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.6</span>
                  </div>
                  <span className="text-xs text-gray-400">(1.2k)</span>
                </div>
              </div>
            </div>
          </div>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {/* Must-Have Items dummy products */}
            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop"
                  alt="Essential T-Shirt"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-green-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">BESTSELLER</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Essential T-Shirt</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹599</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.8</span>
                  </div>
                  <span className="text-xs text-gray-400">(5.2k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=400&fit=crop"
                  alt="Classic Jeans"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-blue-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">TRENDING</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Classic Jeans</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,799</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.6</span>
                  </div>
                  <span className="text-xs text-gray-400">(3.8k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop"
                  alt="White Sneakers"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-purple-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">ESSENTIAL</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">White Sneakers</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹2,299</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.7</span>
                  </div>
                  <span className="text-xs text-gray-400">(4.1k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=400&fit=crop"
                  alt="Basic Handbag"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-orange-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">POPULAR</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Basic Handbag</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,499</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.4</span>
                  </div>
                  <span className="text-xs text-gray-400">(2.9k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop"
                  alt="Everyday Watch"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-yellow-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">MUST-HAVE</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Everyday Watch</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹1,999</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.5</span>
                  </div>
                  <span className="text-xs text-gray-400">(3.3k)</span>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer bg-white border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop"
                  alt="Little Black Dress"
                  className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-pink-600 text-white text-xs px-1.5 py-0.5 font-medium rounded">CLASSIC</div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">HEDNOR</p>
                <h3 className="font-normal text-xs sm:text-sm text-gray-800 mb-1 sm:mb-2 line-clamp-1">Little Black Dress</h3>
                <div className="flex items-baseline space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                  <span className="font-bold text-xs sm:text-sm text-gray-900">₹2,799</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center bg-green-600 text-white text-xs px-1 py-0.5 rounded mr-1">
                    <span className="font-medium">4.9</span>
                  </div>
                  <span className="text-xs text-gray-400">(6.7k)</span>
                </div>
              </div>
            </div>
          </div>
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

      <Footer />
    </div>
  );
}
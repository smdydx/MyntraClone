import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import type { Product, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categoryParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  const featuredParam = urlParams.get('featured');
  const onSaleParam = urlParams.get('onSale');

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ["/api/products", { 
      categoryId: categoryParam ? (categories.find(c => c.slug === categoryParam)?.id || categories.find(c => c.slug === categoryParam)?._id) : undefined,
      search: searchParam,
      featured: featuredParam === 'true',
      onSale: onSaleParam === 'true'
    }],
    enabled: !categoryParam || categories.length > 0,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const products = productsResponse?.products || [];
  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  const sizes = Array.from(new Set(products.flatMap(p => p.sizes || []))).sort();

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.salePrice || product.price);
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || '');
    const matchesSize = selectedSizes.length === 0 || (product.sizes && product.sizes.some(size => selectedSizes.includes(size)));
    const productCategoryId = product.categoryId || product.category?.id || product.category?._id;
    const matchesCategory = selectedCategories.length === 0 || (productCategoryId && selectedCategories.includes(productCategoryId.toString()));

    return matchesPrice && matchesBrand && matchesSize && matchesCategory;
  });

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Categories */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-semibold mb-3 text-sm md:text-base text-gray-800 uppercase tracking-wide">Categories</h3>
        <div className="space-y-2 md:space-y-3">
          {categories.map((category) => {
            const categoryId = category.id || category._id;
            if (!categoryId) return null;

            return (
              <div key={categoryId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={`category-${categoryId}`}
                  checked={selectedCategories.includes(categoryId.toString())}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, categoryId.toString()]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== categoryId.toString()));
                    }
                  }}
                  className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 data-[state=checked]:bg-hednor-gold data-[state=checked]:border-hednor-gold"
                />
                <Label htmlFor={`category-${categoryId}`} className="text-sm md:text-base cursor-pointer font-medium text-gray-700 flex-1">
                  {category.name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-semibold mb-3 text-sm md:text-base text-gray-800 uppercase tracking-wide">Price Range</h3>
        <div className="px-2 md:px-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            step={100}
            className="w-full mb-4"
          />
          <div className="flex justify-between items-center">
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-center min-w-[80px]">
              <span className="text-sm font-semibold text-gray-700">₹{priceRange[0]}</span>
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-gray-500">to</span>
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg text-center min-w-[80px]">
              <span className="text-sm font-semibold text-gray-700">₹{priceRange[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="font-semibold mb-3 text-sm md:text-base text-gray-800 uppercase tracking-wide">Brands</h3>
        <div className="space-y-2 max-h-40 md:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                className="h-4 w-4 md:h-5 md:w-5 border-2 border-gray-300 data-[state=checked]:bg-hednor-gold data-[state=checked]:border-hednor-gold"
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm md:text-base cursor-pointer font-medium text-gray-700 flex-1">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="pb-4">
        <h3 className="font-semibold mb-3 text-sm md:text-base text-gray-800 uppercase tracking-wide">Sizes</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {sizes.map((size) => (
            <div
              key={size}
              className={`
                relative border-2 rounded-lg p-2 md:p-3 text-center cursor-pointer transition-all duration-200 touch-target
                ${selectedSizes.includes(size) 
                  ? 'border-hednor-gold bg-hednor-gold/10 text-hednor-gold font-semibold' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
              onClick={() => handleSizeChange(size, !selectedSizes.includes(size))}
            >
              <span className="text-sm md:text-base font-medium">{size}</span>
              {selectedSizes.includes(size) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-hednor-gold rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-poppins font-bold text-2xl md:text-3xl text-hednor-dark">
              {categoryParam ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Fashion` : 
               searchParam ? `Search Results for "${searchParam}"` : 
               'All Products'}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle - Now visible on all devices */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none px-2 sm:px-3"
              >
                <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none px-2 sm:px-3"
              >
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline ml-1">List</span>
              </Button>
            </div>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden flex items-center border-2 border-gray-300 hover:border-hednor-gold hover:text-hednor-gold px-4 py-2">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <span className="font-medium">Filters</span>
                  {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <span className="ml-2 bg-hednor-gold text-white text-xs px-2 py-1 rounded-full">
                      {selectedBrands.length + selectedSizes.length + selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[360px] max-w-[85vw] p-0 bg-white">
                <SheetHeader className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-lg font-bold text-gray-800">Filters</SheetTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setPriceRange([0, 10000]);
                        setSelectedBrands([]);
                        setSelectedSizes([]);
                        setSelectedCategories([]);
                      }}
                      className="text-hednor-gold hover:text-hednor-gold hover:bg-hednor-gold/10 font-medium"
                    >
                      Clear All
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredProducts.length} products found
                  </p>
                </SheetHeader>
                <div className="overflow-y-auto max-h-[calc(100vh-120px)] p-4">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedBrands.length > 0 || selectedSizes.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Active Filters</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setSelectedCategories([]);
                }}
                className="text-hednor-gold hover:text-hednor-gold hover:bg-hednor-gold/10 text-sm"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(c => (c.id || c._id)?.toString() === categoryId);
                return category ? (
                  <span key={categoryId} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {category.name}
                    <button 
                      onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== categoryId))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ) : null;
              })}
              {selectedBrands.map((brand) => (
                <span key={brand} className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {brand}
                  <button 
                    onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {selectedSizes.map((size) => (
                <span key={size} className="inline-flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  Size {size}
                  <button 
                    onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <span className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, 10000])}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-56 lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                    setSelectedCategories([]);
                  }}
                  className="text-hednor-gold hover:text-hednor-gold hover:bg-hednor-gold/10 font-medium"
                >
                  Clear All
                </Button>
              </div>
              <FilterSidebar />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-48 md:h-64 rounded-t-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6' 
                  : 'flex flex-col space-y-4'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product._id || `product-${index}`} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
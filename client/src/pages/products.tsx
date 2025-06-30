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

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/products", { 
      categoryId: categoryParam ? (categories.find(c => c.slug === categoryParam)?.id || categories.find(c => c.slug === categoryParam)?._id) : undefined,
      search: searchParam,
      featured: featuredParam === 'true',
      onSale: onSaleParam === 'true'
    }],
    enabled: !categoryParam || categories.length > 0,
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
      <div>
        <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Categories</h3>
        <div className="space-y-1 md:space-y-2">
          {categories.map((category) => {
            const categoryId = category.id || category._id;
            if (!categoryId) return null;

            return (
              <div key={categoryId} className="flex items-center space-x-2">
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
                  className="h-4 w-4"
                />
                <Label htmlFor={`category-${categoryId}`} className="text-xs md:text-sm cursor-pointer">
                  {category.name}
                </Label>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Price Range</h3>
        <div className="px-1 md:px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs md:text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Brands</h3>
        <div className="space-y-1 md:space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                className="h-4 w-4"
              />
              <Label htmlFor={`brand-${brand}`} className="text-xs md:text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base">Sizes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-1">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
                className="h-3 w-3 md:h-4 md:w-4"
              />
              <Label htmlFor={`size-${size}`} className="text-xs cursor-pointer">
                {size}
              </Label>
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
                <Button variant="outline" size="sm" className="md:hidden flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] max-w-[90vw] p-0">
                <SheetHeader>
                  <SheetTitle className="text-left">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto max-h-[calc(100vh-100px)] pr-2">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-56 lg:w-64 flex-shrink-0">
            <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
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
                  ? 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6' 
                  : 'flex flex-col space-y-4'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
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

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";

interface FilterProps {
  onFiltersChange: (filters: any) => void;
  categories: any[];
}

export function ProductFilters({ onFiltersChange, categories }: FilterProps) {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);

  const brands = ["Hednor", "Nike", "Adidas", "Puma", "Levi's"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Pink"];

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setIsOnSale(false);
    onFiltersChange({});
  };

  const applyFilters = () => {
    onFiltersChange({
      priceRange,
      brands: selectedBrands,
      sizes: selectedSizes,
      colors: selectedColors,
      isOnSale
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </span>
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range</h4>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div>
          <h4 className="font-medium mb-3">Brands</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <label htmlFor={brand} className="text-sm">{brand}</label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sizes */}
        <div>
          <h4 className="font-medium mb-3">Sizes</h4>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant={selectedSizes.includes(size) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => {
                  if (selectedSizes.includes(size)) {
                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                  } else {
                    setSelectedSizes([...selectedSizes, size]);
                  }
                }}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sale Items */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sale"
            checked={isOnSale}
            onCheckedChange={setIsOnSale}
          />
          <label htmlFor="sale" className="text-sm font-medium">
            On Sale Only
          </label>
        </div>

        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
}

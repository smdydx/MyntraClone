
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Scale } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: string[];
  brand: string;
  rating: number;
  sizes: string[];
  colors: string[];
}

interface ProductComparisonProps {
  products: Product[];
}

export function ProductComparison({ products }: ProductComparisonProps) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareList.length < 3 && !compareList.find(p => p._id === product._id)) {
      setCompareList([...compareList, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(compareList.filter(p => p._id !== productId));
  };

  const clearComparison = () => {
    setCompareList([]);
  };

  return (
    <>
      {/* Floating Compare Button */}
      {compareList.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg">
                <Scale className="w-4 h-4 mr-2" />
                Compare ({compareList.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  Product Comparison
                  <Button variant="ghost" size="sm" onClick={clearComparison}>
                    Clear All
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compareList.map((product) => (
                  <Card key={product._id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => removeFromCompare(product._id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <CardContent className="p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-sm mb-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span>Price:</span>
                          <div className="flex items-center space-x-1">
                            {product.salePrice ? (
                              <>
                                <span className="font-semibold">₹{product.salePrice}</span>
                                <span className="line-through text-gray-500">₹{product.price}</span>
                              </>
                            ) : (
                              <span className="font-semibold">₹{product.price}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>Rating:</span>
                          <span>{product.rating}/5 ⭐</span>
                        </div>
                        
                        <div>
                          <span className="block mb-1">Sizes:</span>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size) => (
                              <Badge key={size} variant="outline" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <span className="block mb-1">Colors:</span>
                          <div className="flex flex-wrap gap-1">
                            {product.colors.slice(0, 3).map((color) => (
                              <Badge key={color} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Add to Compare Button for Product Cards */}
      <div className="hidden">
        {products.map((product) => (
          <Button
            key={product._id}
            variant="outline"
            size="sm"
            onClick={() => addToCompare(product)}
            disabled={compareList.length >= 3 || compareList.find(p => p._id === product._id) !== undefined}
          >
            <Scale className="w-4 h-4 mr-1" />
            Compare
          </Button>
        ))}
      </div>
    </>
  );
}

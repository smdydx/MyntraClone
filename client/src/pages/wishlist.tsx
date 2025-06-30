
import { useState } from "react";
import { Heart, ShoppingCart, Trash2, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist, addToCart } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const handleRemoveFromWishlist = (productId: number, productName: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: `${productName} has been removed from your wishlist.`,
    });
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      name: item.name,
      brand: item.brand,
      price: item.price,
      salePrice: item.salePrice,
      image: item.image,
      quantity: 1,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleMoveToCart = (item: any) => {
    handleAddToCart(item);
    handleRemoveFromWishlist(item.productId, item.name);
    toast({
      title: "Moved to cart",
      description: `${item.name} has been moved from wishlist to cart.`,
    });
  };

  const sortedWishlistItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return parseFloat(a.salePrice || a.price) - parseFloat(b.salePrice || b.price);
      case 'price-high-low':
        return parseFloat(b.salePrice || b.price) - parseFloat(a.salePrice || a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return b.id - a.id; // newest first
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
              <div>
                <h1 className="font-poppins font-bold text-xl sm:text-2xl lg:text-3xl text-hednor-dark">
                  My Wishlist
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex items-center space-x-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <Card className="text-center py-12 sm:py-16">
              <CardContent className="space-y-4">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                    Start adding products you love to your wishlist. You can save items for later and never lose track of your favorites.
                  </p>
                </div>
                <Button 
                  className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 mt-6"
                  onClick={() => setLocation('/')}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {sortedWishlistItems.map((item) => (
                    <Card key={`${item.productId}-${item.id}`} className="group hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <div 
                          className="relative overflow-hidden cursor-pointer bg-gray-50"
                          onClick={() => setLocation(`/product/${item.productId}`)}
                        >
                          <img
                            src={item.image || "/placeholder-image.jpg"}
                            alt={item.name}
                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-image.jpg";
                            }}
                          />
                          {item.salePrice && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              {Math.round(((parseFloat(item.price) - parseFloat(item.salePrice)) / parseFloat(item.price)) * 100)}% OFF
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm w-8 h-8"
                          onClick={() => handleRemoveFromWishlist(item.productId, item.name)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>

                      <CardContent className="p-3 sm:p-4">
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                            {item.brand}
                          </p>
                          <h3 
                            className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 cursor-pointer hover:text-hednor-gold"
                            onClick={() => setLocation(`/product/${item.productId}`)}
                          >
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {item.salePrice ? (
                              <>
                                <span className="font-semibold text-hednor-dark text-sm">
                                  ₹{parseFloat(item.salePrice).toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-gray-500 line-through">
                                  ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                </span>
                              </>
                            ) : (
                              <span className="font-semibold text-hednor-dark text-sm">
                                ₹{parseFloat(item.price).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            className="w-full bg-hednor-gold text-hednor-dark hover:bg-yellow-500 text-xs"
                            onClick={() => handleMoveToCart(item)}
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Move to Cart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setLocation(`/product/${item.productId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {sortedWishlistItems.map((item) => (
                    <Card key={`${item.productId}-${item.id}`} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div 
                            className="relative w-full sm:w-32 md:w-40 flex-shrink-0 cursor-pointer"
                            onClick={() => setLocation(`/product/${item.productId}`)}
                          >
                            <img
                              src={item.image || "/placeholder-image.jpg"}
                              alt={item.name}
                              className="w-full h-40 sm:h-32 md:h-40 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-image.jpg";
                              }}
                            />
                            {item.salePrice && (
                              <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                                {Math.round(((parseFloat(item.price) - parseFloat(item.salePrice)) / parseFloat(item.price)) * 100)}% OFF
                              </Badge>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                                {item.brand}
                              </p>
                              <h3 
                                className="font-medium text-base text-gray-800 mb-2 cursor-pointer hover:text-hednor-gold line-clamp-2"
                                onClick={() => setLocation(`/product/${item.productId}`)}
                              >
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2 mb-3">
                                {item.salePrice ? (
                                  <>
                                    <span className="font-semibold text-hednor-dark text-lg">
                                      ₹{parseFloat(item.salePrice).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-hednor-dark text-lg">
                                    ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                              <Button
                                size="sm"
                                className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
                                onClick={() => handleMoveToCart(item)}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Move to Cart
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLocation(`/product/${item.productId}`)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 border-red-500 hover:bg-red-50"
                                onClick={() => handleRemoveFromWishlist(item.productId, item.name)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Action Bar */}
              {wishlistItems.length > 0 && (
                <Card className="mt-8">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-gray-600">
                        Total: {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            wishlistItems.forEach(item => {
                              handleAddToCart(item);
                            });
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add All to Cart
                        </Button>
                        <Button
                          className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500"
                          onClick={() => setLocation('/')}
                        >
                          Continue Shopping
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

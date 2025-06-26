import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const brands = [
  {
    id: 1,
    name: "Nike",
    image: "https://1000logos.net/wp-content/uploads/2021/11/Nike-Logo.png",
    offer: "Up to 40% OFF",
    category: "Sports & Fitness"
  },
  {
    id: 2,
    name: "Adidas",
    image: "https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo.png",
    offer: "Flat 30% OFF",
    category: "Athletic Wear"
  },
  {
    id: 3,
    name: "Puma",
    image: "https://1000logos.net/wp-content/uploads/2017/05/Puma-Logo.png",
    offer: "Buy 2 Get 1 Free",
    category: "Sportswear"
  },
  {
    id: 4,
    name: "H&M",
    image: "https://1000logos.net/wp-content/uploads/2017/02/HM-Logo.png",
    offer: "Up to 50% OFF",
    category: "Fashion"
  },
  {
    id: 5,
    name: "Zara",
    image: "https://1000logos.net/wp-content/uploads/2017/06/Zara-Logo.png",
    offer: "New Season Sale",
    category: "Premium Fashion"
  },
  {
    id: 6,
    name: "Levis",
    image: "https://1000logos.net/wp-content/uploads/2017/04/Levis-Logo.png",
    offer: "40% OFF on Jeans",
    category: "Denim"
  },
  {
    id: 7,
    name: "Tommy Hilfiger",
    image: "https://1000logos.net/wp-content/uploads/2017/09/Tommy-Hilfiger-Logo.png",
    offer: "Exclusive Collection",
    category: "Premium"
  },
  {
    id: 8,
    name: "Calvin Klein",
    image: "https://1000logos.net/wp-content/uploads/2017/06/Calvin-Klein-Logo.png",
    offer: "Limited Time Offer",
    category: "Designer"
  }
];

export default function TrendingBrands() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Trending Brands
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover the latest collections from your favorite brands with exclusive offers and unbeatable prices
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Card 
              key={brand.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
            >
              <CardContent className="p-6 text-center relative">
                {/* Offer Badge */}
                <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {brand.offer}
                </Badge>
                
                {/* Brand Logo */}
                <div className="h-16 flex items-center justify-center mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="max-h-12 max-w-24 object-contain filter group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f3f4f6"/>
                          <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle" dy=".3em">${brand.name}</text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>
                
                {/* Brand Info */}
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {brand.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {brand.category}
                </p>
                
                {/* Price Banner */}
                <div className="mt-4 bg-gradient-to-r from-hednor-gold to-yellow-400 text-hednor-dark px-3 py-2 rounded-lg text-sm font-medium">
                  Shop Now
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Special Offer Banner */}
        <div className="mt-12 bg-gradient-to-r from-hednor-gold via-yellow-400 to-yellow-500 rounded-xl p-8 text-center text-hednor-dark">
          <h3 className="text-2xl font-bold mb-2">Mega Brand Sale</h3>
          <p className="text-lg mb-4">Get up to 70% OFF on top brands + Extra 10% on prepaid orders</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-black/20 px-3 py-1 rounded-full">Free Shipping</span>
            <span className="bg-black/20 px-3 py-1 rounded-full">Easy Returns</span>
            <span className="bg-black/20 px-3 py-1 rounded-full">Authentic Products</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { ArrowRight, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Import brand images
import planetEraImage from "/src/assets/poster1.jpg";
import ramaeraImage from "/src/assets/poster2.jpeg";

const brandSlides = [
  {
    id: 1,
    title: "Planet Era Spices",
    subtitle: "अपना स्वाद, अपनों के साथ",
    description: "Discover authentic Indian spices and masalas for every culinary adventure",
    buttonText: "Shop Spices",
    buttonLink: "/products?category=spices",
    backgroundImage: planetEraImage,
    stats: { value: "100%", label: "Pure & Natural" },
    badge: "Premium Spices"
  },
  {
    id: 2,
    title: "Ramaera Electronics",
    subtitle: "Innovation for Every Need",
    description: "Cutting-edge electronics and appliances for modern living",
    buttonText: "Explore Electronics",
    buttonLink: "/products?category=electronics",
    backgroundImage: ramaeraImage,
    stats: { value: "24/7", label: "Customer Support" },
    badge: "Smart Technology"
  }
];

export default function BrandShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandSlides.length);
    }, 8000); // Slower slide transition (8 seconds)

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Slides */}
      {brandSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-2000 ease-in-out",
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-[8s] ease-out"
            style={{ backgroundImage: `url(${slide.backgroundImage})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <div className={cn(
              "transition-all duration-1000 ease-out transform",
              "translate-y-0 opacity-100"
            )}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full mb-4">
                <Award className="w-3 h-3 text-hednor-gold" />
                <span className="text-xs font-medium text-white">
                  {brandSlides[currentSlide].badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                {brandSlides[currentSlide].title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-hednor-gold mb-3 font-medium">
                {brandSlides[currentSlide].subtitle}
              </p>

              {/* Description */}
              <p className="text-sm md:text-base text-gray-200 mb-6 max-w-xl leading-relaxed">
                {brandSlides[currentSlide].description}
              </p>

              {/* CTA and Stats */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-hednor-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-hednor-gold font-semibold px-6 py-3 text-sm transition-all transform hover:scale-105 shadow-xl"
                  onClick={() => {
                    window.location.href = brandSlides[currentSlide].buttonLink;
                  }}
                >
                  {brandSlides[currentSlide].buttonText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-white">
                      {brandSlides[currentSlide].stats.value}
                    </div>
                    <div className="text-xs text-gray-400">
                      {brandSlides[currentSlide].stats.label}
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-gray-600" />
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-hednor-gold text-hednor-gold" />
                    ))}
                    <span className="text-white text-xs font-medium ml-1">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-2 border border-white/20">
          {brandSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "relative rounded-full transition-all duration-300 ease-out",
                index === currentSlide 
                  ? "w-2.5 h-2.5 bg-hednor-gold shadow-lg shadow-hednor-gold/40" 
                  : "w-2 h-2 bg-white/50 hover:bg-white/80"
              )}
            >
              <span className="sr-only">Go to slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2">
          <div className="text-white text-sm font-medium">
            <span className="text-hednor-gold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="text-white/50 mx-1">/</span>
            <span className="text-white/70">{String(brandSlides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

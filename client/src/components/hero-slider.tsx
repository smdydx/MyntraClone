import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    title: "New Collection",
    subtitle: "Spring Summer 2025",
    description: "Discover the latest trends in fashion with our premium collection",
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    title: "Premium Quality",
    subtitle: "Crafted with Care",
    description: "Experience luxury with our handpicked selection of premium garments",
    buttonText: "Explore Premium",
    buttonLink: "/products?category=premium",
    backgroundImage: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: 3,
    title: "Sale Up to 70% Off",
    subtitle: "Limited Time Offer",
    description: "Don't miss out on our biggest sale of the year",
    buttonText: "Shop Sale",
    buttonLink: "/products?sale=true",
    backgroundImage: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: 4,
    title: "Exclusive Designs",
    subtitle: "Hednor Studio Collection",
    description: "Unique pieces designed exclusively for fashion-forward individuals",
    buttonText: "View Collection",
    buttonLink: "/products?category=studio",
    backgroundImage: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentSlide
              ? "opacity-100 transform translate-x-0"
              : index < currentSlide
              ? "opacity-0 transform -translate-x-full"
              : "opacity-0 transform translate-x-full"
          )}
          style={{ background: slide.backgroundImage }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h2 className="text-sm md:text-base font-medium mb-2 opacity-90">
                {slide.subtitle}
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-xl">
                {slide.description}
              </p>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3 text-lg"
                onClick={() => {
                  window.location.href = slide.buttonLink;
                }}
              >
                {slide.buttonText}
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
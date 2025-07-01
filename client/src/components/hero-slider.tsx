import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideoPath from "/src/assets/hero-video.mp4";

const heroSlides = [
  {
    id: 1,
    title: "Fashion Video",
    subtitle: "Experience Fashion in Motion",
    description: "Watch our latest fashion showcase featuring the newest trends",
    buttonText: "Shop Now",
    buttonLink: "/products",
    isVideo: true,
    backgroundVideo: heroVideoPath,
  },
  {
    id: 2,
    title: "New Collection",
    subtitle: "Spring Summer 2025",
    description: "Discover the latest trends in fashion with our premium collection",
    buttonText: "Shop Now",
    buttonLink: "/products",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Crafted with Care",
    description: "Experience luxury with our handpicked selection of premium garments",
    buttonText: "Explore Premium",
    buttonLink: "/products?category=premium",
    backgroundImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&h=800&fit=crop&crop=center",
  },
  {
    id: 4,
    title: "Sale Up to 70% Off",
    subtitle: "Limited Time Offer",
    description: "Don't miss out on our biggest sale of the year",
    buttonText: "Shop Sale",
    buttonLink: "/products?sale=true",
    backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop&crop=center",
  },
  {
    id: 5,
    title: "Exclusive Designs",
    subtitle: "Hednor Studio Collection",
    description: "Unique pieces designed exclusively for fashion-forward individuals",
    buttonText: "View Collection",
    buttonLink: "/products?category=studio",
    backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop&crop=center",
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
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
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
        >
          {slide.isVideo ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center"
            >
              <source src={slide.backgroundVideo} type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/3252653/3252653-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            />
          )}

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />

          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="max-w-xl text-white">
              <h2 className="text-xs md:text-sm font-medium mb-2 opacity-90 text-hednor-gold">
                {slide.subtitle}
              </h2>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                {slide.title}
              </h1>
              <p className="text-sm md:text-base mb-4 opacity-90 max-w-md">
                {slide.description}
              </p>
              <Button
                size="default"
                className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 font-semibold px-5 py-2 text-sm transition-all transform hover:scale-105"
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

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-0.5 md:space-x-2 pagination-dot-container rounded-full px-1 md:px-3 py-0.5 md:py-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "relative rounded-full transition-all duration-500 ease-out hover:scale-110 group touch-manipulation",
              index === currentSlide
                ? "w-3 md:w-8 h-1 md:h-3 bg-hednor-gold shadow-lg shadow-hednor-gold/50 pagination-dot-active"
                : "w-1 md:w-3 h-1 md:h-3 bg-white/60 hover:bg-white/80 hover:shadow-md"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            {/* Active slide indicator with glow effect */}
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full bg-hednor-gold animate-pulse" />
            )}

            {/* Hover effect ring */}
            <div className={cn(
              "absolute inset-0 rounded-full border-2 border-transparent transition-all duration-300",
              index !== currentSlide && "group-hover:border-white/40 group-hover:scale-125"
            )} />

            {/* Progress indicator for current slide */}
            {index === currentSlide && (
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-hednor-gold rounded-full transition-all duration-500"
                  style={{
                    width: isAutoPlaying ? '100%' : '100%',
                    animation: isAutoPlaying ? 'slideProgress 5s linear infinite' : 'none'
                  }}
                />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
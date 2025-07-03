
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideoPath from "/src/assets/hero-video.mp4";

const heroSlides = [
  {
    id: 1,
    title: "Premium Fashion Experience",
    subtitle: "Elevate Your Style",
    description: "Discover curated collections from world-renowned designers and emerging talents",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    isVideo: true,
    backgroundVideo: heroVideoPath,
    stats: { value: "50K+", label: "Happy Customers" }
  },
  {
    id: 2,
    title: "Summer Collection 2024",
    subtitle: "Fresh & Trendy",
    description: "Embrace the season with our vibrant summer collection featuring the latest trends",
    buttonText: "Shop Summer",
    buttonLink: "/products?category=summer",
    backgroundImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=800&fit=crop&crop=center",
    stats: { value: "24/7", label: "Smart Support" }
  },
  {
    id: 3,
    title: "Limited Edition Drop",
    subtitle: "Exclusive Access",
    description: "Be among the first to access our exclusive limited edition collections",
    buttonText: "Get Early Access",
    buttonLink: "/products?featured=true",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center",
    stats: { value: "72h", label: "Express Delivery" }
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          )}
        >
          {slide.isVideo ? (
            <video
              className="absolute inset-0 w-full h-full object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center"
            >
              <source src={slide.backgroundVideo} type="video/mp4" />
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-6000 ease-out"
              style={{ 
                backgroundImage: `url(${slide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }}
            />
          )}

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-full lg:max-w-3xl">
            {/* Slide Content */}
            <div className={cn(
              "transition-all duration-1000 ease-out transform",
              "translate-y-0 opacity-100"
            )}>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full mb-4 sm:mb-6">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-hednor-gold" />
                <span className="text-xs sm:text-sm font-medium text-white">
                  {heroSlides[currentSlide].subtitle}
                </span>
                <div className="w-1 h-1 bg-hednor-gold rounded-full hidden sm:block" />
                <span className="text-xs text-gray-300 hidden sm:inline">Premium Collection</span>
              </div>

              {/* Main Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                <span className="block">
                  {heroSlides[currentSlide].title.split(' ').slice(0, -1).join(' ')}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hednor-gold via-yellow-400 to-hednor-gold">
                  {heroSlides[currentSlide].title.split(' ').slice(-1)}
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              {/* Stats & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-hednor-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-hednor-gold font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base transition-all transform hover:scale-105 shadow-2xl hover:shadow-hednor-gold/25 w-full sm:w-auto"
                  onClick={() => {
                    window.location.href = heroSlides[currentSlide].buttonLink;
                  }}
                >
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {heroSlides[currentSlide].stats.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {heroSlides[currentSlide].stats.label}
                    </div>
                  </div>
                  
                  <div className="w-px h-8 sm:h-12 bg-gray-600" />
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-hednor-gold text-hednor-gold" />
                      ))}
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 sm:gap-6 text-gray-300">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Secure Shopping</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Myntra-Style Navigation Controls */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Myntra-Style Slide Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md rounded-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative rounded-full transition-all duration-300 ease-out group",
                  index === currentSlide 
                    ? "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 shadow-lg shadow-red-500/40 scale-110" 
                    : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/80 hover:scale-105"
                )}
              >
                {index === currentSlide && (
                  <>
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                    {/* Inner shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-400 to-red-600" />
                  </>
                )}
                <span className="sr-only">Go to slide {index + 1}</span>
              </button>
            ))}
          </div>

          
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-30">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl px-3 md:px-4 py-2 md:py-3">
          <div className="text-white text-sm md:text-base font-medium">
            <span className="text-hednor-gold">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="text-white/50 mx-1">/</span>
            <span className="text-white/70">{String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Arrow Navigation */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
      </Button>

      
    </div>
  );
}


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
              <div className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-2 sm:px-4 py-1 sm:py-2 rounded-full mb-3 xs:mb-4 sm:mb-6 mx-auto xs:mx-0">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-hednor-gold flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  {heroSlides[currentSlide].subtitle}
                </span>
                <div className="w-1 h-1 bg-hednor-gold rounded-full hidden sm:block flex-shrink-0" />
                <span className="text-xs text-gray-300 hidden sm:inline truncate">Premium Collection</span>
              </div>

              {/* Main Title */}
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 xs:mb-4 sm:mb-6 leading-tight px-2 xs:px-0">
                <span className="block text-center xs:text-left">
                  {heroSlides[currentSlide].title.split(' ').slice(0, -1).join(' ')}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hednor-gold via-yellow-400 to-hednor-gold block text-center xs:text-left">
                  {heroSlides[currentSlide].title.split(' ').slice(-1)}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 xs:mb-6 sm:mb-8 max-w-2xl leading-relaxed px-2 xs:px-0 text-center xs:text-left">
                {heroSlides[currentSlide].description}
              </p>

              {/* Stats & CTA */}
              <div className="flex flex-col xs:flex-col sm:flex-row items-center xs:items-start sm:items-center gap-3 xs:gap-4 sm:gap-6 mb-4 xs:mb-6 sm:mb-8 px-2 xs:px-0">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-hednor-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-hednor-gold font-semibold px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-xs xs:text-sm sm:text-base transition-all transform hover:scale-105 shadow-2xl hover:shadow-hednor-gold/25 w-full xs:w-full sm:w-auto min-h-[44px] rounded-lg"
                  onClick={() => {
                    window.location.href = heroSlides[currentSlide].buttonLink;
                  }}
                >
                  <span className="truncate">{heroSlides[currentSlide].buttonText}</span>
                  <ArrowRight className="ml-1 xs:ml-2 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </Button>

                <div className="flex items-center justify-center xs:justify-start gap-3 xs:gap-4 sm:gap-6">
                  <div className="text-center xs:text-left">
                    <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      {heroSlides[currentSlide].stats.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {heroSlides[currentSlide].stats.label}
                    </div>
                  </div>
                  
                  <div className="w-px h-6 xs:h-8 sm:h-12 bg-gray-600" />
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 fill-hednor-gold text-hednor-gold" />
                      ))}
                    </div>
                    <span className="text-white text-xs sm:text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center xs:justify-start gap-3 xs:gap-4 sm:gap-6 text-gray-300 px-2 xs:px-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Secure Shopping</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Premium Quality</span>
                </div>
              </div>
            </div>
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

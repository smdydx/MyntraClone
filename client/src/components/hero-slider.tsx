
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight, Sparkles, Star, Shield, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroVideoPath from "/src/assets/hero-video.mp4";
import poster1 from "/src/assets/poster1.jpg";
import poster2 from "/src/assets/poster2.jpeg";
import poster3 from "/src/assets/poster3.jpg";

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
    id: 4,
    title: "Sustainable Luxury",
    subtitle: "Conscious Fashion Forward",
    description: "Where sustainability meets style - premium fashion with environmental responsibility",
    buttonText: "Shop Sustainable",
    buttonLink: "/products?category=sustainable",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center",
    stats: { value: "100%", label: "Authentic Products" }
  },
  {
    id: 5,
    title: "Executive Collection",
    subtitle: "Professional Excellence",
    description: "Meticulously crafted pieces for the modern professional and style connoisseur",
    buttonText: "View Executive Line",
    buttonLink: "/products?category=premium",
    backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop&crop=center",
    stats: { value: "24/7", label: "Concierge Service" }
  },
  {
    id: 6,
    title: "Limited Edition Drop",
    subtitle: "Exclusive Access",
    description: "Be among the first to access our exclusive limited edition collections",
    buttonText: "Get Early Access",
    buttonLink: "/products?featured=true",
    backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop&crop=center",
    stats: { value: "72h", label: "Express Delivery" }
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

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

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
    const video = document.querySelector('video');
    if (video) {
      if (isVideoPlaying) {
        video.pause();
      } else {
        video.play();
      }
    }
  };

  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
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
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={isVideoPlaying}
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center"
            >
              <source src={slide.backgroundVideo} type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/3252653/3252653-uhd_2560_1440_25fps.mp4" type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-100 transition-transform duration-[6s] ease-out"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
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
          <div className="max-w-3xl">
            {/* Slide Content */}
            <div className={cn(
              "transition-all duration-1000 ease-out transform",
              "translate-y-0 opacity-100"
            )}>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-hednor-gold" />
                <span className="text-sm font-medium text-white">
                  {heroSlides[currentSlide].subtitle}
                </span>
                <div className="w-1 h-1 bg-hednor-gold rounded-full" />
                <span className="text-xs text-gray-300">Premium Collection</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="block">
                  {heroSlides[currentSlide].title.split(' ').slice(0, -1).join(' ')}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hednor-gold via-yellow-400 to-hednor-gold">
                  {heroSlides[currentSlide].title.split(' ').slice(-1)}
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              {/* Stats & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-hednor-gold to-yellow-500 text-black hover:from-yellow-500 hover:to-hednor-gold font-semibold px-8 py-4 text-base transition-all transform hover:scale-105 shadow-2xl hover:shadow-hednor-gold/25"
                  onClick={() => {
                    window.location.href = heroSlides[currentSlide].buttonLink;
                  }}
                >
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      {heroSlides[currentSlide].stats.value}
                    </div>
                    <div className="text-sm text-gray-400">
                      {heroSlides[currentSlide].stats.label}
                    </div>
                  </div>
                  
                  <div className="w-px h-12 bg-gray-600" />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-hednor-gold text-hednor-gold" />
                      ))}
                    </div>
                    <span className="text-white text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Secure Shopping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Premium Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Myntra-Style Navigation Controls */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 md:gap-6">
          {/* Myntra-Style Slide Indicators */}
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md rounded-full px-4 py-3 border border-white/20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "relative rounded-full transition-all duration-300 ease-out group",
                  index === currentSlide 
                    ? "w-3 h-3 bg-red-500 shadow-lg shadow-red-500/40 scale-110" 
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80 hover:scale-105"
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

          {/* Enhanced Video Controls */}
          {heroSlides[currentSlide].isVideo && (
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-2 md:p-3">
              <button
                onClick={toggleVideo}
                className="relative p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-hednor-gold/20 to-yellow-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isVideoPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
                )}
              </button>
              <div className="w-px h-6 bg-white/20" />
              <div className="text-xs md:text-sm text-white/70 font-medium">
                {isVideoPlaying ? 'Playing' : 'Paused'}
              </div>
            </div>
          )}
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
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white w-8 h-8 md:w-12 md:h-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white w-8 h-8 md:w-12 md:h-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
      </Button>

      
    </div>
  );
}

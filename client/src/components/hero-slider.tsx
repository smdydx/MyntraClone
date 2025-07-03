
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Star, ArrowRight, Sparkles, ShoppingBag, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import heroVideoPath from "/src/assets/hero-video.mp4";

const heroSlides = [
  {
    id: 1,
    title: "Premium Fashion Collection",
    subtitle: "Luxury Redefined",
    description: "Experience the epitome of style with our exclusive designer collection featuring premium materials and craftsmanship",
    buttonText: "Explore Collection",
    buttonLink: "/products",
    tag: "NEW ARRIVAL",
    price: "Starting ₹2,999",
    discount: "50% OFF",
    isVideo: true,
    backgroundVideo: heroVideoPath,
    gradient: "from-purple-900/80 via-pink-800/70 to-orange-600/60",
    accentColor: "text-yellow-400",
  },
  {
    id: 2,
    title: "Summer Vibes 2025",
    subtitle: "Bold & Beautiful",
    description: "Embrace the season with vibrant colors and breathable fabrics designed for the modern fashion enthusiast",
    buttonText: "Shop Summer",
    buttonLink: "/products?category=summer",
    tag: "TRENDING",
    price: "From ₹1,499",
    discount: "40% OFF",
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop&crop=center",
    gradient: "from-cyan-900/80 via-blue-800/70 to-indigo-600/60",
    accentColor: "text-cyan-400",
  },
  {
    id: 3,
    title: "Exclusive Designer Wear",
    subtitle: "Crafted to Perfection",
    description: "Limited edition pieces that blend traditional craftsmanship with contemporary design aesthetics",
    buttonText: "View Exclusives",
    buttonLink: "/products?category=premium",
    tag: "LIMITED EDITION",
    price: "₹4,999 onwards",
    discount: "35% OFF",
    backgroundImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop&crop=center",
    gradient: "from-emerald-900/80 via-teal-800/70 to-green-600/60",
    accentColor: "text-emerald-400",
  },
  {
    id: 4,
    title: "Mega Sale Festival",
    subtitle: "Biggest Sale of the Year",
    description: "Unbeatable prices on premium fashion items. Limited time offer with exclusive deals you won't find anywhere else",
    buttonText: "Shop Sale",
    buttonLink: "/products?sale=true",
    tag: "MEGA SALE",
    price: "Up to 70% OFF",
    discount: "EXTRA 20% OFF",
    backgroundImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=800&fit=crop&crop=center",
    gradient: "from-red-900/80 via-pink-800/70 to-rose-600/60",
    accentColor: "text-red-400",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAutoPlaying) return;

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div 
      ref={containerRef}
      className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] overflow-hidden bg-black group"
    >
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
          {/* Media Background */}
          {slide.isVideo ? (
            <video
              ref={index === currentSlide ? videoRef : undefined}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={index === currentSlide}
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
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${slide.backgroundImage})` }}
            />
          )}

          {/* Animated Gradient Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-all duration-1000",
              slide.gradient
            )}
          />

          {/* Parallax Effect Overlay */}
          <div 
            className="absolute inset-0 opacity-30 transition-transform duration-300"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            }}
          />
        </div>
      ))}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          {/* Animated Tag */}
          <div className="mb-4 transform animate-fadeInUp">
            <Badge 
              className={cn(
                "px-4 py-2 text-sm font-bold tracking-wider border-2 border-white/30 backdrop-blur-md",
                currentSlideData.accentColor,
                "bg-white/10 hover:bg-white/20 transition-all duration-300"
              )}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {currentSlideData.tag}
            </Badge>
          </div>

          {/* Subtitle */}
          <h2 className={cn(
            "text-lg md:text-xl lg:text-2xl font-medium mb-3 opacity-90 tracking-wide transform animate-fadeInUp animation-delay-200",
            currentSlideData.accentColor
          )}>
            {currentSlideData.subtitle}
          </h2>

          {/* Main Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight text-white transform animate-fadeInUp animation-delay-400">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              {currentSlideData.title}
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg lg:text-xl mb-6 opacity-90 max-w-xl leading-relaxed text-gray-100 transform animate-fadeInUp animation-delay-600">
            {currentSlideData.description}
          </p>

          {/* Price and Discount */}
          <div className="flex flex-wrap items-center gap-4 mb-8 transform animate-fadeInUp animation-delay-800">
            <div className="flex items-center gap-3">
              <span className={cn("text-2xl md:text-3xl font-bold", currentSlideData.accentColor)}>
                {currentSlideData.price}
              </span>
              <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold animate-pulse">
                {currentSlideData.discount}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 transform animate-fadeInUp animation-delay-1000">
            <Button
              size="lg"
              className={cn(
                "group relative overflow-hidden px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105",
                "bg-gradient-to-r from-hednor-gold via-yellow-400 to-hednor-gold text-hednor-dark",
                "hover:shadow-2xl hover:shadow-yellow-500/25"
              )}
              onClick={() => window.location.href = currentSlideData.buttonLink}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {currentSlideData.buttonText}
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="group px-8 py-4 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="w-5 h-5 mr-2 group-hover:text-red-400 transition-colors duration-300" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Video Controls */}
      {currentSlideData.isVideo && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-6 right-6 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-all duration-300"
          onClick={toggleVideoPlayback}
        >
          {isVideoPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      )}

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 transform hover:scale-110"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-300 transform hover:scale-110"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-12 h-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110",
              index === currentSlide
                ? "bg-white shadow-lg shadow-white/25"
                : "bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20">
        <div 
          className={cn("h-full bg-gradient-to-r transition-all duration-100 ease-linear", currentSlideData.accentColor.replace('text-', 'bg-'))}
          style={{
            width: isAutoPlaying ? '100%' : '0%',
            transition: isAutoPlaying ? 'width 6000ms linear' : 'width 0.3s ease',
          }}
        />
      </div>

      {/* Floating Stats */}
      <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm font-medium">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>4.9/5 Rating</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-sm font-medium">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

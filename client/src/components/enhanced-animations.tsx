import React from 'react';

// Fade In Animation
export function FadeInAnimation({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="animate-fadeIn opacity-0"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
}

// Slide In Animation
export function SlideInAnimation({ 
  children, 
  direction = 'up', 
  delay = 0 
}: { 
  children: React.ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right'; 
  delay?: number 
}) {
  const animations = {
    up: 'animate-slideInUp',
    down: 'animate-slideInDown',
    left: 'animate-slideInLeft',
    right: 'animate-slideInRight'
  };

  return (
    <div 
      className={`${animations[direction]} opacity-0`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
}

// Scale Animation
export function ScaleAnimation({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="animate-scaleIn opacity-0 transform scale-95"
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
}

// Stagger Animation Container
export function StaggerContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {React.Children.map(children, (child, index) => (
        <FadeInAnimation delay={index * 100}>
          {child}
        </FadeInAnimation>
      ))}
    </div>
  );
}

// Hover Scale Effect
export function HoverScaleCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
}

// Floating Animation
export function FloatingAnimation({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-float">
      {children}
    </div>
  );
}

// Bounce on Scroll
export function BounceOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref}
      className={`transform transition-all duration-1000 ${
        isVisible ? 'animate-bounceIn opacity-100' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'wouter';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const [location] = useLocation();

  useEffect(() => {
    // Only load analytics in production
    if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      // Initialize gtag
      window.gtag = function() {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }, []);

  useEffect(() => {
    // Track page views
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location,
      });
    }
  }, [location]);

  return null;
}

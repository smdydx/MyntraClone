
import { useLocation } from "wouter";
import { useCallback } from "react";

export function useNavigation() {
  const [location, navigate] = useLocation();

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const navigateWithState = useCallback((path: string, state?: any) => {
    if (state) {
      window.history.pushState(state, '', path);
    }
    navigate(path);
  }, [navigate]);

  const getBreadcrumbs = useCallback(() => {
    const pathSegments = location.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({ label, href: currentPath });
    });
    
    return breadcrumbs;
  }, [location]);

  return {
    location,
    navigate,
    goBack,
    navigateWithState,
    getBreadcrumbs
  };
}

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  AlertCircle, Package, ShoppingCart, Users, DollarSign, TrendingUp, 
  Edit, Trash2, Plus, Eye, Search, Settings, BarChart3, Home, RefreshCw, 
  Upload, Bell, Menu, X, Activity, FileText, CheckCircle, Globe, Database, 
  Star, Smartphone, CreditCard 
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, PieChart, Pie, Cell 
} from "recharts";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  isOnSale: boolean;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
}

interface SiteSettings {
  _id: string;
  logoUrl: string;
  siteName: string;
  heroVideo: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  updatedAt: string;
  siteDescription?: string;
  faviconUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
  businessHours?: string;
  supportEmail?: string;
  accentColor?: string;
  fontFamily?: string;
  headerStyle?: string;
  footerStyle?: string;
  showBreadcrumbs?: boolean;
  showRecentlyViewed?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTA?: string;
  showHeroVideo?: boolean;
  aboutText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  metaDescription?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  enableSEO?: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  newOrdersToday: number;
  revenueToday: number;
  conversionRate: number;
  avgOrderValue: number;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  users: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image: string;
  }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  finalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  joinedAt: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

// Navigation Components
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
  badgeColor?: string;
  submenu?: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    badge?: number;
    badgeColor?: string;
  }[];
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  onClick, 
  badge, 
  badgeColor = "bg-blue-500",
  submenu 
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  return (
    <div className="space-y-1">
      <Button
        variant={isActive ? "default" : "ghost"}
        className={`w-full justify-between text-left h-auto py-3 px-4 ${
          isActive 
            ? "bg-blue-600 text-white shadow-md" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        onClick={() => {
          if (submenu && submenu.length > 0) {
            setIsSubmenuOpen(!isSubmenuOpen);
          }
          onClick?.();
        }}
      >
        <div className="flex items-center space-x-3">
          <div className={`${isActive ? "text-white" : "text-gray-500"}`}>
            {icon}
          </div>
          <span className="font-medium text-sm">{label}</span>
        </div>
        <div className="flex items-center space-x-2">
          {badge !== undefined && badge > 0 && (
            <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${badgeColor} min-w-[20px] h-5`}>
              {badge > 99 ? '99+' : badge}
            </span>
          )}
          {submenu && submenu.length > 0 && (
            <div className={`transition-transform duration-200 ${isSubmenuOpen ? 'rotate-90' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </Button>

      {submenu && submenu.length > 0 && (
        <div className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
          isSubmenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {submenu.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between text-left h-auto py-2 px-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-2 border-gray-200 dark:border-gray-600 ml-2"
              onClick={item.onClick}
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-400 dark:text-gray-500">
                  {item.icon}
                </div>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full ${item.badgeColor || badgeColor} min-w-[18px] h-4`}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

interface NavSectionProps {
  title: string;
  items: NavItemProps[];
}

const NavSection: React.FC<NavSectionProps> = ({ title, items }) => {
  return (
    <div className="space-y-2">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const handleMainNavClick = (tabName: string) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
    setExpandedSubmenu(null);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Order',
      message: 'Order #12345 received for ₹2,999',
      type: 'success',
      timestamp: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Nike Air Max has only 5 items left',
      type: 'warning',
      timestamp: '15 minutes ago',
      read: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of ₹5,499 confirmed',
      type: 'success',
      timestamp: '1 hour ago',
      read: true
    }
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    categoryId: '',
    price: 0,
    salePrice: 0,
    stockQuantity: 0,
    images: [],
    inStock: true,
    isFeatured: false,
    isOnSale: false,
  });

  const queryClient = useQueryClient();

  // Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token is valid by making a test request
      fetch('/api/admin/analytics/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      });
    }
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [queryClient, isLoggedIn]);

  // Real-time notification system
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        // Simulate real-time notifications
        const randomNotifications = [
          {
            id: Date.now().toString(),
            title: 'New Order Alert',
            message: `Order #${Math.floor(Math.random() * 10000)} received for ₹${Math.floor(Math.random() * 5000 + 1000)}`,
            type: 'success' as const,
            timestamp: 'Just now',
            read: false
          },
          {
            id: Date.now().toString(),
            title: 'Stock Alert',
            message: `${['iPhone 15', 'Samsung Galaxy', 'OnePlus Nord', 'Xiaomi Redmi'][Math.floor(Math.random() * 4)]} stock running low`,
            type: 'warning' as const,
            timestamp: 'Just now',
            read: false
          },
          {
            id: Date.now().toString(),
            title: 'High Traffic Alert',
            message: `${Math.floor(Math.random() * 500 + 100)} users currently browsing your store`,
            type: 'info' as const,
            timestamp: 'Just now',
            read: false
          }
        ];

        // Add random notification every 30 seconds
        if (Math.random() > 0.7) {
          const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
          setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Fetch dashboard data - Always call hooks, use enabled to control execution
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useQuery<DashboardStats>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics/overview", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isLoggedIn,
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const response = await fetch("/api/admin/products", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'x-admin-request': 'true'
        }
      });
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return Array.isArray(data) ? data : data.products || [];
    },
    retry: 2,
    enabled: isLoggedIn,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
    retry: 2,
    enabled: isLoggedIn,
  });

  // Fetch site settings
  const { data: siteSettings, isLoading: settingsLoading, error: settingsError } = useQuery<SiteSettings>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
    retry: 2,
    enabled: isLoggedIn,
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery<Order[]>({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
    retry: 2,
    enabled: isLoggedIn,
  });

  // Fetch users
  const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
    retry: 2,
    enabled: isLoggedIn,
  });

  // Product mutations
  const addProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsAddingProduct(false);
      toast({ title: "Product added successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete product", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Category mutations
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsAddingCategory(false);
      toast({ title: "Category added successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add category", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setEditingCategory(null);
      toast({ title: "Category updated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update category", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete category");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete category", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: any) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settingsData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings updated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update settings", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Calculate real sales data from orders
  const salesData: SalesData[] = React.useMemo(() => {
    if (!Array.isArray(orders) || !orders.length) return [];

    const monthlyData = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleDateString('en', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { month, revenue: 0, orders: 0, users: new Set() };
      }
      acc[month].revenue += order.finalAmount || 0;
      acc[month].orders += 1;
      acc[month].users.add(order.userId);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData).map((data: any) => ({
      month: data.month,
      revenue: data.revenue,
      orders: data.orders,
      users: data.users.size
    }));
  }, [orders]);

  // Calculate device data from real analytics or remove if not available
  const deviceData = React.useMemo(() => {
    // For now, we'll calculate based on user agents or remove this section
    // In a real app, this would come from analytics service
    return [
      { name: 'Mobile', value: 0, color: '#8884d8' },
      { name: 'Desktop', value: 0, color: '#82ca9d' },
      { name: 'Tablet', value: 0, color: '#ffc658' }
    ];
  }, []);

  // Calculate top products from real order data
  const topProducts = React.useMemo(() => {
    if (!Array.isArray(orders) || !orders.length) return [];

    const productSales = orders.reduce((acc, order) => {
      order.items?.forEach((item: any) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            name: item.name || 'Unknown Product',
            sales: 0,
            revenue: 0
          };
        }
        acc[item.productId].sales += item.quantity;
        acc[item.productId].revenue += (item.price * item.quantity);
      });
      return acc;
    }, {} as Record<string, any>);

    return Object.values(productSales)
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const recentOrders = orders.slice(0, 10); // Show latest 10 orders
  const recentUsers = users.slice(0, 10); // Show latest 10 users

  // Calculate sale products for homepage preview
  const saleProducts = React.useMemo(() => {
    return Array.isArray(products) ? products.filter(p => p.isOnSale || p.salePrice) : [];
  }, [products]);

  const filteredProducts = Array.isArray(products) ? products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleProductSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      brand: formData.get("brand"),
      categoryId: formData.get("categoryId"),
      price: parseFloat(formData.get("price") as string),
      salePrice: formData.get("salePrice") ? parseFloat(formData.get("salePrice") as string) : undefined,
      images: (formData.get("images") as string).split(",").map(url => url.trim()),
      sizes: (formData.get("sizes") as string).split(",").map(size => size.trim()),
      colors: (formData.get("colors") as string).split(",").map(color => color.trim()),
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()),
      inStock: formData.get("inStock") === "on",
      stockQuantity: parseInt(formData.get("stockQuantity") as string),
      isFeatured: formData.get("isFeatured") === "on",
      isOnSale: formData.get("isOnSale") === "on"
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: productData });
    } else {
      addProductMutation.mutate(productData);
    }
  };

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const parentId = formData.get("parentId") as string;
    const categoryData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image: formData.get("image"),
      parentId: parentId === "none" ? undefined : parentId,
      isActive: formData.get("isActive") === "on"
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory._id, data: categoryData });
    } else {
      addCategoryMutation.mutate(categoryData);
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settingsData = {
      // Branding
      logoUrl: formData.get("logoUrl"),
      faviconUrl: formData.get("faviconUrl"),
      siteName: formData.get("siteName"),
      siteDescription: formData.get("siteDescription"),
      primaryColor: formData.get("primaryColor"),
      secondaryColor: formData.get("secondaryColor"),
      accentColor: formData.get("accentColor"),
      fontFamily: formData.get("fontFamily"),

      // Hero Section
      heroTitle: formData.get("heroTitle"),
      heroSubtitle: formData.get("heroSubtitle"),
      heroCTA: formData.get("heroCTA"),
      heroVideo: formData.get("heroVideo"),
      heroImage: formData.get("heroImage"),
      showHeroVideo: formData.get("showHeroVideo") === "on",

      // Contact & Business
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
      supportEmail: formData.get("supportEmail"),
      businessAddress: formData.get("businessAddress"),
      businessHours: formData.get("businessHours"),
      aboutText: formData.get("aboutText"),
      footerText: formData.get("footerText"),

      // SEO
      metaDescription: formData.get("metaDescription"),
      metaKeywords: formData.get("metaKeywords"),

      // Display Options
      showBreadcrumbs: formData.get("showBreadcrumbs") === "on",
      showRecentlyViewed: formData.get("showRecentlyViewed") === "on",
      enableSEO: formData.get("enableSEO") === "on"
    };

    updateSettingsMutation.mutate(settingsData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl]
      }));
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        toast({ title: "Admin login successful" });
      } else {
        const error = await response.json();
        toast({ 
          title: "Login failed", 
          description: error.message,
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Login failed", 
        description: "Connection error",
        variant: "destructive" 
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    toast({ title: "Logged out successfully" });
  };

  const handleSeedData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/seed-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Sample data seeded successfully! Refresh the page to see the changes.');
        queryClient.invalidateQueries();
      } else {
        const error = await response.json();
        alert(`Failed to seed data: ${error.message}`);
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Failed to seed data. Please try again.');
    }
  };

  // Show login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login to Admin Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state for critical data
  if (statsLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if any critical data failed to load
  if (statsError || productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">There was an error loading the admin dashboard.</p>
          <Button onClick={() => queryClient.invalidateQueries()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </Button>
          </div>

          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out lg:block shadow-xl lg:shadow-none`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Management Dashboard</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {/* Dashboard */}
              <NavItem
                icon={<Activity className="h-5 w-5" />}
                label="Dashboard"
                isActive={activeTab === "dashboard"}
                onClick={() => handleMainNavClick("dashboard")}
              />

              {/* E-commerce Section */}
              <NavSection 
                title="E-Commerce"
                items={[
                  {
                    icon: <Package className="h-5 w-5" />,
                    label: "Products",
                    isActive: activeTab === "products",
                    onClick: () => handleMainNavClick("products"),
                    badge: Array.isArray(products) ? products.length : 0,
                    submenu: [
                      {
                        icon: <Plus className="h-4 w-4" />,
                        label: "Add Product",
                        onClick: () => {
                          setActiveTab("products");
                          setIsAddingProduct(true);
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <Package className="h-4 w-4" />,
                        label: "All Products",
                        onClick: () => {
                          setActiveTab("products");
                          setIsMobileMenuOpen(false);
                        },
                        badge: Array.isArray(products) ? products.length : 0
                      },
                      {
                        icon: <AlertCircle className="h-4 w-4" />,
                        label: "Low Stock",
                        onClick: () => {
                          setActiveTab("products");
                          setIsMobileMenuOpen(false);
                        },
                        badge: Array.isArray(products) ? products.filter(p => p.stockQuantity < 10).length : 0,
                        badgeColor: "bg-red-500"
                      },
                      {
                        icon: <Star className="h-4 w-4" />,
                        label: "Featured",
                        onClick: () => {
                          setActiveTab("products");
                          setIsMobileMenuOpen(false);
                        },
                        badge: Array.isArray(products) ? products.filter(p => p.isFeatured).length : 0,
                        badgeColor: "bg-yellow-500"
                      }
                    ]
                  },
                  {
                    icon: <FileText className="h-5 w-5" />,
                    label: "Categories",
                    isActive: activeTab === "categories",
                    onClick: () => handleMainNavClick("categories"),
                    badge: categories.length,
                    submenu: [
                      {
                        icon: <Plus className="h-4 w-4" />,
                        label: "Add Category",
                        onClick: () => {
                          setActiveTab("categories");
                          setIsAddingCategory(true);
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <FileText className="h-4 w-4" />,
                        label: "Main Categories",
                        onClick: () => {
                          setActiveTab("categories");
                          setIsMobileMenuOpen(false);
                        },
                        badge: categories.filter(cat => !cat.parentId).length
                      },
                      {
                        icon: <Globe className="h-4 w-4" />,
                        label: "Subcategories",
                        onClick: () => {
                          setActiveTab("categories");
                          setIsMobileMenuOpen(false);
                        },
                        badge: categories.filter(cat => cat.parentId).length
                      }
                    ]
                  },
                  {
                    icon: <ShoppingCart className="h-5 w-5" />,
                    label: "Orders",
                    isActive: activeTab === "orders",
                    onClick: () => handleMainNavClick("orders"),
                    badge: orders.length,
                    submenu: [
                      {
                        icon: <ShoppingCart className="h-4 w-4" />,
                        label: "All Orders",
                        onClick: () => {
                          setActiveTab("orders");
                          setIsMobileMenuOpen(false);
                        },
                        badge: orders.length
                      },
                      {
                        icon: <CheckCircle className="h-4 w-4" />,
                        label: "Pending",
                        onClick: () => {
                          setActiveTab("orders");
                          setIsMobileMenuOpen(false);
                        },
                        badge: orders.filter(o => o.status === 'pending').length,
                        badgeColor: "bg-orange-500"
                      },
                      {
                        icon: <CreditCard className="h-4 w-4" />,
                        label: "Payment Issues",
                        onClick: () => {
                          setActiveTab("orders");
                          setIsMobileMenuOpen(false);
                        },
                        badge: orders.filter(o => o.paymentStatus === 'failed').length,
                        badgeColor: "bg-red-500"
                      }
                    ]
                  }
                ]}
              />

              {/* Customer Management */}
              <NavSection
                title="Customer Management"
                items={[
                  {
                    icon: <Users className="h-5 w-5" />,
                    label: "Customers",
                    isActive: activeTab === "customers",
                    onClick: () => handleMainNavClick("users") ,
                    badge: users.length,
                    submenu: [
                      {
                        icon: <Users className="h-4 w-4" />,
                        label: "All Customers",
                        onClick: () => {
                          setActiveTab("customers");
                          setIsMobileMenuOpen(false);
                        },
                        badge: users.length
                      },
                      {
                        icon: <Star className="h-4 w-4" />,
                        label: "VIP Customers",
                        onClick: () => {
                          setActiveTab("customers");
                          setIsMobileMenuOpen(false);
                        },
                        badge: users.filter(u => u.totalSpent > 50000).length,
                        badgeColor: "bg-yellow-500"
                      },
                      {
                        icon: <Activity className="h-4 w-4" />,
                        label: "New Customers",
                        onClick: () => {
                          setActiveTab("customers");
                          setIsMobileMenuOpen(false);
                        },
                        badge: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length,
                        badgeColor: "bg-green-500"
                      }
                    ]
                  }
                ]}
              />

              {/* Analytics & Reports */}
              <NavSection
                title="Analytics & Reports"
                items={[
                  {
                    icon: <BarChart3 className="h-5 w-5" />,
                    label: "Analytics",
                    isActive: activeTab === "analytics",
                    onClick: () => handleMainNavClick("analytics") ,
                    submenu: [
                      {
                        icon: <TrendingUp className="h-4 w-4" />,
                        label: "Sales Reports",
                        onClick: () => {
                          setActiveTab("analytics");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <Activity className="h-4 w-4" />,
                        label: "Traffic Analytics",
                        onClick: () => {
                          setActiveTab("analytics");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <Globe className="h-4 w-4" />,
                        label: "Conversion Tracking",
                        onClick: () => {
                          setActiveTab("analytics");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <DollarSign className="h-4 w-4" />,
                        label: "Revenue Reports",
                        onClick: () => {
                          setActiveTab("analytics");
                          setIsMobileMenuOpen(false);
                        }
                      }
                    ]
                  }
                ]}
              />

              {/* System Settings */}
              <NavSection
                title="System"
                items={[
                  {
                    icon: <Settings className="h-5 w-5" />,
                    label: "Settings",
                    isActive: activeTab === "settings",
                    onClick: () => handleMainNavClick("settings") ,
                    submenu: [
                      {
                        icon: <Globe className="h-4 w-4" />,
                        label: "Site Settings",
                        onClick: () => {
                          setActiveTab("settings");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <CreditCard className="h-4 w-4" />,
                        label: "Payment Config",
                        onClick: () => {
                          setActiveTab("settings");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <Smartphone className="h-4 w-4" />,
                        label: "Mobile App",
                        onClick: () => {
                          setActiveTab("settings");
                          setIsMobileMenuOpen(false);
                        }
                      },
                      {
                        icon: <Bell className="h-4 w-4" />,
                        label: "Notifications",
                        onClick: () => {
                          setActiveTab("settings");
                          setIsMobileMenuOpen(false);
                        }
                      }
                    ]
                  }
                ]}
              />

              {/* Quick Tools */}
              <NavSection
                title="Quick Tools"
                items={[
                  {
                    icon: <Database className="h-5 w-5" />,
                    label: "Seed Data",
                    onClick: handleSeedData
                  },
                  {
                    icon: <Globe className="h-5 w-5" />,
                    label: "View Store",
                    onClick: () => window.open('/', '_blank')
                  },
                  {
                    icon: <RefreshCw className="h-5 w-5" />,
                    label: "Refresh Data",
                    onClick: () => queryClient.invalidateQueries()
                  }
                ]}
              />
            </div>

            <Separator className="my-6" />

            {/* Quick Stats */}
            <div className="space-y-3 p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Today's Sales</span>
                  <span className="font-medium text-green-600">₹{dashboardStats?.revenueToday?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">New Orders</span>
                  <span className="font-medium">{dashboardStats?.newOrdersToday || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Conversion</span>
                  <span className="font-medium">{dashboardStats?.conversionRate || 0}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Quick Stats overlay for mobile */}
            <div className="fixed bottom-4 right-4 z-50 lg:hidden">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.floor(Math.random() * 50 + 20)} Live Users
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm hidden lg:block">
                  Manage your e-commerce store efficiently
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>

                  {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Notifications</h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                          >
                            Mark all as read
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === 'success' ? 'bg-green-500' : 
                                notification.type === 'warning' ? 'bg-yellow-500' : 
                                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{notification.title}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</div>
                                <div className="text-xs text-gray-500 mt-1">{notification.timestamp}</div>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Refresh */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>

                {/* Logout */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-8">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700">₹{dashboardStats?.totalRevenue?.toLocaleString() || '0'}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1 text-green-600" />
                        +12.5% from last month
                      </p>
                      <Progress value={75} className="mt-2" />
                      <div className="text-xs text-green-600 mt-1 font-medium">Live Revenue Tracking</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats?.totalOrders || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +8.3% from last month
                      </p>
                      <Progress value={60} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +15.2% from last month
                      </p>
                      <Progress value={80} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{dashboardStats?.avgOrderValue?.toLocaleString() || '0'}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +5.7% from last month
                      </p>
                      <Progress value={45} className="mt-2" />
                    </CardContent>
                  </Card>

                  {/* Live Visitors Counter */}
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Live Visitors</CardTitle>
                      <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-700">{Math.floor(Math.random() * 50 + 20)}</div>
                      <p className="text-xs text-purple-600">
                        <Globe className="h-3 w-3 inline mr-1" />
                        Currently browsing
                      </p>
                      <div className="mt-2 text-xs">
                        <div className="flex justify-between text-gray-600">
                          <span>Mobile: {Math.floor(Math.random() * 30 + 10)}</span>
                          <span>Desktop: {Math.floor(Math.random() * 20 + 10)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Revenue Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                          <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fill="#FEF3C7" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Device Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-4 mt-4">
                        {deviceData.map((item) => (
                          <div key={item.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm">{item.name} ({item.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Orders */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Recent Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentOrders.map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{order.orderNumber}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{order.customerName}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                              <div className="text-right">
                                <div className="font-medium">₹{order.total.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{order.items?.length || 0} items</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Top Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topProducts.map((product, index) => (
                          <div key={product.name} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{product.name}</div>
                              <div className="text-xs text-gray-500">{product.sales} sales</div>
                            </div>
                            <div className="text-sm font-medium">₹{product.revenue.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Recent Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map((notification) => (
                        <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'warning' ? 'bg-yellow-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{notification.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Products Management</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage all your store products ({Array.isArray(products) ? products.length : 0} total)</p>
                  </div>
                  <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Create a new product by filling out the information below. All required fields are marked with *.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name" className="text-sm font-medium">Product Name *</Label>
                              <Input 
                                id="name" 
                                name="name" 
                                placeholder="Enter product name"
                                className="h-11"
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="slug" className="text-sm font-medium">URL Slug *</Label>
                              <Input 
                                id="slug" 
                                name="slug" 
                                placeholder="product-url-slug"
                                className="h-11"
                                required 
                              />
                              <p className="text-xs text-gray-500 mt-1">Used in product URL</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">Product Description</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            placeholder="Describe your product features, specifications, and benefits..."
                            rows={4}
                            className="resize-none"
                          />
                        </div>

                        {/* Category & Brand Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Category & Brand</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="brand" className="text-sm font-medium">Brand *</Label>
                              <Input 
                                id="brand" 
                                name="brand" 
                                placeholder="e.g., Nike, Apple, Samsung"
                                className="h-11"
                                required 
                              />
                            </div>
                          <div>
                            <Label htmlFor="categoryId">Category</Label>
                            <Select name="categoryId" required>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Choose a category for your product" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80">
                                {/* Main Categories */}
                                {categories.filter(cat => !cat.parentId).map((mainCategory) => (
                                  <div key={mainCategory._id}>
                                    <SelectItem 
                                      value={mainCategory._id}
                                      className="font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
                                    >
                                      📂 {mainCategory.name}
                                    </SelectItem>
                                    {/* Subcategories */}
                                    {categories
                                      .filter(cat => cat.parentId === mainCategory._id)
                                      .map((subCategory) => (
                                      <SelectItem 
                                        key={subCategory._id} 
                                        value={subCategory._id}
                                        className="pl-6 text-gray-700 border-l-2 border-gray-200 ml-2"
                                      >
                                        └── {subCategory.name}
                                      </SelectItem>
                                    ))}
                                  </div>
                                ))}

                                {/* Show message if no categories */}
                                {categories.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    <p className="text-sm">No categories available</p>
                                    <p className="text-xs mt-1">Please add categories first</p>
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-gray-500 mt-1">
                              Select the most specific category for your product
                            </p>
                          </div>
                        </div>
                        </div>
                        {/* Pricing Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="price" className="text-sm font-medium">Regular Price (₹) *</Label>
                              <Input 
                                id="price" 
                                name="price" 
                                type="number" 
                                step="0.01" 
                                min="0"
                                placeholder="0.00"
                                className="h-11"
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="salePrice" className="text-sm font-medium">Sale Price (₹)</Label>
                              <Input 
                                id="salePrice" 
                                name="salePrice" 
                                type="number" 
                                step="0.01" 
                                min="0"
                                placeholder="Optional discount price"
                                className="h-11"
                              />
                              <p className="text-xs text-gray-500 mt-1">Leave empty if not on sale</p>
                            </div>
                          </div>
                        </div>
                        {/* Media Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Images</h3>
                          <div>
                            <Label htmlFor="images" className="text-sm font-medium">Image URLs *</Label>
                            <Textarea 
                              id="images" 
                              name="images" 
                              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                              rows={3}
                              className="resize-none"
                              required 
                            />
                            <p className="text-xs text-gray-500 mt-1">Separate multiple URLs with commas</p>
                          </div>
                        </div>

                        {/* Product Details Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="sizes" className="text-sm font-medium">Available Sizes</Label>
                              <Input 
                                id="sizes" 
                                name="sizes" 
                                placeholder="XS, S, M, L, XL, XXL"
                                className="h-11"
                              />
                            </div>
                            <div>
                              <Label htmlFor="colors" className="text-sm font-medium">Available Colors</Label>
                              <Input 
                                id="colors" 
                                name="colors" 
                                placeholder="Red, Blue, Green, Black"
                                className="h-11"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="tags" className="text-sm font-medium">Product Tags</Label>
                            <Input 
                              id="tags" 
                              name="tags" 
                              placeholder="trendy, comfortable, bestseller, new-arrival"
                              className="h-11"
                            />
                            <p className="text-xs text-gray-500 mt-1">Used for search and filtering</p>
                          </div>
                        </div>

                        {/* Inventory Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Inventory</h3>
                          <div>
                            <Label htmlFor="stockQuantity" className="text-sm font-medium">Stock Quantity *</Label>
                            <Input 
                              id="stockQuantity" 
                              name="stockQuantity" 
                              type="number" 
                              min="0"
                              placeholder="100"
                              className="h-11"
                              required 
                            />
                          </div>
                        </div>
                        {/* Product Settings Section */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Settings</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <Label htmlFor="inStock" className="text-sm font-medium">In Stock</Label>
                                <p className="text-xs text-gray-500">Available for purchase</p>
                              </div>
                              <Switch id="inStock" name="inStock" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <Label htmlFor="isFeatured" className="text-sm font-medium">Featured</Label>
                                <p className="text-xs text-gray-500">Show on homepage</p>
                              </div>
                              <Switch id="isFeatured" name="isFeatured" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <Label htmlFor="isOnSale" className="text-sm font-medium">On Sale</Label>
                                <p className="text-xs text-gray-500">Special promotion</p>
                              </div>
                              <Switch id="isOnSale" name="isOnSale" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button 
                            type="submit" 
                            disabled={addProductMutation.isPending} 
                            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
                          >
                            {addProductMutation.isPending ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Adding Product...
                              </div>
                            ) : (
                              "Add Product"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Product Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Products</p>
                          <p className="text-2xl font-bold">{Array.isArray(products) ? products.length : 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">In Stock</p>
                          <p className="text-2xl font-bold">{Array.isArray(products) ? products.filter(p => p.inStock && p.stockQuantity > 0).length : 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="text-sm text-gray-600">Featured</p>
                          <p className="text-2xl font-bold">{Array.isArray(products) ? products.filter(p => p.isFeatured).length : 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="text-sm text-gray-600">Low Stock</p>
                          <p className="text-2xl font-bold">{Array.isArray(products) ? products.filter(p => p.stockQuantity < 10).length : 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Products Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>
                      Complete list of all products in your store. Click on any product to view details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search products by name or brand..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="inStock">In Stock</SelectItem>
                          <SelectItem value="outOfStock">Out of Stock</SelectItem>
                          <SelectItem value="featured">Featured</SelectItem>
                          <SelectItem value="onSale">On Sale</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Stock</TableHead>
                            <TableHead className="hidden lg:table-cell">Status</TableHead>
                            <TableHead className="hidden xl:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <Package className="h-12 w-12 text-gray-400" />
                                  <p className="text-gray-500">No products found</p>
                                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredProducts.map((product) => (
                            <TableRow key={product._id} className="hover:bg-gray-50">
                              <TableCell>
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium text-gray-900 mb-1">{product.name}</div>
                                  <div className="text-sm text-gray-500">{product.brand}</div>
                                  <div className="text-xs text-gray-400 mt-1">SKU: {product._id.slice(-8)}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  {product.salePrice && Number(product.salePrice) < Number(product.price) ? (
                                    <div>
                                      <div className="font-semibold text-green-600">₹{Number(product.salePrice).toLocaleString()}</div>
                                      <div className="text-sm text-gray-500 line-through">₹{Number(product.price).toLocaleString()}</div>
                                      <Badge className="bg-red-100 text-red-700 text-xs mt-1">
                                        {Math.round(((Number(product.price) - Number(product.salePrice)) / Number(product.price)) * 100)}% OFF
                                      </Badge>
                                    </div>
                                  ) : (
                                    <div className="font-semibold">₹{Number(product.price).toLocaleString()}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className={`inline-flex items-center gap-2 ${product.stockQuantity < 10 ? 'text-red-600' : product.stockQuantity < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                                  <div className={`w-2 h-2 rounded-full ${product.stockQuantity < 10 ? 'bg-red-500' : product.stockQuantity < 50 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                  <span className="font-medium">{product.stockQuantity}</span>
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="flex gap-1 flex-wrap">
                                  {product.inStock ? (
                                    <Badge className="bg-green-100 text-green-700">In Stock</Badge>
                                  ) : (
                                    <Badge variant="destructive">Out of Stock</Badge>
                                  )}
                                  {product.isFeatured && <Badge className="bg-blue-100 text-blue-700">Featured</Badge>}
                                  {product.isOnSale && <Badge className="bg-orange-100 text-orange-700">Sale</Badge>}
                                </div>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <div className="text-sm text-gray-500">
                                  {new Date(product.createdAt).toLocaleDateString('en-IN')}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-1 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => window.open(`/product/${product._id}`, '_blank')}
                                    title="View Product"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setEditingProduct(product)}
                                    title="Edit Product"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                        deleteProductMutation.mutate(product._id);
                                      }
                                    }}
                                    title="Delete Product"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Product Dialog */}
                <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                      <DialogDescription>
                        Update the product information below.
                      </DialogDescription>
                    </DialogHeader>
                    {editingProduct && (
                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-name">Product Name *</Label>
                              <Input 
                                id="edit-name" 
                                name="name" 
                                defaultValue={editingProduct.name}
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-slug">URL Slug *</Label>
                              <Input 
                                id="edit-slug" 
                                name="slug" 
                                defaultValue={editingProduct.slug}
                                required 
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea 
                              id="edit-description" 
                              name="description" 
                              defaultValue={editingProduct.description}
                              rows={4}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Category & Brand</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-brand">Brand *</Label>
                              <Input 
                                id="edit-brand" 
                                name="brand" 
                                defaultValue={editingProduct.brand}
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-categoryId">Category</Label>
                              <Select name="categoryId" defaultValue={editingProduct.categoryId}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Pricing</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-price">Regular Price (₹) *</Label>
                              <Input 
                                id="edit-price" 
                                name="price" 
                                type="number" 
                                step="0.01"
                                defaultValue={editingProduct.price}
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-salePrice">Sale Price (₹)</Label>
                              <Input 
                                id="edit-salePrice" 
                                name="salePrice" 
                                type="number" 
                                step="0.01"
                                defaultValue={editingProduct.salePrice || ""}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>
                          <div>
                            <Label htmlFor="edit-images">Image URLs *</Label>
                            <Textarea 
                              id="edit-images" 
                              name="images" 
                              defaultValue={editingProduct.images.join(", ")}
                              rows={3}
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Product Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-sizes">Sizes</Label>
                              <Input 
                                id="edit-sizes" 
                                name="sizes" 
                                defaultValue={editingProduct.sizes?.join(", ") || ""}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-colors">Colors</Label>
                              <Input 
                                id="edit-colors" 
                                name="colors" 
                                defaultValue={editingProduct.colors?.join(", ") || ""}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-tags">Tags</Label>
                            <Input 
                              id="edit-tags" 
                              name="tags" 
                              defaultValue={editingProduct.tags?.join(", ") || ""}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Inventory</h3>
                          <div>
                            <Label htmlFor="edit-stockQuantity">Stock Quantity *</Label>
                            <Input 
                              id="edit-stockQuantity" 
                              name="stockQuantity" 
                              type="number"
                              defaultValue={editingProduct.stockQuantity}
                              required 
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Settings</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <Label htmlFor="edit-inStock">In Stock</Label>
                              <Switch id="edit-inStock" name="inStock" defaultChecked={editingProduct.inStock} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <Label htmlFor="edit-isFeatured">Featured</Label>
                              <Switch id="edit-isFeatured" name="isFeatured" defaultChecked={editingProduct.isFeatured} />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <Label htmlFor="edit-isOnSale">On Sale</Label>
                              <Switch id="edit-isOnSale" name="isOnSale" defaultChecked={editingProduct.isOnSale} />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <Button 
                            type="submit" 
                            disabled={updateProductMutation.isPending} 
                            className="w-full"
                          >
                            {updateProductMutation.isPending ? "Updating..." : "Update Product"}
                          </Button>
                        </div>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage product categories and subcategories</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/admin/seed-categories', {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                          });
                          if (response.ok) {
                            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
                            toast({ title: "Categories seeded successfully" });
                          }
                        } catch (error) {
                          toast({ title: "Failed to seed categories", variant: "destructive" });
                        }
                      }}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Seed Categories
                    </Button>
                    <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Category</DialogTitle>
                          <DialogDescription>
                            Create a new category to organize your products. Fill in the category details below.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Category Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Electronics" required />
                          </div>
                          <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" placeholder="e.g., electronics" required />
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="Brief description of the category" />
                          </div>
                          <div>
                            <Label htmlFor="image">Image URL</Label>
                            <Input id="image" name="image" placeholder="https://example.com/category-image.jpg" />
                          </div>
                          <div>
                            <Label htmlFor="parentId">Parent Category (Optional)</Label>
                            <Select name="parentId">
                              <SelectTrigger>
                                <SelectValue placeholder="Select parent category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Parent (Main Category)</SelectItem>
                                {categories.filter(cat => !cat.parentId).map((category) => (
                                  <SelectItem key={category._id} value={category._id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="isActive" name="isActive" defaultChecked />
                            <Label htmlFor="isActive">Active</Label>
                          </div>
                          <Button type="submit" disabled={addCategoryMutation.isPending} className="w-full">
                            {addCategoryMutation.isPending ? "Adding..." : "Add Category"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Category Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Total Categories</p>
                          <p className="text-2xl font-bold">{categories.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Active</p>
                          <p className="text-2xl font-bold">{categories.filter(cat => cat.isActive).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-gray-600">Main Categories</p>
                          <p className="text-2xl font-bold">{categories.filter(cat => !cat.parentId).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-gray-600">Subcategories</p>
                          <p className="text-2xl font-bold">{categories.filter(cat => cat.parentId).length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="inactive">Inactive Only</SelectItem>
                      <SelectItem value="main">Main Categories</SelectItem>
                      <SelectItem value="sub">Subcategories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Categories Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Management</CardTitle>
                    <CardDescription>
                      Manage all your product categories. Click on a category to view its subcategories.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Products</TableHead>
                            <TableHead className="hidden xl:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories
                            .filter(category => 
                              category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              category.description?.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((category) => (
                            <TableRow key={category._id}>
                              <TableCell>
                                {category.image ? (
                                  <img 
                                    src={category.image} 
                                    alt={category.name}
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-sm text-gray-500">/{category.slug}</div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className="max-w-[200px] truncate">
                                  {category.description || "No description"}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Badge variant={category.parentId ? "outline" : "default"}>
                                  {category.parentId ? "Subcategory" : "Main Category"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={category.isActive ? "default" : "secondary"}>
                                  {category.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="text-sm text-gray-600">
                                  {Array.isArray(products) ? products.filter(p => p.categoryId === category._id).length : 0} products
                                </div>
                              </TableCell>
                              <TableCell className="hidden xl:table-cell">
                                <div className="text-sm text-gray-600">
                                  {new Date(category.createdAt).toLocaleDateString()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingCategory(category)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                                        deleteCategoryMutation.mutate(category._id);
                                      }
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                {/* Edit Category Dialog */}
                <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogDescription>
                        Update the category information below.
                      </DialogDescription>
                    </DialogHeader>
                    {editingCategory && (
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-cat-name">Category Name</Label>
                          <Input 
                            id="edit-cat-name" 
                            name="name" 
                            defaultValue={editingCategory.name}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-cat-slug">Slug</Label>
                          <Input 
                            id="edit-cat-slug" 
                            name="slug" 
                            defaultValue={editingCategory.slug}
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-cat-description">Description</Label>
                          <Textarea 
                            id="edit-cat-description" 
                            name="description" 
                            defaultValue={editingCategory.description || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-cat-image">Image URL</Label>
                          <Input 
                            id="edit-cat-image" 
                            name="image" 
                            defaultValue={editingCategory.image || ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-cat-parentId">Parent Category</Label>
                          <Select name="parentId" defaultValue={editingCategory.parentId || "none"}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Parent (Main Category)</SelectItem>
                              {categories.filter(cat => !cat.parentId && cat._id !== editingCategory._id).map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="edit-cat-isActive" 
                            name="isActive" 
                            defaultChecked={editingCategory.isActive} 
                          />
                          <Label htmlFor="edit-cat-isActive">Active</Label>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={updateCategoryMutation.isPending} 
                          className="w-full"
                        >
                          {updateCategoryMutation.isPending ? "Updating..." : "Update Category"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-bold">Orders</h2>
                {/* Display Orders Table */}
              </div>
            )}

            {activeTab === "customers" && (
              <div>
                <h2 className="text-2xl font-bold">Customers</h2>
                {/* Display Customers Table */}
              </div>
            )}

            {activeTab === "analytics" && (
              <div>
                <h2 className="text-2xl font-bold">Analytics</h2>
                {/* Display Analytics Charts and Data */}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Website Settings</h2>
                    <p className="text-gray-600 dark:text-gray-300">Manage your website's appearance and content</p>
                  </div>
                  <Button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] })}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <Tabs defaultValue="branding" className="space-y-6">
                  <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                    <TabsTrigger value="hero">Hero Section</TabsTrigger>
                    <TabsTrigger value="homepage">Homepage</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                  </TabsList>

                  {/* Branding Tab */}
                  <TabsContent value="branding">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Brand Settings
                        </CardTitle>
                        <CardDescription>
                          Update your site's logo, name, and brand colors
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="logoUrl">Logo URL</Label>
                                <Input 
                                  id="logoUrl" 
                                  name="logoUrl" 
                                  placeholder="https://example.com/logo.png"
                                  defaultValue={siteSettings?.logoUrl || ""}
                                />
                                <p className="text-xs text-gray-500 mt-1">Direct link to your logo image</p>
                              </div>
                              <div>
                                <Label htmlFor="faviconUrl">Favicon URL</Label>
                                <Input 
                                  id="faviconUrl" 
                                  name="faviconUrl" 
                                  placeholder="https://example.com/favicon.ico"
                                  defaultValue={siteSettings?.faviconUrl || ""}
                                />
                                <p className="text-xs text-gray-500 mt-1">Site icon shown in browser tab</p>
                              </div>
                              <div>
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input 
                                  id="siteName" 
                                  name="siteName" 
                                  placeholder="My E-Commerce Store"
                                  defaultValue={siteSettings?.siteName || ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="siteDescription">Site Description</Label>
                                <Textarea 
                                  id="siteDescription" 
                                  name="siteDescription" 
                                  placeholder="Brief description of your store"
                                  rows={3}
                                  defaultValue={siteSettings?.siteDescription || ""}
                                />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="primaryColor">Primary Color</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    id="primaryColor" 
                                    name="primaryColor" 
                                    placeholder="#F59E0B"
                                    defaultValue={siteSettings?.primaryColor || "#F59E0B"}
                                    className="flex-1"
                                  />
                                  <div 
                                    className="w-12 h-10 border rounded"
                                    style={{ backgroundColor: siteSettings?.primaryColor || "#F59E0B" }}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="secondaryColor">Secondary Color</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    id="secondaryColor" 
                                    name="secondaryColor" 
                                    placeholder="#6B7280"
                                    defaultValue={siteSettings?.secondaryColor || "#6B7280"}
                                    className="flex-1"
                                  />
                                  <div 
                                    className="w-12 h-10 border rounded"
                                    style={{ backgroundColor: siteSettings?.secondaryColor || "#6B7280" }}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="accentColor">Accent Color</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    id="accentColor" 
                                    name="accentColor" 
                                    placeholder="#EF4444"
                                    defaultValue={siteSettings?.accentColor || "#EF4444"}
                                    className="flex-1"
                                  />
                                  <div 
                                    className="w-12 h-10 border rounded"
                                    style={{ backgroundColor: siteSettings?.accentColor || "#EF4444" }}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="fontFamily">Font Family</Label>
                                <Select name="fontFamily" defaultValue={siteSettings?.fontFamily || "Inter"}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Inter">Inter</SelectItem>
                                    <SelectItem value="Roboto">Roboto</SelectItem>
                                    <SelectItem value="Poppins">Poppins</SelectItem>
                                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                                    <SelectItem value="Lato">Lato</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <Button type="submit" disabled={updateSettingsMutation.isPending}>
                              {updateSettingsMutation.isPending ? "Updating..." : "Update Branding"}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="general">
                    <Card>
                      <CardHeader>
                        <CardTitle>Seed Data</CardTitle>
                        <CardDescription>
                          Seed the database with sample data for testing and development.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={handleSeedData}>Seed Sample Data</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
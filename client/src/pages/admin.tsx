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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
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

  // Fetch dashboard data
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
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
    retry: 2,
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
    retry: 2,
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
  });

  // Mock data for demonstration
  const salesData: SalesData[] = [
    { month: "Jan", revenue: 125000, orders: 450, users: 120 },
    { month: "Feb", revenue: 142000, orders: 520, users: 140 },
    { month: "Mar", revenue: 165000, orders: 610, users: 180 },
    { month: "Apr", revenue: 198000, orders: 720, users: 220 },
    { month: "May", revenue: 225000, orders: 830, users: 250 },
    { month: "Jun", revenue: 255000, orders: 950, users: 300 }
  ];

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#8884d8' },
    { name: 'Desktop', value: 25, color: '#82ca9d' },
    { name: 'Tablet', value: 10, color: '#ffc658' }
  ];

  const topProducts = [
    { name: "Nike Air Max", sales: 245, revenue: 73500 },
    { name: "Adidas Ultraboost", sales: 189, revenue: 56700 },
    { name: "Puma RS-X", sales: 156, revenue: 46800 },
    { name: "New Balance 574", sales: 134, revenue: 40200 },
    { name: "Vans Old Skool", sales: 98, revenue: 29400 }
  ];

  const recentOrders = orders.slice(0, 10); // Show latest 10 orders

  const recentUsers = users.slice(0, 10); // Show latest 10 users

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
      logoUrl: formData.get("logoUrl"),
      siteName: formData.get("siteName"),
      heroVideo: formData.get("heroVideo"),
      primaryColor: formData.get("primaryColor"),
      secondaryColor: formData.get("secondaryColor"),
      footerText: formData.get("footerText")
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out lg:block`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Admin Panel</h2>

            {/* Navigation */}
            <nav className="space-y-2">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Activity className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("products");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
              <Button
                variant={activeTab === "categories" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("categories");
                  setIsMobileMenuOpen(false);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Categories
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("orders");
                  setIsMobileMenuOpen(false);
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button
                variant={activeTab === "customers" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("customers");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("analytics");
                  setIsMobileMenuOpen(false);
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("settings");
                  setIsMobileMenuOpen(false);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>

            <Separator className="my-6" />

            {/* Quick Stats */}
            <div className="space-y-3">
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
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
                <Button variant="outline" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>

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
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{dashboardStats?.totalRevenue?.toLocaleString() || '0'}</div>
                      <p className="text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 inline mr-1" />
                        +12.5% from last month
                      </p>
                      <Progress value={75} className="mt-2" />
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
                  <h2 className="text-2xl font-bold">Products</h2>
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
                          Create a new product by filling out the information below.
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

                <Card>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Brand</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Stock</TableHead>
                            <TableHead className="hidden lg:table-cell">Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-gray-500 sm:hidden">{product.brand}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">{product.brand}</TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">₹{product.price}</div>
                                  {product.salePrice && (
                                    <div className="text-sm text-red-600">₹{product.salePrice}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <div className={`text-sm ${product.stockQuantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                  {product.stockQuantity}
                                </div>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
                                <div className="flex gap-1 flex-wrap">
                                  {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
                                  {product.isOnSale && <Badge variant="destructive">Sale</Badge>}
                                  {!product.inStock && <Badge variant="outline">Out of Stock</Badge>}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteProductMutation.mutate(product._id)}
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
                            Create a new category to organize your products.
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
                                  {products.filter(p => p.categoryId === category._id).length} products
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

                {/* Category Tree View */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Category Hierarchy
                    </CardTitle>
                    <CardDescription>
                      Hierarchical view of all categories and their subcategories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories
                        .filter(cat => !cat.parentId)
                        .map((mainCategory) => (
                        <div key={mainCategory._id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {mainCategory.image && (
                                <img 
                                  src={mainCategory.image} 
                                  alt={mainCategory.name}
                                  className="w-8 h-8 rounded object-cover"
                                />
                              )}
                              <div>
                                <h4 className="font-medium">{mainCategory.name}</h4>
                                <p className="text-sm text-gray-500">{mainCategory.description}</p>
                              </div>
                            </div>
                            <Badge variant={mainCategory.isActive ? "default" : "secondary"}>
                              {mainCategory.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {categories
                            .filter(subCategory => subCategory.parentId === mainCategory._id)
                            .map((subCategory) => (
                            <div key={subCategory._id} className="pl-8 border-l border-gray-300">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {subCategory.image && (
                                    <img 
                                      src={subCategory.image} 
                                      alt={subCategory.name}
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  )}
                                  <div>
                                    <h4 className="font-medium">{subCategory.name}</h4>
                                    <p className="text-sm text-gray-500">{subCategory.description}</p>
                                  </div>
                                </div>
                                <Badge variant={subCategory.isActive ? "default" : "secondary"}>
                                  {subCategory.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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
                <h2 className="text-2xl font-bold">Settings</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>
                      Update your site's general settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSettingsSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input id="logoUrl" name="logoUrl" placeholder="https://example.com/logo.png" />
                      </div>
                      <div>
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input id="siteName" name="siteName" placeholder="My E-Commerce Store" />
                      </div>
                      <div>
                        <Label htmlFor="heroVideo">Hero Video URL</Label>
                        <Input id="heroVideo" name="heroVideo" placeholder="https://example.com/hero-video.mp4" />
                      </div>
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <Input id="primaryColor" name="primaryColor" placeholder="#007BFF" />
                      </div>
                      <div>
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <Input id="secondaryColor" name="secondaryColor" placeholder="#6C757D" />
                      </div>
                      <div>
                        <Label htmlFor="footerText">Footer Text</Label>
                        <Input id="footerText" name="footerText" placeholder="© 2023 My E-Commerce Store" />
                      </div>
                      <Button type="submit" disabled={updateSettingsMutation.isPending}>
                        {updateSettingsMutation.isPending ? "Updating..." : "Update Settings"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { 
  Plus, Edit, Trash2, Eye, Package, Users, ShoppingCart, DollarSign, 
  TrendingUp, TrendingDown, Star, Clock, AlertCircle, CheckCircle,
  Settings, FileText, Image, Bell, Download, Upload, Filter,
  Search, Calendar, Menu, X, MoreVertical, RefreshCw, Activity,
  Globe, Smartphone, Laptop, Tablet, Monitor, Mail, Phone,
  MapPin, CreditCard, Truck, Box, Heart, MessageSquare
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  items: number;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  joinedAt: string;
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

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  // Fetch dashboard data
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics/overview", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    }
  });

  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    }
  });

  // Fetch site settings
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    }
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

  const recentOrders: Order[] = [
    {
      _id: '1',
      orderNumber: 'ORD-001',
      customerName: 'Rahul Sharma',
      customerEmail: 'rahul@example.com',
      status: 'Processing',
      total: 2999,
      items: 2,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Priya Singh',
      customerEmail: 'priya@example.com',
      status: 'Shipped',
      total: 4599,
      items: 3,
      createdAt: '2024-01-15T09:15:00Z'
    }
  ];

  const recentUsers: User[] = [
    {
      _id: '1',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      joinedAt: '2024-01-15',
      totalOrders: 5,
      totalSpent: 15000,
      status: 'Active'
    },
    {
      _id: '2',
      name: 'Sneha Patel',
      email: 'sneha@example.com',
      joinedAt: '2024-01-14',
      totalOrders: 2,
      totalSpent: 6000,
      status: 'Active'
    }
  ];

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
      if (!response.ok) throw new Error("Failed to add product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsAddingProduct(false);
      toast({ title: "Product added successfully" });
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
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
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
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast({ title: "Product deleted successfully" });
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
      if (!response.ok) throw new Error("Failed to add category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsAddingCategory(false);
      toast({ title: "Category added successfully" });
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
      if (!response.ok) throw new Error("Failed to update category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setEditingCategory(null);
      toast({ title: "Category updated successfully" });
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
      if (!response.ok) throw new Error("Failed to delete category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast({ title: "Category deleted successfully" });
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
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings updated successfully" });
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
    const categoryData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      image: formData.get("image"),
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
                                <div className="text-xs text-gray-500">{order.items} items</div>
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
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" required />
                          </div>
                          <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" required />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" name="brand" required />
                          </div>
                          <div>
                            <Label htmlFor="categoryId">Category</Label>
                            <Select name="categoryId" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price</Label>
                            <Input id="price" name="price" type="number" step="0.01" required />
                          </div>
                          <div>
                            <Label htmlFor="salePrice">Sale Price</Label>
                            <Input id="salePrice" name="salePrice" type="number" step="0.01" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="images">Images (comma-separated URLs)</Label>
                          <Textarea id="images" name="images" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                            <Input id="sizes" name="sizes" />
                          </div>
                          <div>
                            <Label htmlFor="colors">Colors (comma-separated)</Label>
                            <Input id="colors" name="colors" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="tags">Tags (comma-separated)</Label>
                          <Input id="tags" name="tags" />
                        </div>
                        <div>
                          <Label htmlFor="stockQuantity">Stock Quantity</Label>
                          <Input id="stockQuantity" name="stockQuantity" type="number" required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="inStock" name="inStock" defaultChecked />
                            <Label htmlFor="inStock">In Stock</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="isFeatured" name="isFeatured" />
                            <Label htmlFor="isFeatured">Featured</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="isOnSale" name="isOnSale" />
                            <Label htmlFor="isOnSale">On Sale</Label>
                          </div>
                        </div>
                        <Button type="submit" disabled={addProductMutation.isPending} className="w-full">
                          Add Product
                        </Button>
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
                  <h2 className="text-2xl font-bold">Categories</h2>
                  <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Category</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Category Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                        <div>
                          <Label htmlFor="slug">Slug</Label>
                          <Input id="slug" name="slug" required />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" />
                        </div>
                        <div>
                          <Label htmlFor="image">Image URL</Label>
                          <Input id="image" name="image" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="isActive" name="isActive" defaultChecked />
                          <Label htmlFor="isActive">Active</Label>
                        </div>
                        <Button type="submit" disabled={addCategoryMutation.isPending} className="w-full">
                          Add Category
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Card key={category._id}>
                      <CardContent className="p-4">
                        {category.image && (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-full h-32 rounded object-cover mb-3"
                          />
                        )}
                        <h3 className="font-medium text-lg mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex gap-2">
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
                              onClick={() => deleteCategoryMutation.mutate(category._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Orders Management</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">24</div>
                      <p className="text-xs text-muted-foreground">Require attention</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">18</div>
                      <p className="text-xs text-muted-foreground">Being prepared</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Shipped</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">42</div>
                      <p className="text-xs text-muted-foreground">On the way</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead className="hidden sm:table-cell">Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentOrders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell className="font-medium">{order.orderNumber}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div>
                                  <div className="font-medium">{order.customerName}</div>
                                  <div className="text-sm text-gray-500">{order.customerEmail}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">₹{order.total.toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
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

            {activeTab === "customers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customer Management</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,847</div>
                      <p className="text-xs text-muted-foreground">+12% this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">2,401</div>
                      <p className="text-xs text-muted-foreground">84% of total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">184</div>
                      <p className="text-xs text-muted-foreground">+23% vs last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Joined</TableHead>
                            <TableHead>Orders</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead className="hidden md:table-cell">Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentUsers.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {new Date(user.joinedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{user.totalOrders}</TableCell>
                              <TableCell className="font-medium">₹{user.totalSpent.toLocaleString()}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant="default">{user.status}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Mail className="h-4 w-4" />
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

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Advanced Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
                          <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="users" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Direct</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <Progress value={45} />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Search Engines</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <Progress value={30} />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Social Media</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <Progress value={15} />
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Referrals</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <Progress value={10} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">Visitors</span>
                          <span className="font-medium">10,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Product Views</span>
                          <span className="font-medium">6,500</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Add to Cart</span>
                          <span className="font-medium">2,800</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Checkout</span>
                          <span className="font-medium">1,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Purchase</span>
                          <span className="font-medium text-green-600">950</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Conversion Rate</span>
                            <span className="font-medium">9.5%</span>
                          </div>
                          <Progress value={95} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Cart Abandonment</span>
                            <span className="font-medium">65%</span>
                          </div>
                          <Progress value={65} className="bg-red-100" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Customer Retention</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <Progress value={78} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Return Rate</span>
                            <span className="font-medium">12%</span>
                          </div>
                          <Progress value={12} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Site Settings</h2>
                
                {siteSettings && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Manage your site configuration</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSettingsSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input 
                              id="siteName" 
                              name="siteName" 
                              defaultValue={siteSettings.siteName}
                              required 
                            />
                          </div>
                          <div>
                            <Label htmlFor="logoUrl">Logo URL</Label>
                            <Input 
                              id="logoUrl" 
                              name="logoUrl" 
                              defaultValue={siteSettings.logoUrl}
                              required 
                            />
                          </div>
                          <div>
                            <Label htmlFor="heroVideo">Hero Video URL</Label>
                            <Input 
                              id="heroVideo" 
                              name="heroVideo" 
                              defaultValue={siteSettings.heroVideo}
                              required 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="primaryColor">Primary Color</Label>
                              <Input 
                                id="primaryColor" 
                                name="primaryColor" 
                                type="color"
                                defaultValue={siteSettings.primaryColor}
                                required 
                              />
                            </div>
                            <div>
                              <Label htmlFor="secondaryColor">Secondary Color</Label>
                              <Input 
                                id="secondaryColor" 
                                name="secondaryColor" 
                                type="color"
                                defaultValue={siteSettings.secondaryColor}
                                required 
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="footerText">Footer Text</Label>
                            <Textarea 
                              id="footerText" 
                              name="footerText" 
                              defaultValue={siteSettings.footerText}
                              required 
                            />
                          </div>
                          <Button type="submit" disabled={updateSettingsMutation.isPending} className="w-full">
                            Update Settings
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Current system status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm">Server Status</span>
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Database</span>
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Last Backup</span>
                            <span className="text-sm text-gray-600">2 hours ago</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Version</span>
                            <span className="text-sm text-gray-600">v2.1.0</span>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <h4 className="font-medium">Quick Actions</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Export Data
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="w-4 h-4 mr-2" />
                                Import Data
                              </Button>
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Clear Cache
                              </Button>
                              <Button variant="outline" size="sm">
                                <Settings className="w-4 h-4 mr-2" />
                                Advanced
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" defaultValue={editingProduct.name} required />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" defaultValue={editingProduct.slug} required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingProduct.description} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" defaultValue={editingProduct.brand} required />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Select name="categoryId" defaultValue={editingProduct.categoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct.price} required />
                </div>
                <div>
                  <Label htmlFor="salePrice">Sale Price</Label>
                  <Input id="salePrice" name="salePrice" type="number" step="0.01" defaultValue={editingProduct.salePrice || ""} />
                </div>
              </div>
              <div>
                <Label htmlFor="images">Images (comma-separated URLs)</Label>
                <Textarea id="images" name="images" defaultValue={editingProduct.images.join(", ")} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sizes">Sizes (comma-separated)</Label>
                  <Input id="sizes" name="sizes" defaultValue={editingProduct.sizes.join(", ")} />
                </div>
                <div>
                  <Label htmlFor="colors">Colors (comma-separated)</Label>
                  <Input id="colors" name="colors" defaultValue={editingProduct.colors.join(", ")} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" defaultValue={editingProduct.tags.join(", ")} />
              </div>
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input id="stockQuantity" name="stockQuantity" type="number" defaultValue={editingProduct.stockQuantity} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="inStock" name="inStock" defaultChecked={editingProduct.inStock} />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isFeatured" name="isFeatured" defaultChecked={editingProduct.isFeatured} />
                  <Label htmlFor="isFeatured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isOnSale" name="isOnSale" defaultChecked={editingProduct.isOnSale} />
                  <Label htmlFor="isOnSale">On Sale</Label>
                </div>
              </div>
              <Button type="submit" disabled={updateProductMutation.isPending} className="w-full">
                Update Product
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input id="name" name="name" defaultValue={editingCategory.name} required />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={editingCategory.slug} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingCategory.description} />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" defaultValue={editingCategory.image} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="isActive" name="isActive" defaultChecked={editingCategory.isActive} />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <Button type="submit" disabled={updateCategoryMutation.isPending} className="w-full">
                Update Category
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

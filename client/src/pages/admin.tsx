
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit, Plus, Upload, Save, Eye, TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, BarChart3, PieChart, Activity, Clock, Star, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import type { Product, Category } from "@shared/schema";

interface SiteSettings {
  logoUrl: string;
  siteName: string;
  heroVideo: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  productsChange: number;
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

interface RecentOrder {
  id: number;
  customerName: string;
  amount: number;
  status: string;
  date: string;
  items: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const queryClient = useQueryClient();

  // Mock dashboard data - in real app this would come from API
  const [dashboardStats] = useState<DashboardStats>({
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 3500,
    totalProducts: 150,
    revenueChange: 12.5,
    ordersChange: 8.3,
    customersChange: 15.2,
    productsChange: 5.7
  });

  const [salesData] = useState<SalesData[]>([
    { month: "Jan", revenue: 10000, orders: 120 },
    { month: "Feb", revenue: 12000, orders: 140 },
    { month: "Mar", revenue: 15000, orders: 180 },
    { month: "Apr", revenue: 18000, orders: 220 },
    { month: "May", revenue: 22000, orders: 250 },
    { month: "Jun", revenue: 25000, orders: 300 }
  ]);

  const [topProducts] = useState<TopProduct[]>([
    { id: 1, name: "Men's Cotton T-Shirt", sales: 150, revenue: 15000, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },
    { id: 2, name: "Women's Summer Dress", sales: 120, revenue: 18000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8" },
    { id: 3, name: "Men's Formal Shoes", sales: 85, revenue: 21000, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772" },
    { id: 4, name: "Women's Leather Handbag", sales: 60, revenue: 30000, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3" }
  ]);

  const [recentOrders] = useState<RecentOrder[]>([
    { id: 1001, customerName: "Rahul Sharma", amount: 2499, status: "Delivered", date: "2024-01-15", items: 2 },
    { id: 1002, customerName: "Priya Patel", amount: 1299, status: "Shipped", date: "2024-01-15", items: 1 },
    { id: 1003, customerName: "Amit Kumar", amount: 4999, status: "Processing", date: "2024-01-14", items: 3 },
    { id: 1004, customerName: "Sneha Singh", amount: 799, status: "Pending", date: "2024-01-14", items: 1 },
    { id: 1005, customerName: "Vikash Gupta", amount: 3299, status: "Delivered", date: "2024-01-13", items: 2 }
  ]);

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logoUrl: "/attached_assets/Hednor Logo 22 updated-5721x3627_1750949407940.png",
    siteName: "Hednor",
    heroVideo: "/client/src/assets/hero-video.mp4",
    primaryColor: "#F59E0B",
    secondaryColor: "#1F2937",
    footerText: "© 2025 Hednor. All rights reserved."
  });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    description: "",
    brand: "",
    categoryId: "",
    price: "",
    salePrice: "",
    images: "",
    sizes: "",
    colors: "",
    stockQuantity: "",
    tags: "",
    isFeatured: false,
    isOnSale: false
  });

  // New Category Form State
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    parentId: ""
  });

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Mutations
  const addProductMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to add product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product added successfully" });
      setIsAddingProduct(false);
      setNewProduct({
        name: "", slug: "", description: "", brand: "", categoryId: "",
        price: "", salePrice: "", images: "", sizes: "", colors: "",
        stockQuantity: "", tags: "", isFeatured: false, isOnSale: false
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...product }: any) => {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully" });
      setEditingProduct(null);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (category: any) => {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!response.ok) throw new Error("Failed to add category");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category added successfully" });
      setIsAddingCategory(false);
      setNewCategory({ name: "", slug: "", description: "", image: "", parentId: "" });
    },
  });

  const updateSiteSettingsMutation = useMutation({
    mutationFn: async (settings: SiteSettings) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Site settings updated successfully" });
    },
  });

  const handleAddProduct = () => {
    const productData = {
      ...newProduct,
      categoryId: parseInt(newProduct.categoryId),
      price: parseFloat(newProduct.price),
      salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : null,
      stockQuantity: parseInt(newProduct.stockQuantity),
      images: newProduct.images.split(',').map(img => img.trim()),
      sizes: newProduct.sizes.split(',').map(size => size.trim()),
      colors: newProduct.colors.split(',').map(color => color.trim()),
      tags: newProduct.tags.split(',').map(tag => tag.trim()),
    };
    addProductMutation.mutate(productData);
  };

  const handleUpdateProduct = (product: Product) => {
    updateProductMutation.mutate(product);
  };

  const handleAddCategory = () => {
    const categoryData = {
      ...newCategory,
      parentId: newCategory.parentId ? parseInt(newCategory.parentId) : null,
    };
    addCategoryMutation.mutate(categoryData);
  };

  const handleUpdateSiteSettings = () => {
    updateSiteSettingsMutation.mutate(siteSettings);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "text-green-600 bg-green-100";
      case "Shipped": return "text-blue-600 bg-blue-100";
      case "Processing": return "text-yellow-600 bg-yellow-100";
      case "Pending": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered": return <CheckCircle className="h-4 w-4" />;
      case "Shipped": return <Package className="h-4 w-4" />;
      case "Processing": return <Clock className="h-4 w-4" />;
      case "Pending": return <AlertTriangle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => window.open("/", "_blank")} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Site
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Revenue</p>
                      <h3 className="text-2xl font-bold">₹{dashboardStats.totalRevenue.toLocaleString()}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{dashboardStats.revenueChange}%</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Orders</p>
                      <h3 className="text-2xl font-bold">{dashboardStats.totalOrders.toLocaleString()}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{dashboardStats.ordersChange}%</span>
                      </div>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Customers</p>
                      <h3 className="text-2xl font-bold">{dashboardStats.totalCustomers.toLocaleString()}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{dashboardStats.customersChange}%</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Total Products</p>
                      <h3 className="text-2xl font-bold">{dashboardStats.totalProducts}</h3>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">+{dashboardStats.productsChange}%</span>
                      </div>
                    </div>
                    <Package className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{order.customerName}</p>
                            <p className="text-xs text-gray-500">Order #{order.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₹{order.amount}</p>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
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
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded">
                          {index + 1}
                        </span>
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">₹{product.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end gap-4 p-4">
                    {salesData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t flex items-end justify-center text-white text-xs font-medium p-2"
                          style={{ height: `${(data.revenue / 25000) * 250}px` }}
                        >
                          ₹{data.revenue/1000}k
                        </div>
                        <span className="text-sm font-medium mt-2">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-bold">3.2%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cart Abandonment</span>
                    <span className="font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Customer Satisfaction</span>
                    <span className="font-bold">4.8/5</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Return Rate</span>
                    <span className="font-bold">2.1%</span>
                  </div>
                  <Progress value={21} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Products Management</h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    />
                    <Input
                      placeholder="Slug"
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    />
                    <Input
                      placeholder="Brand"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    />
                    <Select
                      value={newProduct.categoryId}
                      onValueChange={(value) => setNewProduct({...newProduct, categoryId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    />
                    <Input
                      placeholder="Sale Price"
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})}
                    />
                    <Input
                      placeholder="Stock Quantity"
                      type="number"
                      value={newProduct.stockQuantity}
                      onChange={(e) => setNewProduct({...newProduct, stockQuantity: e.target.value})}
                    />
                    <Input
                      placeholder="Images (comma separated)"
                      value={newProduct.images}
                      onChange={(e) => setNewProduct({...newProduct, images: e.target.value})}
                    />
                    <Input
                      placeholder="Sizes (comma separated)"
                      value={newProduct.sizes}
                      onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})}
                    />
                    <Input
                      placeholder="Colors (comma separated)"
                      value={newProduct.colors}
                      onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})}
                    />
                    <Input
                      placeholder="Tags (comma separated)"
                      value={newProduct.tags}
                      onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    />
                    <div className="col-span-2">
                      <Textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newProduct.isFeatured}
                        onCheckedChange={(checked) => setNewProduct({...newProduct, isFeatured: checked})}
                      />
                      <Label>Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newProduct.isOnSale}
                        onCheckedChange={(checked) => setNewProduct({...newProduct, isOnSale: checked})}
                      />
                      <Label>On Sale</Label>
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="mt-4">
                    Add Product
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4 flex-1">
                        <img 
                          src={product.images?.[0] || "/placeholder.jpg"} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
                            {product.isOnSale && <Badge variant="destructive">On Sale</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="font-medium">Brand: {product.brand}</span>
                            <span className="font-medium">Price: ₹{product.price}</span>
                            <span className="font-medium">Stock: {product.stockQuantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Categories Management</h2>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Category Name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                    <Input
                      placeholder="Slug"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                    />
                    <Input
                      placeholder="Image URL"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({...newCategory, image: e.target.value})}
                    />
                    <Textarea
                      placeholder="Description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    />
                    <Select
                      value={newCategory.parentId}
                      onValueChange={(value) => setNewCategory({...newCategory, parentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Parent Category (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Parent</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCategory} className="mt-4">
                    Add Category
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <img 
                        src={category.image || "/placeholder.jpg"} 
                        alt={category.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Orders Management</h2>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium">Order ID</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Amount</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">#{order.id}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {order.customerName}
                            </div>
                          </td>
                          <td className="p-4 font-medium">₹{order.amount}</td>
                          <td className="p-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{order.date}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Customer Management</h2>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <h3 className="text-2xl font-bold">3,500</h3>
                  <p className="text-gray-600">Total Customers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <h3 className="text-2xl font-bold">450</h3>
                  <p className="text-gray-600">New This Month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                  <h3 className="text-2xl font-bold">1,200</h3>
                  <p className="text-gray-600">VIP Customers</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600">Customer management features will be implemented here including customer list, profiles, order history, and communication tools.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={siteSettings.logoUrl}
                      onChange={(e) => setSiteSettings({...siteSettings, logoUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="heroVideo">Hero Video URL</Label>
                    <Input
                      id="heroVideo"
                      value={siteSettings.heroVideo}
                      onChange={(e) => setSiteSettings({...siteSettings, heroVideo: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={siteSettings.primaryColor}
                      onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Textarea
                      id="footerText"
                      value={siteSettings.footerText}
                      onChange={(e) => setSiteSettings({...siteSettings, footerText: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleUpdateSiteSettings} className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Upload New Media</Label>
                    <Input type="file" accept="image/*,video/*" className="mt-2" />
                  </div>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-4">Current Media Files</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                      <img 
                        src="/attached_assets/Hednor Logo 22 updated-5721x3627_1750949407940.png" 
                        alt="Logo" 
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-xs">Logo</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                      <div className="w-full h-20 bg-gray-200 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs">Video</span>
                      </div>
                      <p className="text-xs">Hero Video</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

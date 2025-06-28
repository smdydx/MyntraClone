
import { useState } from "react";
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
import { Trash2, Edit, Plus, Upload, Save, Eye } from "lucide-react";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const queryClient = useQueryClient();

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={() => window.open("/", "_blank")} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Site
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Site Settings</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Featured Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {products.filter(p => p.isFeatured).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Site Settings Tab */}
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
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products Management</h2>
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
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          {product.isFeatured && <Badge variant="secondary">Featured</Badge>}
                          {product.isOnSale && <Badge variant="destructive">On Sale</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span>Brand: {product.brand}</span>
                          <span>Price: ₹{product.price}</span>
                          <span>Stock: {product.stockQuantity}</span>
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
              <h2 className="text-2xl font-bold">Categories Management</h2>
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

            <div className="grid gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-500">Slug: {category.slug}</p>
                      </div>
                      <div className="flex gap-2">
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

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
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
                    <div className="border rounded-lg p-4 text-center">
                      <img 
                        src="/attached_assets/Hednor Logo 22 updated-5721x3627_1750949407940.png" 
                        alt="Logo" 
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-xs">Logo</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
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

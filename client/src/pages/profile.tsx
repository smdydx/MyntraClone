import { useState, useEffect } from "react";
import { User, Heart, Package, Settings, LogOut, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { useStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";



// Real orders from API
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { wishlistItems, removeFromWishlist } = useStore();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
 const [activeTab, setActiveTab] = useState("orders");

  // Fetch real orders from API
  const { data: userOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", user?.email],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) return [];

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    enabled: isAuthenticated && !!user,
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLocation('/');
      return;
    }

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  }, [user, isAuthenticated, setLocation]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const token = useAuthStore.getState().token;
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      updateUser(data.user);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500 text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'confirmed':
        return 'bg-hednor-gold text-hednor-dark';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0">
                  <AvatarImage src="" alt="Profile" />
                  <AvatarFallback className="bg-hednor-gold text-hednor-dark text-lg sm:text-xl font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="font-poppins font-bold text-xl sm:text-2xl lg:text-3xl text-hednor-dark mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base break-all">{user.email}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                    size="sm"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-sale-red hover:text-sale-red hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
                    onClick={handleLogout}
                    size="sm"
                  >
                    <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                    <span className="sm:hidden">Logout</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="orders" className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                <span className="hidden xs:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                <span className="hidden xs:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                <span className="hidden xs:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col sm:flex-row items-center justify-center sm:space-x-2 p-2 sm:p-3 text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mb-1 sm:mb-0" />
                <span className="hidden xs:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Order History</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {ordersLoading ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hednor-gold mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your orders...</p>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">No orders yet</h3>
                      <p className="text-gray-500 text-sm mb-4 px-4">Start shopping to see your orders here</p>
                      <Button className="text-sm" onClick={() => setLocation('/')}>Continue Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {userOrders.map((order: any) => (
                        <div key={order._id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 text-gray-500" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-sm sm:text-base truncate">
                                  Order #{order.orderId || order._id?.slice(-8)}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {order.items?.length || 0} items
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between sm:block sm:text-right">
                              <p className="font-semibold text-base sm:text-lg">
                                ₹{(order.finalAmount || order.totalAmount || 0).toLocaleString('en-IN')}
                              </p>
                              <Badge className={`${getStatusColor(order.status || 'pending')} text-xs`}>
                                {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 gap-2">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                              View Details
                            </Button>
                            <div className="flex space-x-2 w-full sm:w-auto">
                              {order.status === 'delivered' && (
                                <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                                  Reorder
                                </Button>
                              )}
                              {order.status === 'pending' && (
                                <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red flex-1 sm:flex-none text-xs sm:text-sm">
                                  Cancel Order
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">My Wishlist ({wishlistItems.length} items)</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Heart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Your wishlist is empty</h3>
                      <p className="text-gray-500 text-sm mb-4 px-4">Save items you love for later</p>
                      <Button className="text-sm">Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/80 hover:bg-white w-6 h-6 sm:w-8 sm:h-8"
                                onClick={() => {
                                  removeFromWishlist(item.productId);
                                  toast({
                                    title: "Removed from wishlist",
                                    description: `${item.name} has been removed from your wishlist.`,
                                  });
                                }}
                              >
                                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-sale-red fill-sale-red" />
                              </Button>
                            </div>
                            <div className="p-2 sm:p-3">
                              <h3 className="font-medium text-xs sm:text-sm text-gray-800 mb-1 line-clamp-2">
                                {item.brand}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {item.name}
                              </p>
                              <div className="flex items-center space-x-1 sm:space-x-2">
                                {item.salePrice ? (
                                  <>
                                    <span className="font-semibold text-hednor-dark text-xs sm:text-sm">
                                      ₹{parseFloat(item.salePrice).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-hednor-dark text-xs sm:text-sm">
                                    ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-4 sm:mt-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button 
                        onClick={handleSaveProfile} 
                        className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500 w-full sm:w-auto text-sm"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full sm:w-auto text-sm">
                        Cancel
                      </Button>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4 text-base sm:text-lg">Shipping Addresses</h3>
                    <div className="border rounded-lg p-3 sm:p-4 mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">Home</p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            123 Main Street, Apartment 4B<br />
                            Mumbai, Maharashtra 400001<br />
                            India
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs self-start">Default</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red w-full sm:w-auto text-xs sm:text-sm">Delete</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto text-sm">Add New Address</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Email Notifications</p>
                        <p className="text-xs sm:text-sm text-gray-600">Receive updates about your orders and promotions</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Configure</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">SMS Notifications</p>
                        <p className="text-xs sm:text-sm text-gray-600">Get order updates via SMS</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Change Password</p>
                        <p className="text-xs sm:text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Two-Factor Authentication</p>
                        <p className="text-xs sm:text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">Download Data</p>
                        <p className="text-xs sm:text-sm text-gray-600">Download a copy of your account data</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Download</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <p className="font-medium text-sale-red text-sm sm:text-base">Delete Account</p>
                        <p className="text-xs sm:text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
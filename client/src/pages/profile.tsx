import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";

// Mock user data - in real app this would come from authentication
const mockUser = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 43210",
  avatar: "",
  joinDate: "January 2024",
};

// Mock order data - in real app this would come from API
const mockOrders = [
  {
    id: 1,
    orderNumber: "HD2024001",
    date: "2024-01-15",
    status: "Delivered",
    total: "₹2,497",
    items: 3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 2,
    orderNumber: "HD2024002", 
    date: "2024-01-20",
    status: "Shipped",
    total: "₹1,299",
    items: 1,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
  {
    id: 3,
    orderNumber: "HD2024003",
    date: "2024-01-25", 
    status: "Processing",
    total: "₹3,499",
    items: 2,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
  },
];

export default function Profile() {
  const { wishlistItems, removeFromWishlist } = useStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    email: mockUser.email,
    phone: mockUser.phone,
  });

  const handleSaveProfile = () => {
    // In real app, this would make an API call to update user profile
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success-green text-white';
      case 'shipped':
        return 'bg-blue-500 text-white';
      case 'processing':
        return 'bg-hednor-gold text-hednor-dark';
      case 'cancelled':
        return 'bg-sale-red text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={mockUser.avatar} alt="Profile" />
                  <AvatarFallback className="bg-hednor-gold text-hednor-dark text-xl font-semibold">
                    {mockUser.firstName[0]}{mockUser.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="font-poppins font-bold text-2xl text-hednor-dark mb-1">
                    {mockUser.firstName} {mockUser.lastName}
                  </h1>
                  <p className="text-gray-600 mb-2">{mockUser.email}</p>
                  <p className="text-sm text-gray-500">Member since {mockUser.joinDate}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="text-sale-red hover:text-sale-red hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders" className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {mockOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
                      <Button>Continue Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {mockOrders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <img
                                src={order.image}
                                alt="Order item"
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h4 className="font-semibold">Order #{order.orderNumber}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.date).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600">{order.items} items</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{order.total}</p>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center mt-3">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {order.status === 'Delivered' && (
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            )}
                            {order.status === 'Processing' && (
                              <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red">
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist ({wishlistItems.length} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-500 text-sm mb-4">Save items you love for later</p>
                      <Button>Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {wishlistItems.map((item) => (
                        <div key={item.id} className="relative">
                          <div className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                                onClick={() => {
                                  removeFromWishlist(item.productId);
                                  toast({
                                    title: "Removed from wishlist",
                                    description: `${item.name} has been removed from your wishlist.`,
                                  });
                                }}
                              >
                                <Heart className="w-4 h-4 text-sale-red fill-sale-red" />
                              </Button>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-sm text-gray-800 mb-1 line-clamp-2">
                                {item.brand}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                {item.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                {item.salePrice ? (
                                  <>
                                    <span className="font-semibold text-hednor-dark">
                                      ₹{parseFloat(item.salePrice).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs text-gray-500 line-through">
                                      ₹{parseFloat(item.price).toLocaleString('en-IN')}
                                    </span>
                                  </>
                                ) : (
                                  <span className="font-semibold text-hednor-dark">
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
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4">
                      <Button onClick={handleSaveProfile} className="bg-hednor-gold text-hednor-dark hover:bg-yellow-500">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Shipping Addresses</h3>
                    <div className="border rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Home</p>
                          <p className="text-sm text-gray-600">
                            123 Main Street, Apartment 4B<br />
                            Mumbai, Maharashtra 400001<br />
                            India
                          </p>
                        </div>
                        <Badge variant="secondary">Default</Badge>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red">Delete</Button>
                      </div>
                    </div>
                    <Button variant="outline">Add New Address</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your orders and promotions</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Get order updates via SMS</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Download Data</p>
                        <p className="text-sm text-gray-600">Download a copy of your account data</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sale-red">Delete Account</p>
                        <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-sale-red hover:text-sale-red hover:bg-red-50">
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

import type { Express } from "express";
import { createServer, type Server } from "http";
import { connectToMongoDB, UserService, CategoryService, ProductService, CartService, WishlistService, SiteSettingsService, OrderService, PaymentService } from "./mongodb";
import { authenticateToken, optionalAuth, AuthenticatedRequest } from "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection
  await connectToMongoDB();

  const userService = new UserService();
  const categoryService = new CategoryService();
  const productService = new ProductService();
  const cartService = new CartService();
  const wishlistService = new WishlistService();
  const siteSettingsService = new SiteSettingsService();
  const paymentService = new PaymentService();
  const orderService = new OrderService();

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, password, phone } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const result = await userService.registerUser({
        firstName,
        lastName,
        email,
        password,
        phone
      });

      res.status(201).json({
        message: "User registered successfully",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await userService.loginUser({ email, password });

      res.json({
        message: "Login successful",
        user: result.user,
        token: result.token
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await userService.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  app.put("/api/auth/profile", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const updateData: any = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone) updateData.phone = phone;

      const updatedUser = await userService.updateUser(req.user!.userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile updated successfully",
        user: updatedUser
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await categoryService.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { categoryId, featured, onSale, search } = req.query;
      const filters = {
        categoryId: categoryId as string,
        featured: featured === "true",
        onSale: onSale === "true",
        search: search as string
      };

      const products = await productService.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/slug/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const product = await productService.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cartItems = await cartService.getCartItems(req.user!.userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const cartData = {
        ...req.body,
        userId: req.user!.userId
      };

      const cartItem = await cartService.addToCart(cartData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const { quantity } = req.body;

      const updatedItem = await cartService.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const success = await cartService.removeFromCart(id);

      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Wishlist
  app.get("/api/wishlist", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const wishlistItems = await wishlistService.getWishlistItems(req.user!.userId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const wishlistData = {
        ...req.body,
        userId: req.user!.userId
      };

      const wishlistItem = await wishlistService.addToWishlist(wishlistData);
      res.json(wishlistItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid wishlist item data" });
    }
  });

  app.delete("/api/wishlist/:productId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const productId = req.params.productId;
      const success = await wishlistService.removeFromWishlist(req.user!.userId, productId);

      if (!success) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }

      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove wishlist item" });
    }
  });

  // Admin routes for products
  app.post("/api/admin/products", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const product = await productService.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const success = await productService.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin routes for categories
  app.post("/api/admin/categories", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Failed to add category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const category = await categoryService.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = req.params.id;
      const success = await categoryService.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Public site settings (for frontend)
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await siteSettingsService.getSettings();
      // Only return public settings, not sensitive ones
      const publicSettings = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        heroVideo: settings.heroVideo,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroCTA: settings.heroCTA,
        showHeroVideo: settings.showHeroVideo,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor,
        fontFamily: settings.fontFamily,
        headerStyle: settings.headerStyle,
        footerStyle: settings.footerStyle,
        showBreadcrumbs: settings.showBreadcrumbs,
        showRecentlyViewed: settings.showRecentlyViewed,
        footerText: settings.footerText,
        aboutText: settings.aboutText,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        businessAddress: settings.businessAddress,
        businessHours: settings.businessHours
      };
      res.json(publicSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Category seeding endpoint
  app.post("/api/admin/seed-categories", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { seedCategories } = await import('./seed-data');
      await seedCategories();
      res.json({ message: "Categories seeded successfully" });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({ message: "Failed to seed categories" });
    }
  });

  // Product seeding endpoint
  app.post("/api/admin/seed-products", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { seedProducts } = await import('./seed-data');
      await seedProducts();
      res.json({ message: "Products seeded successfully" });
    } catch (error) {
      console.error('Seeding error:', error);
      res.status(500).json({ message: "Failed to seed products" });
    }
  });

  // Site settings management (admin only)
  app.get("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const settings = await siteSettingsService.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get site settings
  app.get("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock settings data - replace with actual database query
      const settings = {
        _id: "settings-1",
        logoUrl: "/logo.png",
        siteName: "Hednor Store",
        heroVideo: "/hero-video.mp4",
        primaryColor: "#F59E0B",
        secondaryColor: "#1F2937",
        footerText: "© 2025 Hednor Store. All rights reserved.",
        updatedAt: new Date().toISOString(),
        siteDescription: "Premium fashion and lifestyle products",
        contactEmail: "contact@hednorstore.com",
        contactPhone: "+91 9876543210"
      };
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      const updatedSettings = { _id: "settings-1", ...req.body, updatedAt: new Date().toISOString() };
      res.json({ message: "Settings updated successfully", settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // File upload endpoint
  app.post("/api/admin/upload", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // This would handle file uploads to your storage
      res.json({ message: "File uploaded successfully", url: "/path/to/uploaded/file" });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Dashboard analytics endpoints
  app.get("/api/admin/analytics/overview", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock data - in real app, fetch from database
      const overview = {
        totalUsers: 3500,
        totalOrders: 1250,
        totalRevenue: 125000,
        totalProducts: 150,
        newOrdersToday: 25,
        revenueToday: 8500,
        conversionRate: 3.2,
        avgOrderValue: 2500
      };
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin Users Management
  app.get("/api/admin/users", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock data - replace with actual database query
      const users = [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          createdAt: new Date().toISOString(),
          totalOrders: 5,
          totalSpent: 12500,
          status: "active"
        },
        {
          _id: "2", 
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          totalOrders: 3,
          totalSpent: 7500,
          status: "active"
        }
      ];
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin Products Management
  app.post("/api/admin/products", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      const newProduct = { _id: Date.now().toString(), ...req.body };
      res.json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      const updatedProduct = { _id: req.params.id, ...req.body };
      res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Categories Management
  app.post("/api/admin/categories", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      const newCategory = { _id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() };
      res.json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      const updatedCategory = { _id: req.params.id, ...req.body };
      res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock response - replace with actual database operation
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Seed categories endpoint
  app.post("/api/admin/seed-categories", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { seedCategories } = await import('./seed-data');
      const categories = await seedCategories();
      res.json({ message: "Categories seeded successfully", categories });
    } catch (error) {
      console.error('Seed categories error:', error);
      res.status(500).json({ message: "Failed to seed categories", error: error.message });
    }
  });

  // Seed products endpoint
  app.post("/api/admin/seed-products", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { seedProducts } = await import('./seed-data');
      await seedProducts();
      res.json({ message: "Products seeded successfully" });
    } catch (error) {
      console.error('Seed products error:', error);
      res.status(500).json({ message: "Failed to seed products", error: error.message });
    }
  });

  // Seed all data endpoint
  app.post("/api/admin/seed-all", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { seedCategories, seedProducts } = await import('./seed-data');
      await seedCategories();
      await seedProducts();
      res.json({ message: "All data seeded successfully" });
    } catch (error) {
      console.error('Seed all data error:', error);
      res.status(500).json({ message: "Failed to seed data", error: error.message });
    }
  });

  // Payment Gateway Routes

  // Razorpay Order Creation
  app.post("/api/payment/razorpay/create-order", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      const { amount, currency = 'INR' } = req.body;

      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1
      };

      const order = await razorpay.orders.create(options);

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create Razorpay order" });
    }
  });

  // Razorpay Payment Verification
  app.post("/api/payment/razorpay/verify", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

      const isValid = await paymentService.verifyRazorpayPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (isValid) {
        // Create order
        const order = await orderService.createOrder({
          ...orderData,
          userId: req.user!.userId,
          paymentMethod: 'razorpay',
          paymentStatus: 'completed'
        });

        // Create payment record
        await paymentService.createPayment({
          orderId: order.orderId,
          userId: req.user!.userId,
          amount: orderData.finalAmount,
          paymentMethod: 'razorpay',
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'completed'
        });

        // Clear user's cart
        await cartService.clearCart(req.user!.userId);

        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          orderId: order.orderId
        });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  });

  // Stripe Payment Intent
  app.post("/api/payment/stripe/create-intent", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const { amount, currency = 'inr' } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in smallest currency unit
        currency,
        metadata: {
          userId: req.user!.userId
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Stripe Payment Confirmation
  app.post("/api/payment/stripe/confirm", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { payment_intent_id, orderData } = req.body;
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

      if (paymentIntent.status === 'succeeded') {
        // Create order
        const order = await orderService.createOrder({
          ...orderData,
          userId: req.user!.userId,
          paymentMethod: 'stripe',
          paymentStatus: 'completed'
        });

        // Create payment record
        await paymentService.createPayment({
          orderId: order.orderId,
          userId: req.user!.userId,
          amount: orderData.finalAmount,
          paymentMethod: 'stripe',
          stripePaymentIntentId: payment_intent_id,
          status: 'completed'
        });

        // Clear user's cart
        await cartService.clearCart(req.user!.userId);

        res.json({ 
          success: true, 
          message: "Payment completed successfully",
          orderId: order.orderId
        });
      } else {
        res.status(400).json({ success: false, message: "Payment failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Payment confirmation failed" });
    }
  });

  // UPI Payment (Mock implementation)
  app.post("/api/payment/upi/initiate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { amount, upiId, orderData } = req.body;

      // In real implementation, integrate with UPI payment gateway like Razorpay UPI, PayU, etc.
      const transactionId = `UPI${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create order
      const order = await orderService.createOrder({
        ...orderData,
        userId: req.user!.userId,
        paymentMethod: 'upi',
        paymentStatus: 'pending'
      });

      // Create payment record
      await paymentService.createPayment({
        orderId: order.orderId,
        userId: req.user!.userId,
        amount: orderData.finalAmount,
        paymentMethod: 'upi',
        upiTransactionId: transactionId,
        status: 'pending'
      });

      res.json({
        success: true,
        transactionId,
        orderId: order.orderId,
        message: "UPI payment initiated. Please complete payment on your UPI app."
      });
    } catch (error) {
      res.status(500).json({ message: "UPI payment initiation failed" });
    }
  });

  // Cash on Delivery
  app.post("/api/payment/cod", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { orderData } = req.body;

      // Create order
      const order = await orderService.createOrder({
        ...orderData,
        userId: req.user!.userId,
        paymentMethod: 'cod',
        paymentStatus: 'pending'
      });

      // Create payment record
      await paymentService.createPayment({
        orderId: order.orderId,
        userId: req.user!.userId,
        amount: orderData.finalAmount,
        paymentMethod: 'cod',
        status: 'pending'
      });

      // Clear user's cart
      await cartService.clearCart(req.user!.userId);

      res.json({ 
        success: true, 
        message: "Order placed successfully. Pay on delivery.",
        orderId: order.orderId
      });
    } catch (error) {
      res.status(500).json({ message: "COD order creation failed" });
    }
  });

  // Order Management Routes
  app.get("/api/orders", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const orders = await orderService.getUserOrders(req.user!.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderId", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const order = await orderService.getOrderById(req.params.orderId);
      if (!order || order.userId.toString() !== req.user!.userId) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  // Admin Order Management
  app.get("/api/admin/orders", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.put("/api/admin/orders/:orderId/status", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { status, trackingNumber } = req.body;
      const order = await orderService.updateOrderStatus(req.params.orderId, status, trackingNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order status updated successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { connectToMongoDB, UserService, CategoryService, ProductService, CartService, WishlistService, SiteSettingsService, OrderService, PaymentService, generateToken } from "./mongodb";
import { authenticateToken, optionalAuth, AuthenticatedRequest } from "./middleware";

// Define a middleware to authenticate admin users
const authenticateAdmin = (req: AuthenticatedRequest, res: Express.Response, next: Express.NextFunction) => {
  // Check if user exists and has admin role
  if (req.user && req.user.email === "adminhednor@gmail.com") {
    next(); // Proceed to the next middleware or route handler
  } else {
    res.status(403).json({ message: "Unauthorized: Admin access required" });
  }
};

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
  // Get all products with optional filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { category, brand, minPrice, maxPrice, inStock, featured, sale, search, sortBy, page = 1, limit = 20 } = req.query;

      const filter: any = {};

      if (category) filter.category = category;
      if (brand) filter.brand = brand;
      if (inStock === 'true') filter.inStock = true;
      if (featured === 'true') filter.isFeatured = true;
      if (sale === 'true') filter.isOnSale = true;

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption: any = {};
      switch (sortBy) {
        case 'price-low-high':
          sortOption = { price: 1 };
          break;
        case 'price-high-low':
          sortOption = { price: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      // Use productService to get products with aggregation
      const products = await productService.getProducts(filter, {
        sort: sortOption,
        skip: skip,
        limit: parseInt(limit as string)
      });

      const total = await productService.getProductCount(filter);

      res.json({
        products,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
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

  // Cart - supports both logged in users and guest sessions
  app.get("/api/cart", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      
      if (req.user) {
        // Logged in user
        const cartItems = await cartService.getCartItems(req.user.userId);
        res.json(cartItems);
      } else if (sessionId) {
        // Guest user with session
        const cartItems = await cartService.getGuestCartItems(sessionId);
        res.json(cartItems);
      } else {
        res.json([]);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { productId, quantity, size, color } = req.body;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const cartData = {
        productId,
        quantity: quantity || 1,
        size,
        color,
        userId: req.user!.userId
      };

      const cartItem = await cartService.addToCart(cartData);
      res.json(cartItem);
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(400).json({ message: error.message || "Failed to add item to cart" });
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
  app.post("/api/admin/products", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(400).json({ message: "Failed to add product", error: error.message });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await productService.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      console.error('Product update error:', error);
      res.status(400).json({ message: error.message || "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const success = await productService.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      console.error('Product deletion error:', error);
      res.status(500).json({ message: error.message || "Failed to delete product" });
    }
  });

  // Admin login endpoint
  app.post("/api/auth/admin-login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Simple admin check - in production, use proper authentication
      if (email === "adminhednor@gmail.com" && password === "admin123") {
        const token = generateToken({ userId: "admin", email: "adminhednor@gmail.com" });
        res.json({ token, message: "Admin login successful" });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin routes for categories
  app.post("/api/admin/categories", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error('Category creation error:', error);
      res.status(400).json({ message: "Failed to add category", error: error.message });
    }
  });

  app.put("/api/admin/categories/:id", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const category = await categoryService.updateCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      console.error('Category update error:', error);
      res.status(400).json({ message: error.message || "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", authenticateToken, authenticateAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!id || id.length !== 24) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      // Check if category has products
      const products = await productService.getProducts({ categoryId: id });
      if (products.length > 0) {
        return res.status(400).json({ 
          message: `Cannot delete category. It has ${products.length} products assigned to it.`
        });
      }

      const success = await categoryService.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      console.error('Category deletion error:', error);
      res.status(500).json({ message: error.message || "Failed to delete category" });
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

  app.put("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updatedSettings = await siteSettingsService.updateSettings(req.body);
      res.json({ message: "Settings updated successfully", settings: updatedSettings });
    } catch (error) {
      console.error('Settings update error:', error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Media upload endpoint
  app.post("/api/admin/upload-media", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // In a real implementation, this would handle file uploads
      // For now, we'll return a mock response
      const { fileName, fileType } = req.body;
      const mockUrl = `https://example.com/uploads/${fileName}`;

      res.json({ 
        success: true, 
        url: mockUrl, 
        message: "File uploaded successfully",
        fileName,
        fileType
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Banner management endpoints
  app.get("/api/admin/banners", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Get banners from site settings
      const settings = await siteSettingsService.getSettings();
      const banners = [];

      if (settings.heroVideo) {
        banners.push({
          id: "hero",
          type: "hero",
          title: settings.heroTitle || "Hero Banner",
          url: settings.heroVideo,
          active: settings.showHeroVideo || false,
          createdAt: new Date().toISOString()
        });
      }

      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { type, title, url, active = true } = req.body;

      // Mock banner creation - replace with actual database operation
      const newBanner = {
        id: Date.now().toString(),
        type,
        title,
        url,
        active,
        createdAt: new Date().toISOString()
      };

      res.status(201).json({ message: "Banner created successfully", banner: newBanner });
    } catch (error) {
      res.status(500).json({ message: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Mock banner update - replace with actual database operation
      const updatedBanner = {
        id,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      res.json({ message: "Banner updated successfully", banner: updatedBanner });
    } catch (error) {
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/admin/banners/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Mock banner deletion - replace with actual database operation
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner" });
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
      // Calculate real analytics from database
      const totalUsers = await userService.getUserCount();
      const allOrders = await orderService.getAllOrders();
      const totalProducts = await productService.getProductCount();

      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + (order.finalAmount || 0), 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const ordersToday = allOrders.filter(order => new Date(order.createdAt) >= today);
      const newOrdersToday = ordersToday.length;
      const revenueToday = ordersToday.reduce((sum, order) => sum + (order.finalAmount || 0), 0);

      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

      const overview = {
        totalUsers,
        totalOrders,
        totalRevenue,
        totalProducts,
        newOrdersToday,
        revenueToday,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgOrderValue: Math.round(avgOrderValue)
      };
      res.json(overview);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin Users Management
  app.get("/api/admin/users", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const userService = new UserService();
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
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

  // Homepage sections management
  app.get("/api/admin/homepage-sections", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Get sections configuration from site settings
      const settings = await siteSettingsService.getSettings();

      const homepageSections = settings.homepageSections || {
        dealsSection: {
          title: "Deals for You",
          enabled: true,
          maxProducts: 5,
          filterCriteria: "onSale",
          order: 2
        },
        topPicksSection: {
          title: "Related Top Picks for You",
          enabled: true,
          maxProducts: 6,
          filterCriteria: "highRating",
          order: 3
        },
        mustHaveSection: {
          title: "Must-Have Items",
          enabled: true,
          maxProducts: 6,
          filterCriteria: "popular",
          order: 4
        },
        categoryDealsSection: {
          title: "Deals for You in Clothing & Accessories",
          enabled: true,
          maxProducts: 6,
          filterCriteria: "onSale",
          targetCategory: "clothing",
          order: 5
        }
      };

      res.json(homepageSections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch homepage sections" });
    }
  });

  app.put("/api/admin/homepage-sections", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const sectionsConfig = req.body;

      // In real implementation, save to database
      // For now, just return success
      res.json({ 
        message: "Homepage sections updated successfully", 
        config: sectionsConfig 
      });
    } catch (error) {
      console.error('Homepage sections update error:', error);
      res.status(500).json({ message: "Failed to update homepage sections" });
    }
  });

  // Get products for specific homepage section
  app.get("/api/homepage-section-products/:sectionType", async (req, res) => {
    try {
      const { sectionType } = req.params;
      const { limit = 6 } = req.query;

      let filterConditions = {};

      switch (sectionType) {
        case 'deals':
          filterConditions = { $or: [{ isOnSale: true }, { salePrice: { $exists: true, $ne: null } }] };
          break;
        case 'topPicks':
          filterConditions = { rating: { $gte: 4.0 } };
          break;
        case 'mustHave':
          filterConditions = { $or: [{ reviewCount: { $gte: 500 } }, { isFeatured: true }] };
          break;
        case 'categoryDeals':
          // This would need category filtering logic
          filterConditions = { isOnSale: true };
          break;
        default:
          filterConditions = {};
      }

      const products = await productService.getProducts({ 
        ...filterConditions,
        limit: parseInt(limit as string)
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch section products" });
    }
  });

  // Payment Gateway Routes

  // Razorpay Order Creation
  app.post("/api/payment/razorpay/create-order", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ 
          message: "Razorpay credentials not configured",
          error: "RAZORPAY_CREDENTIALS_MISSING" 
        });
      }

      try {
        const Razorpay = require('razorpay');
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const { amount, currency = 'INR' } = req.body;

        if (!amount || amount <= 0) {
          return res.status(400).json({ message: "Invalid amount" });
        }

        const options = {
          amount: Math.round(amount * 100), // Razorpay expects amount in paise
          currency,
          receipt: `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.RAZORPAY_KEY_ID,
          success: true
        });
      } catch (razorpayError: any) {
        console.error('Razorpay API error:', razorpayError);
        res.status(500).json({ 
          message: "Failed to create Razorpay order",
          error: razorpayError.message || "RAZORPAY_API_ERROR"
        });
      }
    } catch (error: any) {
      console.error('Razorpay order creation error:', error);
      res.status(500).json({ 
        message: "Failed to create Razorpay order",
        error: error.message || "UNKNOWN_ERROR"
      });
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
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ 
          message: "Stripe credentials not configured",
          error: "STRIPE_CREDENTIALS_MISSING"
        });
      }

      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { amount, currency = 'inr' } = req.body;

        if (!amount || amount <= 0) {
          return res.status(400).json({ message: "Invalid amount" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit
          currency,
          metadata: {
            userId: req.user!.userId
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        res.json({
          clientSecret: paymentIntent.client_secret,
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
          success: true
        });
      } catch (stripeError: any) {
        console.error('Stripe API error:', stripeError);
        res.status(500).json({ 
          message: "Failed to create payment intent",
          error: stripeError.message || "STRIPE_API_ERROR"
        });
      }
    } catch (error: any) {
      console.error('Stripe payment intent error:', error);
      res.status(500).json({ 
        message: "Failed to create payment intent",
        error: error.message || "UNKNOWN_ERROR"
      });
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

  // Google Pay Payment
  app.post("/api/payment/gpay/initiate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { amount, orderData } = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      // Create order first
      const order = await orderService.createOrder({
        ...orderData,
        userId: req.user!.userId,
        paymentMethod: "googlepay",
        paymentStatus: "pending"
      });

      // Simulate Google Pay payment processing
      const paymentId = `gpay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await paymentService.createPayment({
        orderId: order.orderId,
        userId: req.user!.userId,
        amount,
        paymentMethod: "googlepay",
        status: "completed",
        transactionId: paymentId
      });

      // Update order status
      await orderService.updateOrderStatus(order.orderId, "confirmed");

      res.json({
        success: true,
        orderId: order.orderId,
        paymentId,
        message: "Google Pay payment processed successfully"
      });
    } catch (error) {
      console.error("Google Pay payment error:", error);
      res.status(500).json({ message: "Failed to process Google Pay payment" });
    }
  });

  // PhonePe Payment
  app.post("/api/payment/phonepe/initiate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { amount, orderData } = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      // Create order first
      const order = await orderService.createOrder({
        ...orderData,
        userId: req.user!.userId,
        paymentMethod: "phonepe",
        paymentStatus: "pending"
      });

      // Simulate PhonePe payment processing
      const paymentId = `phonepe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await paymentService.createPayment({
        orderId: order.orderId,
        userId: req.user!.userId,
        amount,
        paymentMethod: "phonepe",
        status: "completed",
        transactionId: paymentId
      });

      // Update order status
      await orderService.updateOrderStatus(order.orderId, "confirmed");

      res.json({
        success: true,
        orderId: order.orderId,
        paymentId,
        message: "PhonePe payment processed successfully"
      });
    } catch (error) {
      console.error("PhonePe payment error:", error);
      res.status(500).json({ message: "Failed to process PhonePe payment" });
    }
  });

  // Paytm Payment
  app.post("/api/payment/paytm/initiate", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { amount, orderData } = req.body;

      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      // Create order first
      const order = await orderService.createOrder({
        ...orderData,
        userId: req.user!.userId,
        paymentMethod: "paytm",
        paymentStatus: "pending"
      });

      // Simulate Paytm payment processing
      const paymentId = `paytm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await paymentService.createPayment({
        orderId: order.orderId,
        userId: req.user!.userId,
        amount,
        paymentMethod: "paytm",
        status: "completed",
        transactionId: paymentId
      });

      // Update order status
      await orderService.updateOrderStatus(order.orderId, "confirmed");

      res.json({
        success: true,
        orderId: order.orderId,
        paymentId,
        message: "Paytm payment processed successfully"
      });
    } catch (error) {
      console.error("Paytm payment error:", error);
      res.status(500).json({ message: "Failed to process Paytm payment" });
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
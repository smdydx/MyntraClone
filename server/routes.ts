
import type { Express } from "express";
import { createServer, type Server } from "http";
import { connectToMongoDB, UserService, CategoryService, ProductService, CartService, WishlistService, SiteSettingsService } from "./mongodb";
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

  app.put("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const settings = await siteSettingsService.updateSettings(req.body);
      res.json({ message: "Settings updated successfully", settings });
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
      // This would fetch real analytics data from MongoDB
      const overview = {
        totalUsers: 3500,
        totalOrders: 1250,
        totalRevenue: 125000,
        totalProducts: 150
      };
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

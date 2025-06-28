import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCartItemSchema, insertWishlistItemSchema } from "@shared/schema";
import { connectToMongoDB, UserService } from "./mongodb";
import { authenticateToken, optionalAuth, AuthenticatedRequest } from "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize MongoDB connection
  await connectToMongoDB();
  const userService = new UserService();

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
      const categories = await storage.getCategories();
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
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        featured: featured === "true",
        onSale: onSale === "true",
        search: search as string
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
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
      const product = await storage.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart (using authenticated user)
  app.get("/api/cart", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId ? parseInt(req.user.userId) : 1;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId ? parseInt(req.user.userId) : 1;
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid cart item data" });
    }
  });

  app.put("/api/cart/:id", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.removeFromCart(id);
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  // Wishlist
  app.get("/api/wishlist", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId ? parseInt(req.user.userId) : 1;
      const wishlistItems = await storage.getWishlistItems(userId);
      res.json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user?.userId ? parseInt(req.user.userId) : 1;
      const validatedData = insertWishlistItemSchema.parse({
        ...req.body,
        userId
      });
      
      const wishlistItem = await storage.addToWishlist(validatedData);
      res.json(wishlistItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid wishlist item data" });
    }
  });

  app.delete("/api/wishlist/:productId", optionalAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const userId = req.user?.userId ? parseInt(req.user.userId) : 1;
      const success = await storage.removeFromWishlist(userId, productId);
      
      if (!success) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      
      res.json({ message: "Item removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove wishlist item" });
    }
  });

  // Admin routes
  app.post("/api/admin/products", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const productData = req.body;
      const product = await storage.addProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to add product" });
    }
  });

  app.put("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = req.body;
      const product = await storage.updateProduct(id, productData);
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
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.post("/api/admin/categories", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const categoryData = req.body;
      const category = await storage.addCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Failed to add category" });
    }
  });

  app.put("/api/admin/categories/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const categoryData = req.body;
      const category = await storage.updateCategory(id, categoryData);
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
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Site settings management
  const siteSettings = {
    logoUrl: "/attached_assets/Hednor Logo 22 updated-5721x3627_1750949407940.png",
    siteName: "Hednor",
    heroVideo: "/client/src/assets/hero-video.mp4",
    primaryColor: "#F59E0B",
    secondaryColor: "#1F2937",
    footerText: "© 2025 Hednor. All rights reserved."
  };

  app.get("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    res.json(siteSettings);
  });

  app.put("/api/admin/settings", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      Object.assign(siteSettings, req.body);
      res.json({ message: "Settings updated successfully", settings: siteSettings });
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

  const httpServer = createServer(app);
  return httpServer;
}

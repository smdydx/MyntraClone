import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const MONGODB_URI =
  "mongodb+srv://samadalam1216:root@cluster0.xrkba3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "your-jwt-secret-key";

let client: MongoClient;
let db: Db;

export function generateToken(payload: {
  userId: string;
  email: string;
}): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
    };
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function connectToMongoDB() {
  try {
    if (db) {
      try {
        // Test existing connection
        await db.admin().ping();
        console.log('Already connected to MongoDB');
        return;
      } catch (error) {
        console.log('Existing connection failed, reconnecting...');
        db = null;
        client = null;
      }
    }

    const uri = process.env.MONGODB_URI || MONGODB_URI;
    client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000
    });

    await client.connect();
    db = client.db();

    // Test the connection
    await db.admin().ping();

    console.log('Connected to MongoDB successfully');

    // Create indexes if they don't exist
    await createIndexes();

    // Handle connection events
    client.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    client.on('close', () => {
      console.log('MongoDB connection closed');
      db = null;
      client = null;
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    db = null;
    client = null;

    // Retry connection after 5 seconds
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectToMongoDB();
    }, 5000);

    throw error;
  }
}

async function createIndexes() {
  try {
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("products").createIndex({ slug: 1 }, { unique: true });
    await db.collection("products").createIndex({ categoryId: 1 });
    await db
      .collection("categories")
      .createIndex({ slug: 1 }, { unique: true });
    await db.collection("orders").createIndex({ userId: 1 });
    await db.collection("cartItems").createIndex({ userId: 1 });
    await db.collection("wishlistItems").createIndex({ userId: 1 });
  } catch (error) {
    console.log("Indexes already exist or error creating them:", error.message);
  }
}

// Interfaces
export interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface Category {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: ObjectId;
  isActive: boolean;
  createdAt: Date;
}

export interface Product {
  _id?: ObjectId;
  name: string;
  slug: string;
  description?: string;
  brand: string;
  categoryId: ObjectId;
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
  createdAt: Date;
}

export interface CartItem {
  _id?: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: Date;
}

export interface WishlistItem {
  _id?: ObjectId;
  userId: ObjectId;
  productId: ObjectId;
  createdAt: Date;
}

export interface Order {
  _id?: ObjectId;
  userId: ObjectId;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: any;
  items: any[];
  createdAt: Date;
}

export interface SiteSettings {
  logoUrl: string;
  siteName: string;
  siteDescription?: string;
  faviconUrl?: string;
  heroVideo: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroCTA?: string;
  showHeroVideo?: boolean;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontFamily?: string;
  headerStyle?: string;
  footerStyle?: string;
  showBreadcrumbs?: boolean;
  showRecentlyViewed?: boolean;
  footerText: string;
  aboutText?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
  businessHours?: string;
  supportEmail?: string;
  metaDescription?: string;
  metaKeywords?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  enableSEO?: boolean;
  updatedAt: Date;
}

// Payment and Order interfaces
export interface Payment {
  _id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CartService {
  private collection: Collection<CartItem>;

  constructor() {
    this.collection = db.collection<CartItem>("cartItems");
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      return await this.collection
        .find({ userId: new ObjectId(userId) })
        .toArray();
    } catch (error) {
      console.error('Error getting cart items:', error);
      return [];
    }
  }

  async getGuestCartItems(sessionId: string): Promise<CartItem[]> {
    try {
      return await this.collection
        .find({ sessionId: sessionId })
        .toArray();
    } catch (error) {
      console.error('Error getting guest cart items:', error);
      return [];
    }
  }

  async addToCart(
    cartData: Omit<CartItem, "_id" | "createdAt">,
  ): Promise<CartItem> {
    try {
      // Validate required fields
      if (!cartData.userId || !cartData.productId) {
        throw new Error("User ID and Product ID are required");
      }

      // Validate ObjectId format
      if (!ObjectId.isValid(cartData.userId)) {
        throw new Error("Invalid User ID format");
      }
      if (!ObjectId.isValid(cartData.productId)) {
        throw new Error("Invalid Product ID format");
      }

      // Check if product exists
      const productService = new ProductService();
      const product = await productService.getProductById(
        cartData.productId.toString(),
      );
      if (!product) {
        throw new Error("Product not found");
      }

      // Check if item already exists in cart
      const existingItem = await this.collection.findOne({
        userId: new ObjectId(cartData.userId),
        productId: new ObjectId(cartData.productId),
        size: cartData.size || null,
        color: cartData.color || null,
      });

      if (existingItem) {
        // Update quantity instead of creating new item
        const updatedQuantity =
          existingItem.quantity + (cartData.quantity || 1);
        const result = await this.collection.findOneAndUpdate(
          { _id: existingItem._id },
          { $set: { quantity: updatedQuantity } },
          { returnDocument: "after" },
        );
        if (!result) {
          throw new Error("Failed to update cart item");
        }
        return result;
      }

      const cartItem: CartItem = {
        ...cartData,
        userId: new ObjectId(cartData.userId),
        productId: new ObjectId(cartData.productId),
        quantity: cartData.quantity || 1,
        createdAt: new Date(),
      };

      const result = await this.collection.insertOne(cartItem);
      return { ...cartItem, _id: result.insertedId };
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { quantity } },
      { returnDocument: "after" },
    );

    return result;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await this.collection.deleteMany({
      userId: new ObjectId(userId),
    });
    return result.deletedCount > 0;
  }
}

export class WishlistService {
  private collection: Collection<WishlistItem>;

  constructor() {
    this.collection = db.collection<WishlistItem>("wishlistItems");
  }

  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await this.collection
      .find({ userId: new ObjectId(userId) })
      .toArray();
  }

  async addToWishlist(
    wishlistData: Omit<WishlistItem, "_id" | "createdAt">,
  ): Promise<WishlistItem> {
    const wishlistItem: WishlistItem = {
      ...wishlistData,
      userId: new ObjectId(wishlistData.userId),
      productId: new ObjectId(wishlistData.productId),
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(wishlistItem);
    return { ...wishlistItem, _id: result.insertedId };
  }

  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const result = await this.collection.deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });
    return result.deletedCount === 1;
  }
}

export class CategoryService {
  private collection: Collection<Category>;

  constructor() {
    this.collection = db.collection<Category>("categories");
  }

  async getCategories(): Promise<Category[]> {
    return await this.collection.find({ isActive: true }).toArray();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.collection.findOne({ slug });
  }

  async createCategory(
    categoryData: Omit<Category, "_id" | "createdAt">,
  ): Promise<Category> {
    try {
      // Validate required fields
      if (!categoryData.name || !categoryData.slug) {
        throw new Error("Name and slug are required fields");
      }

      // Check if slug already exists
      const existingCategory = await this.collection.findOne({
        slug: categoryData.slug,
      });
      if (existingCategory) {
        throw new Error("Category with this slug already exists");
      }

      const category: Category = {
        ...categoryData,
        isActive:
          categoryData.isActive !== undefined ? categoryData.isActive : true,
        createdAt: new Date(),
      };

      const result = await this.collection.insertOne(category);
      return { ...category, _id: result.insertedId };
    } catch (error) {
      console.error("Category creation error:", error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    updateData: Partial<Category>,
  ): Promise<Category | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}

export class ProductService {
  private collection: Collection<Product>;

  constructor() {
    this.collection = db.collection<Product>("products");
  }

  async getProducts(filters: any = {}, options: any = {}): Promise<Product[]> {
    try {
      const query: any = {};

      if (filters.categoryId) {
        query.categoryId = new ObjectId(filters.categoryId);
      }

      if (filters.category) {
        query.categoryId = new ObjectId(filters.category);
      }

      if (filters.brand) {
        query.brand = { $regex: filters.brand, $options: "i" };
      }

      if (filters.featured || filters.isFeatured) {
        query.isFeatured = true;
      }

      if (filters.onSale || filters.isOnSale) {
        query.isOnSale = true;
      }

      if (filters.inStock !== undefined) {
        query.inStock = filters.inStock;
      }

      if (filters.price) {
        query.price = {};
        if (filters.price.$gte !== undefined) {
          query.price.$gte = filters.price.$gte;
        }
        if (filters.price.$lte !== undefined) {
          query.price.$lte = filters.price.$lte;
        }
      }

      if (filters.$or) {
        query.$or = filters.$or;
      }

      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: "i" } },
          { description: { $regex: filters.search, $options: "i" } },
          { brand: { $regex: filters.search, $options: "i" } },
        ];
      }

      let cursor = this.collection.find(query);

      if (options.sort) {
        cursor = cursor.sort(options.sort);
      }

      if (options.skip) {
        cursor = cursor.skip(options.skip);
      }

      if (options.limit) {
        cursor = cursor.limit(options.limit);
      }

      return await cursor.toArray();
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return await this.collection.findOne({ slug });
  }

  async createProduct(
    productData: Omit<Product, "_id" | "createdAt">,
  ): Promise<Product> {
    try {
      // Validate required fields
      if (!productData.name || !productData.brand || !productData.price) {
        throw new Error("Name, brand, and price are required fields");
      }

      if (!productData.slug) {
        throw new Error("Product slug is required");
      }

      if (!productData.categoryId) {
        throw new Error("Category ID is required");
      }

      // Validate price
      const price = parseFloat(productData.price.toString());
      if (isNaN(price) || price <= 0) {
        throw new Error("Price must be a positive number");
      }

      // Validate sale price if provided
      let salePrice: number | undefined;
      if (productData.salePrice) {
        salePrice = parseFloat(productData.salePrice.toString());
        if (isNaN(salePrice) || salePrice < 0) {
          throw new Error("Sale price must be a non-negative number");
        }
        if (salePrice >= price) {
          throw new Error("Sale price must be less than regular price");
        }
      }

      // Check if slug already exists
      const existingProduct = await this.collection.findOne({
        slug: productData.slug,
      });
      if (existingProduct) {
        throw new Error("Product with this slug already exists");
      }

      // Validate category exists
      const categoryService = new CategoryService();
      const category = await categoryService.getCategoryById(
        productData.categoryId.toString(),
      );
      if (!category) {
        throw new Error("Selected category does not exist");
      }

      const product: Product = {
        ...productData,
        categoryId: new ObjectId(productData.categoryId),
        price,
        salePrice,
        stockQuantity: Math.max(0, productData.stockQuantity || 0),
        rating: Math.min(5, Math.max(0, productData.rating || 0)),
        reviewCount: Math.max(0, productData.reviewCount || 0),
        images: Array.isArray(productData.images) ? productData.images : [],
        sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
        colors: Array.isArray(productData.colors) ? productData.colors : [],
        tags: Array.isArray(productData.tags) ? productData.tags : [],
        inStock: productData.inStock !== undefined ? productData.inStock : true,
        isFeatured: productData.isFeatured || false,
        isOnSale: productData.isOnSale || false,
        createdAt: new Date(),
      };

      const result = await this.collection.insertOne(product);
      return { ...product, _id: result.insertedId };
    } catch (error) {
      console.error("Product creation error:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId);
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  async getFilteredProducts(filter = {}, options: any = {}) {
    try {
      let query = this.collection.find(filter);

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.skip) {
        query = query.skip(options.skip);
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      return await query.toArray();
    } catch (error) {
      console.error('Error getting filtered products:', error);
      return [];
    }
  }

  async getProductCount(filter = {}) {
    try {
      return await this.collection.countDocuments(filter);
    } catch (error) {
      console.error('Error getting product count:', error);
      return 0;
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      if (!this.collection) {
        console.error('Products collection not initialized');
        return [];
      }
      
      const products = await this.collection.find({}).sort({ createdAt: -1 }).toArray();
      console.log(`Successfully fetched ${products.length} products`);
      return products;
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }
}

export class SiteSettingsService {
  private collection: Collection<SiteSettings>;

  constructor() {
    this.collection = db.collection<SiteSettings>("siteSettings");
  }

  async getSettings(): Promise<SiteSettings> {
    let settings = await this.collection.findOne({});

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings: SiteSettings = {
        logoUrl: "/logo.png",
        siteName: "Hednor",
        siteDescription: "Premium fashion and lifestyle products",
        faviconUrl: "/favicon.ico",
        heroVideo: "/hero-video.mp4",
        heroTitle: "Welcome to Hednor",
        heroSubtitle: "Discover premium fashion",
        heroCTA: "Shop Now",
        showHeroVideo: true,
        primaryColor: "#000000",
        secondaryColor: "#FFD700",
        accentColor: "#FF6B6B",
        fontFamily: "Inter",
        headerStyle: "modern",
        footerStyle: "minimal",
        showBreadcrumbs: true,
        showRecentlyViewed: true,
        footerText: "© 2024 Hednor. All rights reserved.",
        aboutText:
          "Hednor is your premium destination for fashion and lifestyle products.",
        contactEmail: "contact@hednor.com",
        contactPhone: "+1 (555) 123-4567",
        businessAddress: "123 Fashion Street, Style City, SC 12345",
        businessHours: "Mon-Fri 9AM-6PM",
        updatedAt: new Date(),
      };

      const result = await this.collection.insertOne(defaultSettings);
      settings = { ...defaultSettings, _id: result.insertedId };
    }

    return settings;
  }

  async updateSettings(
    updateData: Partial<SiteSettings>,
  ): Promise<SiteSettings> {
    const result = await this.collection.findOneAndUpdate(
      {},
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: "after", upsert: true },
    );

    return result!;
  }
}

export class PaymentService {
  private collection: Collection<Payment>;

  constructor() {
    this.collection = db.collection<Payment>("payments");
  }

  async createPayment(
    paymentData: Omit<Payment, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Payment> {
    const payment: Payment = {
      _id: new ObjectId().toString(),
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.collection.insertOne(payment as any);
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return (await this.collection.findOne({ _id: id })) as Payment | null;
  }

  async updatePaymentStatus(
    id: string,
    status: Payment["status"],
    transactionId?: string,
  ): Promise<Payment | null> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result as Payment | null;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return (await this.collection.find({ userId }).toArray()) as Payment[];
  }

  async verifyRazorpayPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<boolean> {
    try {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error("RAZORPAY_KEY_SECRET not found");
        return false;
      }

      const crypto = await import("crypto");
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");
      return generatedSignature === razorpaySignature;
    } catch (error) {
      console.error("Razorpay verification error:", error);
      return false;
    }
  }
}

export class OrderService {
  private collection: Collection<Order>;

  constructor() {
    this.collection = db.collection<Order>("orders");
  }

  async createOrder(
    orderData: Omit<Order, "_id" | "createdAt"> & { orderId?: string },
  ): Promise<Order & { orderId: string }> {
    const orderId =
      orderData.orderId ||
      `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const order: Order = {
      _id: new ObjectId(),
      ...orderData,
      userId: new ObjectId(orderData.userId),
      createdAt: new Date(),
    };

    await this.collection.insertOne(order);
    return { ...order, orderId };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await this.collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  }

  async updateOrderStatus(
    id: string,
    status: Order["status"],
    trackingNumber?: string,
  ): Promise<Order | null> {
    const updateData: any = { status };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    return result;
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.collection.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newOrdersToday = await this.collection.countDocuments({
      createdAt: { $gte: todayStart },
    });

    const totalRevenue = await this.collection
      .aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ])
      .toArray();

    const avgOrderValue = await this.collection
      .aggregate([
        {
          $group: {
            _id: null,
            avg: { $avg: "$totalAmount" },
          },
        },
      ])
      .toArray();

    return {
      totalOrders,
      newOrdersToday,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgOrderValue: Math.round(avgOrderValue[0]?.avg || 0),
    };
  }
}

export class UserService {
  private collection: Collection<User>;

  constructor() {
    this.collection = db.collection<User>("users");
  }

  async registerUser(
    userData: any,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const existingUser = await this.collection.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: User = {
      ...userData,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(user);
    const createdUser = await this.collection.findOne({
      _id: result.insertedId,
    });

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    const token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password, ...userWithoutPassword } = createdUser;
    return { user: userWithoutPassword, token };
  }

  async loginUser(
    loginData: any,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    const user = await this.collection.findOne({ email: loginData.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<Omit<User, "password"> | null> {
    const user = await this.collection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.collection.findOne({ email });
  }

  async updateUser(
    userId: string,
    updateData: any,
  ): Promise<Omit<User, "password"> | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: "after" },
    );

    if (!result) {
      return null;
    }

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getUserCount(): Promise<number> {
    return await this.collection.countDocuments();
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.collection.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newUsersToday = await this.collection.countDocuments({
      createdAt: { $gte: todayStart },
    });

    return {
      totalUsers,
      newUsersToday,
    };
  }
}
export { db };
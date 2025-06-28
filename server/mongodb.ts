
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = "mongodb+srv://samadalam1216:root@cluster0.xrkba3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "your-jwt-secret-key";

let client: MongoClient;
let db: Db;

export async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('hednor-ecommerce');
    console.log('Connected to MongoDB');
    
    // Create indexes for better performance
    await createIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function createIndexes() {
  try {
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('products').createIndex({ slug: 1 }, { unique: true });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    await db.collection('orders').createIndex({ userId: 1 });
    await db.collection('cartItems').createIndex({ userId: 1 });
    await db.collection('wishlistItems').createIndex({ userId: 1 });
  } catch (error) {
    console.log('Indexes already exist or error creating them:', error.message);
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
  role: 'user' | 'admin';
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
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  items: any[];
  createdAt: Date;
}

export interface SiteSettings {
  _id?: ObjectId;
  logoUrl: string;
  siteName: string;
  heroVideo: string;
  primaryColor: string;
  secondaryColor: string;
  footerText: string;
  updatedAt: Date;
}

// Services
export class UserService {
  private users: Collection<User>;

  constructor() {
    this.users = db.collection<User>('users');
  }

  async registerUser(userData: any): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const existingUser = await this.users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user: User = {
      ...userData,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };

    const result = await this.users.insertOne(user);
    const createdUser = await this.users.findOne({ _id: result.insertedId });

    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    const token = jwt.sign(
      { userId: createdUser._id, email: createdUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = createdUser;
    return { user: userWithoutPassword, token };
  }

  async loginUser(loginData: any): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = await this.users.findOne({ email: loginData.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(userId: string, updateData: any): Promise<Omit<User, 'password'> | null> {
    const result = await this.users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return null;
    }

    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
  }
}

export class CategoryService {
  private categories: Collection<Category>;

  constructor() {
    this.categories = db.collection<Category>('categories');
  }

  async getCategories(): Promise<Category[]> {
    return await this.categories.find({ isActive: true }).toArray();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return await this.categories.findOne({ _id: new ObjectId(id) });
  }

  async createCategory(categoryData: any): Promise<Category> {
    const category: Category = {
      ...categoryData,
      isActive: true,
      createdAt: new Date()
    };

    const result = await this.categories.insertOne(category);
    const createdCategory = await this.categories.findOne({ _id: result.insertedId });
    return createdCategory!;
  }

  async updateCategory(id: string, updateData: any): Promise<Category | null> {
    const result = await this.categories.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.categories.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export class ProductService {
  private products: Collection<Product>;

  constructor() {
    this.products = db.collection<Product>('products');
  }

  async getProducts(filters: any = {}): Promise<Product[]> {
    const query: any = {};

    if (filters.categoryId) {
      query.categoryId = new ObjectId(filters.categoryId);
    }

    if (filters.featured) {
      query.isFeatured = true;
    }

    if (filters.onSale) {
      query.isOnSale = true;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { brand: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return await this.products.find(query).toArray();
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.products.findOne({ _id: new ObjectId(id) });
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return await this.products.findOne({ slug });
  }

  async createProduct(productData: any): Promise<Product> {
    const product: Product = {
      ...productData,
      categoryId: new ObjectId(productData.categoryId),
      price: parseFloat(productData.price),
      salePrice: productData.salePrice ? parseFloat(productData.salePrice) : undefined,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date()
    };

    const result = await this.products.insertOne(product);
    const createdProduct = await this.products.findOne({ _id: result.insertedId });
    return createdProduct!;
  }

  async updateProduct(id: string, updateData: any): Promise<Product | null> {
    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId);
    }
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.salePrice) {
      updateData.salePrice = parseFloat(updateData.salePrice);
    }

    const result = await this.products.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.products.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export class CartService {
  private cartItems: Collection<CartItem>;

  constructor() {
    this.cartItems = db.collection<CartItem>('cartItems');
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return await this.cartItems.find({ userId: new ObjectId(userId) }).toArray();
  }

  async addToCart(cartData: any): Promise<CartItem> {
    const cartItem: CartItem = {
      ...cartData,
      userId: new ObjectId(cartData.userId),
      productId: new ObjectId(cartData.productId),
      createdAt: new Date()
    };

    const result = await this.cartItems.insertOne(cartItem);
    const createdItem = await this.cartItems.findOne({ _id: result.insertedId });
    return createdItem!;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const result = await this.cartItems.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { quantity } },
      { returnDocument: 'after' }
    );
    return result;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await this.cartItems.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

export class WishlistService {
  private wishlistItems: Collection<WishlistItem>;

  constructor() {
    this.wishlistItems = db.collection<WishlistItem>('wishlistItems');
  }

  async getWishlistItems(userId: string): Promise<WishlistItem[]> {
    return await this.wishlistItems.find({ userId: new ObjectId(userId) }).toArray();
  }

  async addToWishlist(wishlistData: any): Promise<WishlistItem> {
    const wishlistItem: WishlistItem = {
      ...wishlistData,
      userId: new ObjectId(wishlistData.userId),
      productId: new ObjectId(wishlistData.productId),
      createdAt: new Date()
    };

    const result = await this.wishlistItems.insertOne(wishlistItem);
    const createdItem = await this.wishlistItems.findOne({ _id: result.insertedId });
    return createdItem!;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const result = await this.wishlistItems.deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId)
    });
    return result.deletedCount > 0;
  }
}

export class SiteSettingsService {
  private settings: Collection<SiteSettings>;

  constructor() {
    this.settings = db.collection<SiteSettings>('siteSettings');
  }

  async getSettings(): Promise<SiteSettings> {
    let settings = await this.settings.findOne({});
    
    if (!settings) {
      // Create default settings
      const defaultSettings: SiteSettings = {
        logoUrl: "/attached_assets/Hednor Logo 22 updated-5721x3627_1750949407940.png",
        siteName: "Hednor",
        heroVideo: "/client/src/assets/hero-video.mp4",
        primaryColor: "#F59E0B",
        secondaryColor: "#1F2937",
        footerText: "© 2025 Hednor. All rights reserved.",
        updatedAt: new Date()
      };
      
      await this.settings.insertOne(defaultSettings);
      settings = defaultSettings;
    }
    
    return settings;
  }

  async updateSettings(updateData: any): Promise<SiteSettings> {
    const result = await this.settings.findOneAndUpdate(
      {},
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      },
      { 
        returnDocument: 'after',
        upsert: true 
      }
    );
    return result!;
  }
}

export function verifyToken(token: string): { userId: string; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export { db };

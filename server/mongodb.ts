import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const MONGODB_URI = "mongodb+srv://samadalam1216:root@cluster0.xrkba3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "your-jwt-secret-key";

let client: MongoClient;
let db: Db;

export function verifyToken(token: string): { userId: string; email: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      userId: decoded.userId,
      email: decoded.email
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

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

export class PaymentService {
  private collection: Collection<Payment>;

  constructor() {
    this.collection = db.collection<Payment>("payments");
  }

  async createPayment(paymentData: Omit<Payment, "_id" | "createdAt" | "updatedAt">): Promise<Payment> {
    const payment: Payment = {
      _id: new ObjectId().toString(),
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await this.collection.insertOne(payment as any);
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return await this.collection.findOne({ _id: id }) as Payment | null;
  }

  async updatePaymentStatus(id: string, status: Payment["status"], transactionId?: string): Promise<Payment | null> {
    const updateData: any = { 
      status, 
      updatedAt: new Date() 
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result as Payment | null;
  }

  async getPaymentsByUserId(userId: string): Promise<Payment[]> {
    return await this.collection.find({ userId }).toArray() as Payment[];
  }

  async verifyRazorpayPayment(razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string): Promise<boolean> {
    try {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
      const generatedSignature = hmac.digest('hex');
      return generatedSignature === razorpaySignature;
    } catch (error) {
      return false;
    }
  }
}

export class OrderService {
  private collection: Collection<Order>;

  constructor() {
    this.collection = db.collection<Order>("orders");
  }

  async createOrder(orderData: Omit<Order, "_id" | "createdAt">): Promise<Order> {
    const order: Order = {
      _id: new ObjectId(),
      ...orderData,
      createdAt: new Date()
    };

    await this.collection.insertOne(order);
    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await this.collection.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    return result;
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.collection.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newOrdersToday = await this.collection.countDocuments({
      createdAt: { $gte: todayStart }
    });

    const totalRevenue = await this.collection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]).toArray();

    const avgOrderValue = await this.collection.aggregate([
      {
        $group: {
          _id: null,
          avg: { $avg: "$totalAmount" }
        }
      }
    ]).toArray();

    return {
      totalOrders,
      newOrdersToday,
      totalRevenue: totalRevenue[0]?.total || 0,
      avgOrderValue: Math.round(avgOrderValue[0]?.avg || 0)
    };
  }
}

export class UserService {
  private collection: Collection<User>;

  constructor() {
    this.collection = db.collection<User>('users');
  }

  async registerUser(userData: any): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const existingUser = await this.collection.findOne({ email: userData.email });
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

    const result = await this.collection.insertOne(user);
    const createdUser = await this.collection.findOne({ _id: result.insertedId });

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
    const user = await this.collection.findOne({ email: loginData.email });
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

  async updateUser(userId: string, updateData: any): Promise<Omit<User, 'password'> | null> {
    const result = await this.collection.findOneAndUpdate(
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

  async getAllUsers(): Promise<User[]> {
    return await this.collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.collection.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newUsersToday = await this.collection.countDocuments({
      createdAt: { $gte: todayStart }
    });

    return {
      totalUsers,
      newUsersToday
    };
  }
}
export { db };
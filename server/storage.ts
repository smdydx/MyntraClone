import { 
  users, categories, products, cartItems, wishlistItems, orders,
  type User, type InsertUser, type Category, type InsertCategory,
  type Product, type InsertProduct, type CartItem, type InsertCartItem,
  type WishlistItem, type InsertWishlistItem, type Order, type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: { categoryId?: number; featured?: boolean; onSale?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;

  // Wishlist
  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getUserOrders(userId: number): Promise<Order[]>;

  // Admin methods for managing products
  addProduct(productData: any): Promise<any>;
  updateProduct(id: number, productData: any): Promise<any>;
  deleteProduct(id: number): Promise<boolean>;

  // Admin methods for managing categories
  addCategory(categoryData: any): Promise<any>;
  updateCategory(id: number, categoryData: any): Promise<any>;
  deleteCategory(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private categories: Map<number, Category> = new Map();
  private products: Map<number, Product> = new Map();
  private cartItems: Map<number, CartItem> = new Map();
  private wishlistItems: Map<number, WishlistItem> = new Map();
  private orders: Map<number, Order> = new Map();
  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentProductId = 1;
  private currentCartItemId = 1;
  private currentWishlistItemId = 1;
  private currentOrderId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const menCategory = this.createCategorySync({ name: "Men", slug: "men", description: "Men's Fashion", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });
    const womenCategory = this.createCategorySync({ name: "Women", slug: "women", description: "Women's Fashion", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });
    const kidsCategory = this.createCategorySync({ name: "Kids", slug: "kids", description: "Kids Fashion", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });
    const accessoriesCategory = this.createCategorySync({ name: "Accessories", slug: "accessories", description: "Fashion Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });
    const beautyCategory = this.createCategorySync({ name: "Beauty", slug: "beauty", description: "Beauty Products", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });
    const homeCategory = this.createCategorySync({ name: "Home", slug: "home", description: "Home & Living", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400", parentId: null, isActive: true });

    // Seed products
    this.createProductSync({
      name: "Men's Cotton T-Shirt",
      slug: "mens-cotton-tshirt",
      description: "Comfortable cotton t-shirt for casual wear",
      brand: "H&M",
      categoryId: menCategory.id,
      price: "999.00",
      salePrice: "499.00",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Blue", "Black", "White"],
      inStock: true,
      stockQuantity: 50,
      rating: "4.2",
      reviewCount: 1234,
      tags: ["casual", "comfortable"],
      isFeatured: true,
      isOnSale: true
    });

    this.createProductSync({
      name: "Women's Summer Dress",
      slug: "womens-summer-dress",
      description: "Elegant summer dress perfect for any occasion",
      brand: "Zara",
      categoryId: womenCategory.id,
      price: "1299.00",
      salePrice: null,
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Floral", "Solid Blue", "Black"],
      inStock: true,
      stockQuantity: 25,
      rating: "4.8",
      reviewCount: 856,
      tags: ["elegant", "summer"],
      isFeatured: true,
      isOnSale: false
    });

    this.createProductSync({
      name: "Men's Formal Shoes",
      slug: "mens-formal-shoes",
      description: "Premium leather formal shoes",
      brand: "Nike",
      categoryId: menCategory.id,
      price: "2499.00",
      salePrice: null,
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["Black", "Brown"],
      inStock: true,
      stockQuantity: 30,
      rating: "4.5",
      reviewCount: 432,
      tags: ["formal", "leather"],
      isFeatured: true,
      isOnSale: false
    });

    this.createProductSync({
      name: "Women's Leather Handbag",
      slug: "womens-leather-handbag",
      description: "Luxury leather handbag with premium finish",
      brand: "Coach",
      categoryId: accessoriesCategory.id,
      price: "4999.00",
      salePrice: "3499.00",
      images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
      sizes: ["One Size"],
      colors: ["Black", "Brown", "Tan"],
      inStock: true,
      stockQuantity: 15,
      rating: "4.9",
      reviewCount: 2156,
      tags: ["luxury", "leather"],
      isFeatured: true,
      isOnSale: true
    });

    this.createProductSync({
      name: "Kids Cotton Shirt",
      slug: "kids-cotton-shirt",
      description: "Comfortable cotton shirt for kids",
      brand: "Gap Kids",
      categoryId: kidsCategory.id,
      price: "799.00",
      salePrice: null,
      images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"],
      sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      colors: ["Blue", "Red", "Green"],
      inStock: true,
      stockQuantity: 40,
      rating: "4.3",
      reviewCount: 324,
      tags: ["kids", "comfortable"],
      isFeatured: true,
      isOnSale: false
    });
  }

  private createCategorySync(category: InsertCategory): Category {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  private createProductSync(product: InsertProduct): Product {
    const id = this.currentProductId++;
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(cat => cat.isActive);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Products
  async getProducts(filters?: { categoryId?: number; featured?: boolean; onSale?: boolean; search?: string }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters?.categoryId) {
      products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.featured) {
      products = products.filter(p => p.isFeatured);
    }

    if (filters?.onSale) {
      products = products.filter(p => p.isOnSale);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      );
    }

    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date() 
    };
    this.products.set(id, product);
    return product;
  }

  // Cart
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const item: CartItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date() 
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Wishlist
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(item => item.userId === userId);
  }

  async addToWishlist(insertItem: InsertWishlistItem): Promise<WishlistItem> {
    const id = this.currentWishlistItemId++;
    const item: WishlistItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date() 
    };
    this.wishlistItems.set(id, item);
    return item;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values()).find(
      item => item.userId === userId && item.productId === productId
    );
    if (item) {
      return this.wishlistItems.delete(item.id);
    }
    return false;
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  // Admin methods for managing products
  async addProduct(productData: any): Promise<any> {
    const id = this.currentProductId++;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: any): Promise<any> {
    const product = this.products.get(id);
    if (product) {
      const updatedProduct = { ...product, ...productData };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Admin methods for managing categories
  async addCategory(categoryData: any): Promise<any> {
     const id = this.currentCategoryId++;
    const newCategory: Category = {
      ...categoryData,
      id
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, categoryData: any): Promise<any> {
    const category = this.categories.get(id);
    if (category) {
      const updatedCategory = { ...category, ...categoryData };
      this.categories.set(id, updatedCategory);
      return updatedCategory
    }
    return undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
}

export const storage = new MemStorage();
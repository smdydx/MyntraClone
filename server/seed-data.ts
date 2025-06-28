
import { 
  connectToMongoDB, 
  CategoryService, 
  ProductService, 
  SiteSettingsService 
} from './mongodb';

export async function seedDatabase() {
  try {
    await connectToMongoDB();
    
    const categoryService = new CategoryService();
    const productService = new ProductService();
    const siteSettingsService = new SiteSettingsService();

    // Seed categories
    const menCategory = await categoryService.createCategory({
      name: "Men",
      slug: "men",
      description: "Men's clothing and accessories",
      image: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2"
    });

    const womenCategory = await categoryService.createCategory({
      name: "Women",
      slug: "women", 
      description: "Women's clothing and accessories",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b"
    });

    const kidsCategory = await categoryService.createCategory({
      name: "Kids",
      slug: "kids",
      description: "Kids' clothing and accessories", 
      image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9"
    });

    // Seed products
    const products = [
      {
        name: "Men's Cotton T-Shirt",
        slug: "mens-cotton-tshirt",
        description: "Comfortable cotton t-shirt for everyday wear",
        brand: "Hednor",
        categoryId: menCategory._id,
        price: 1299,
        salePrice: 999,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Black", "Navy", "Gray"],
        inStock: true,
        stockQuantity: 50,
        tags: ["casual", "comfortable"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Women's Floral Dress",
        slug: "womens-floral-dress",
        description: "Beautiful floral print dress perfect for any occasion",
        brand: "Hednor",
        categoryId: womenCategory._id,
        price: 2499,
        images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral Print", "Blue Floral", "Pink Floral"],
        inStock: true,
        stockQuantity: 30,
        tags: ["dress", "floral", "elegant"],
        isFeatured: true,
        isOnSale: false
      },
      {
        name: "Kids Cotton Shirt",
        slug: "kids-cotton-shirt",
        description: "Comfortable cotton shirt for kids",
        brand: "Hednor Kids",
        categoryId: kidsCategory._id,
        price: 799,
        images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea"],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: ["Blue", "Red", "Green"],
        inStock: true,
        stockQuantity: 40,
        tags: ["kids", "comfortable"],
        isFeatured: true,
        isOnSale: false
      }
    ];

    for (const product of products) {
      await productService.createProduct(product);
    }

    // Initialize site settings
    await siteSettingsService.getSettings();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

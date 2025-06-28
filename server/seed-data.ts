import { CategoryService, ProductService } from './mongodb';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Seed categories first
    await seedCategories();
    console.log('Categories seeded successfully!');

    // Then seed products
    await seedProducts();
    console.log('Products seeded successfully!');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export async function seedCategories() {
  const categoryService = new CategoryService();

  try {
    // Check if categories already exist
    const existingCategories = await categoryService.getCategories();
    if (existingCategories.length > 0) {
      console.log('Categories already exist, skipping seeding');
      return existingCategories;
    }

    // Main Categories
    const menCategory = await categoryService.createCategory({
      name: "Men",
      slug: "men",
      description: "Men's fashion and accessories",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      isActive: true
    });

    const womenCategory = await categoryService.createCategory({
      name: "Women",
      slug: "women", 
      description: "Women's fashion and accessories",
      image: "https://images.unsplash.com/photo-1494790108755-2616c57f8188?w=400",
      isActive: true
    });

    const kidsCategory = await categoryService.createCategory({
      name: "Kids",
      slug: "kids",
      description: "Children's clothing and accessories",
      image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400",
      isActive: true
    });

    const homeCategory = await categoryService.createCategory({
      name: "Home & Living",
      slug: "home",
      description: "Home decor and living essentials",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      isActive: true
    });

    const beautyCategory = await categoryService.createCategory({
      name: "Beauty & Personal Care",
      slug: "beauty",
      description: "Beauty and personal care products",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
      isActive: true
    });

    const genzCategory = await categoryService.createCategory({
      name: "GenZ",
      slug: "genz",
      description: "Trendy products for Gen Z",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      isActive: true
    });

    const studioCategory = await categoryService.createCategory({
      name: "Studio",
      slug: "studio",
      description: "Premium designer collections",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
      isActive: true
    });

    // Create subcategories for Men
    const menSubcategories = [
      {
        name: "Shirts",
        slug: "men-shirts",
        description: "Men's casual and formal shirts",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
        parentId: menCategory._id,
        isActive: true
      },
      {
        name: "T-Shirts",
        slug: "men-tshirts",
        description: "Men's t-shirts and polos",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        parentId: menCategory._id,
        isActive: true
      },
      {
        name: "Jeans",
        slug: "men-jeans",
        description: "Men's jeans and denim",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        parentId: menCategory._id,
        isActive: true
      },
      {
        name: "Shoes",
        slug: "men-shoes",
        description: "Men's footwear",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
        parentId: menCategory._id,
        isActive: true
      }
    ];

    // Create subcategories for Women
    const womenSubcategories = [
      {
        name: "Dresses",
        slug: "women-dresses",
        description: "Women's dresses and gowns",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        parentId: womenCategory._id,
        isActive: true
      },
      {
        name: "Tops",
        slug: "women-tops",
        description: "Women's tops and blouses",
        image: "https://images.unsplash.com/photo-1564257577-0659a5bbc8b9?w=400",
        parentId: womenCategory._id,
        isActive: true
      },
      {
        name: "Jeans",
        slug: "women-jeans",
        description: "Women's jeans and pants",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        parentId: womenCategory._id,
        isActive: true
      },
      {
        name: "Heels",
        slug: "women-heels",
        description: "Women's heels and footwear",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400",
        parentId: womenCategory._id,
        isActive: true
      }
    ];

    // Create subcategories for Kids
    const kidsSubcategories = [
      {
        name: "Boys",
        slug: "kids-boys",
        description: "Boys clothing and accessories",
        image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=400",
        parentId: kidsCategory._id,
        isActive: true
      },
      {
        name: "Girls",
        slug: "kids-girls",
        description: "Girls clothing and accessories",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400",
        parentId: kidsCategory._id,
        isActive: true
      }
    ];

    // Create all subcategories
    const allSubcategories = [
      ...menSubcategories,
      ...womenSubcategories,
      ...kidsSubcategories
    ];

    for (const subcategory of allSubcategories) {
      await categoryService.createCategory(subcategory);
    }

    console.log('Categories seeded successfully!');

    const allCategories = await categoryService.getCategories();
    return allCategories;

  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

export async function seedProducts() {
  const productService = new ProductService();
  const categoryService = new CategoryService();

  try {
    // Check if products already exist
    const existingProducts = await productService.getProducts({});
    if (existingProducts.length > 0) {
      console.log('Products already exist, skipping seeding');
      return existingProducts;
    }

    // Get categories for products
    const categories = await categoryService.getCategories();
    const menCategory = categories.find(cat => cat.slug === 'men');
    const womenCategory = categories.find(cat => cat.slug === 'women');
    const kidsCategory = categories.find(cat => cat.slug === 'kids');
    const homeCategory = categories.find(cat => cat.slug === 'home');
    const beautyCategory = categories.find(cat => cat.slug === 'beauty');
    const genzCategory = categories.find(cat => cat.slug === 'genz');

    if (!menCategory || !womenCategory || !kidsCategory || !homeCategory) {
      throw new Error('Required categories not found. Please seed categories first.');
    }

    // Comprehensive product data for website and admin dashboard
    const sampleProducts = [
      // Men's Collection
      {
        name: "Premium Cotton T-Shirt",
        slug: "premium-cotton-tshirt",
        description: "Ultra-soft premium cotton t-shirt with modern fit. Perfect for everyday wear with superior comfort and style.",
        brand: "Hednor Premium",
        categoryId: menCategory._id,
        price: 1299,
        salePrice: 899,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", "https://images.unsplash.com/photo-1583743814966-8936f37f236f?w=400"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy Blue", "Black", "White", "Grey"],
        inStock: true,
        stockQuantity: 150,
        rating: 4.7,
        reviewCount: 2341,
        tags: ["premium", "casual", "comfortable", "bestseller"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Formal Dress Shirt",
        slug: "formal-dress-shirt",
        description: "Crisp formal shirt made from high-quality cotton blend. Perfect for office and formal occasions.",
        brand: "Hednor Formals",
        categoryId: menCategory._id,
        price: 1899,
        images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Light Blue", "Pink"],
        inStock: true,
        stockQuantity: 85,
        rating: 4.5,
        reviewCount: 1567,
        tags: ["formal", "office", "premium"],
        isFeatured: true,
        isOnSale: false
      },
      {
        name: "Denim Jeans Classic Fit",
        slug: "denim-jeans-classic-fit",
        description: "Classic fit denim jeans with premium stretch fabric. Comfortable all-day wear with timeless style.",
        brand: "Hednor Denim",
        categoryId: menCategory._id,
        price: 2499,
        salePrice: 1999,
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Dark Blue", "Light Blue", "Black"],
        inStock: true,
        stockQuantity: 120,
        rating: 4.6,
        reviewCount: 1890,
        tags: ["denim", "casual", "premium"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Athletic Sports Shoes",
        slug: "athletic-sports-shoes",
        description: "High-performance athletic shoes with advanced cushioning technology. Perfect for running and gym workouts.",
        brand: "Hednor Sports",
        categoryId: menCategory._id,
        price: 3999,
        salePrice: 2999,
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black/White", "Navy/Orange", "Grey/Blue"],
        inStock: true,
        stockQuantity: 75,
        rating: 4.8,
        reviewCount: 2156,
        tags: ["sports", "athletic", "comfortable", "trending"],
        isFeatured: true,
        isOnSale: true
      },

      // Women's Collection
      {
        name: "Elegant Summer Dress",
        slug: "elegant-summer-dress",
        description: "Flowing summer dress with beautiful floral patterns. Perfect for casual outings and summer parties.",
        brand: "Hednor Femme",
        categoryId: womenCategory._id,
        price: 2299,
        salePrice: 1799,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Floral Blue", "Floral Pink", "Solid Black", "Solid Navy"],
        inStock: true,
        stockQuantity: 95,
        rating: 4.9,
        reviewCount: 1456,
        tags: ["elegant", "summer", "floral", "trending"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Designer Handbag",
        slug: "designer-handbag",
        description: "Luxurious designer handbag crafted from premium leather. Spacious and stylish for everyday use.",
        brand: "Hednor Luxury",
        categoryId: womenCategory._id,
        price: 5999,
        salePrice: 4499,
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Tan", "Red"],
        inStock: true,
        stockQuantity: 45,
        rating: 4.7,
        reviewCount: 2234,
        tags: ["luxury", "designer", "leather", "premium"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Ethnic Kurta Set",
        slug: "ethnic-kurta-set",
        description: "Beautiful ethnic kurta set with intricate embroidery. Perfect for festivals and special occasions.",
        brand: "Hednor Ethnic",
        categoryId: womenCategory._id,
        price: 3299,
        salePrice: 2499,
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Royal Blue", "Maroon", "Golden", "Pink"],
        inStock: true,
        stockQuantity: 65,
        rating: 4.6,
        reviewCount: 987,
        tags: ["ethnic", "traditional", "festive", "embroidered"],
        isFeatured: true,
        isOnSale: true
      },

      // Kids Collection
      {
        name: "Kids Cotton Shirt Set",
        slug: "kids-cotton-shirt-set",
        description: "Comfortable cotton shirt and shorts set for kids. Soft fabric and vibrant colors kids love.",
        brand: "Hednor Kids",
        categoryId: kidsCategory._id,
        price: 899,
        salePrice: 699,
        images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400"],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Blue Stripes", "Red Checks", "Green Solid", "Yellow Prints"],
        inStock: true,
        stockQuantity: 110,
        rating: 4.5,
        reviewCount: 678,
        tags: ["kids", "comfortable", "cotton", "colorful"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Kids Party Dress",
        slug: "kids-party-dress",
        description: "Adorable party dress for little princesses. Sparkly design perfect for birthdays and special events.",
        brand: "Hednor Kids",
        categoryId: kidsCategory._id,
        price: 1599,
        salePrice: 1199,
        images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400"],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: ["Pink Sparkle", "Purple Glitter", "Blue Shimmer"],
        inStock: true,
        stockQuantity: 55,
        rating: 4.8,
        reviewCount: 456,
        tags: ["kids", "party", "dress", "sparkly"],
        isFeatured: true,
        isOnSale: true
      },

      // Home & Living
      {
        name: "Premium Bedsheet Set",
        slug: "premium-bedsheet-set",
        description: "Luxurious cotton bedsheet set with matching pillowcases. Ultra-soft and durable for perfect sleep.",
        brand: "Hednor Home",
        categoryId: homeCategory._id,
        price: 2999,
        salePrice: 2299,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"],
        sizes: ["Single", "Double", "Queen", "King"],
        colors: ["Pure White", "Sky Blue", "Mint Green", "Rose Gold"],
        inStock: true,
        stockQuantity: 80,
        rating: 4.4,
        reviewCount: 1234,
        tags: ["home", "bedding", "premium", "comfortable"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Decorative Cushion Set",
        slug: "decorative-cushion-set",
        description: "Set of 4 decorative cushions with beautiful patterns. Perfect for adding style to your living room.",
        brand: "Hednor Home",
        categoryId: homeCategory._id,
        price: 1999,
        salePrice: 1499,
        images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400"],
        sizes: ["16x16 inches"],
        colors: ["Geometric Blue", "Floral Pink", "Abstract Gold", "Solid Grey"],
        inStock: true,
        stockQuantity: 90,
        rating: 4.3,
        reviewCount: 567,
        tags: ["home", "decor", "cushions", "stylish"],
        isFeatured: false,
        isOnSale: true
      },

      // Beauty Products
      {
        name: "Skincare Gift Set",
        slug: "skincare-gift-set",
        description: "Complete skincare routine set with cleanser, toner, serum, and moisturizer. Perfect for all skin types.",
        brand: "Hednor Beauty",
        categoryId: beautyCategory?._id || homeCategory._id,
        price: 2499,
        salePrice: 1999,
        images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"],
        sizes: ["Full Size Set"],
        colors: ["Natural"],
        inStock: true,
        stockQuantity: 70,
        rating: 4.6,
        reviewCount: 890,
        tags: ["beauty", "skincare", "gift", "premium"],
        isFeatured: true,
        isOnSale: true
      },

      // GenZ Collection
      {
        name: "Trendy Oversized Hoodie",
        slug: "trendy-oversized-hoodie",
        description: "Super comfy oversized hoodie with cool graphics. Perfect for the trendy GenZ vibe.",
        brand: "Hednor GenZ",
        categoryId: genzCategory?._id || menCategory._id,
        price: 1799,
        salePrice: 1399,
        images: ["https://images.unsplash.com/photo-1556821840-3a9fbc86b9b3?w=400"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Grey", "Navy", "Burgundy"],
        inStock: true,
        stockQuantity: 125,
        rating: 4.8,
        reviewCount: 1567,
        tags: ["genz", "trendy", "oversized", "hoodie", "comfortable"],
        isFeatured: true,
        isOnSale: true
      }
    ];

    for (const product of sampleProducts) {
      await productService.createProduct(product);
    }

    console.log('Products seeded successfully!');

    const allProducts = await productService.getProducts({});
    return allProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}
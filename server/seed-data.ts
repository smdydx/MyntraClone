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
      image: "https://media.istockphoto.com/id/915320148/photo/elegant-young-woman-is-looking-away-smiling-and-thinking.jpg?s=612x612&w=0&k=20&c=n2FD9mwA7bIU2ys8M3XM2L9Y_wlmVVOFcRtdF9RkUJc=",
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

    // 10 Real Product Implementations
    const sampleProducts = [
      // 1. Men's Premium Cotton T-Shirt
      {
        name: "Premium Cotton Crew Neck T-Shirt",
        slug: "premium-cotton-crew-neck-tshirt",
        description: "100% organic cotton crew neck t-shirt with reinforced seams and pre-shrunk fabric. Soft, breathable, and perfect for daily wear. Available in classic colors.",
        brand: "Hednor Essentials",
        categoryId: menCategory._id,
        price: 1299,
        salePrice: 999,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          "https://images.unsplash.com/photo-1583743814966-8936f37f236f?w=400"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy Blue", "Black", "White", "Grey", "Olive Green"],
        inStock: true,
        stockQuantity: 125,
        rating: 4.6,
        reviewCount: 1847,
        tags: ["cotton", "casual", "comfortable", "organic"],
        isFeatured: true,
        isOnSale: true
      },

      // 2. Women's Floral Midi Dress
      {
        name: "Floral Print Midi Dress",
        slug: "floral-print-midi-dress",
        description: "Elegant floral midi dress with 3/4 sleeves and a flattering A-line silhouette. Made from lightweight chiffon fabric, perfect for spring and summer occasions.",
        brand: "Hednor Femme",
        categoryId: womenCategory._id,
        price: 2799,
        salePrice: 2199,
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop"
        ],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Blue Floral", "Pink Floral", "Yellow Floral", "White Floral"],
        inStock: true,
        stockQuantity: 78,
        rating: 4.8,
        reviewCount: 1256,
        tags: ["floral", "midi", "elegant", "summer"],
        isFeatured: true,
        isOnSale: true
      },

      // 3. Men's Slim Fit Jeans
      {
        name: "Slim Fit Dark Wash Jeans",
        slug: "slim-fit-dark-wash-jeans",
        description: "Classic slim fit jeans in dark indigo wash. Made from premium denim with 2% elastane for comfort and flexibility. Five-pocket styling with contrast stitching.",
        brand: "Hednor Denim Co.",
        categoryId: menCategory._id,
        price: 3499,
        salePrice: 2799,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"
        ],
        sizes: ["28", "30", "32", "34", "36", "38", "40"],
        colors: ["Dark Indigo", "Stone Wash", "Black", "Light Blue"],
        inStock: true,
        stockQuantity: 89,
        rating: 4.5,
        reviewCount: 2103,
        tags: ["denim", "slim-fit", "casual", "classic"],
        isFeatured: true,
        isOnSale: true
      },

      // 4. Women's Leather Handbag
      {
        name: "Genuine Leather Tote Bag",
        slug: "genuine-leather-tote-bag",
        description: "Spacious genuine leather tote bag with interior pockets and magnetic closure. Perfect for work or casual outings. Includes adjustable shoulder strap.",
        brand: "Hednor Luxury",
        categoryId: womenCategory._id,
        price: 6999,
        salePrice: 5499,
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
        ],
        sizes: ["One Size"],
        colors: ["Cognac Brown", "Black", "Navy Blue", "Burgundy"],
        inStock: true,
        stockQuantity: 34,
        rating: 4.9,
        reviewCount: 789,
        tags: ["leather", "tote", "luxury", "handbag"],
        isFeatured: true,
        isOnSale: true
      },

      // 5. Unisex Running Shoes
      {
        name: "Performance Running Shoes",
        slug: "performance-running-shoes",
        description: "High-performance running shoes with advanced cushioning technology and breathable mesh upper. Lightweight design with superior grip and support for all terrains.",
        brand: "Hednor Athletic",
        categoryId: menCategory._id,
        price: 4999,
        salePrice: 3999,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400"
        ],
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        colors: ["Black/White", "Navy/Orange", "Grey/Lime", "All Black"],
        inStock: true,
        stockQuantity: 67,
        rating: 4.7,
        reviewCount: 1534,
        tags: ["running", "athletic", "performance", "comfortable"],
        isFeatured: true,
        isOnSale: true
      },

      // 6. Kids' Cotton Shirt Set
      {
        name: "Kids Cotton Shirt and Shorts Set",
        slug: "kids-cotton-shirt-shorts-set",
        description: "Comfortable cotton shirt and shorts set for active kids. Features fun prints and colors. Machine washable and durable for everyday play.",
        brand: "Hednor Kids",
        categoryId: kidsCategory._id,
        price: 1299,
        salePrice: 999,
        images: [
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400"
        ],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
        colors: ["Blue Dinosaur", "Red Superhero", "Green Safari", "Pink Unicorn"],
        inStock: true,
        stockQuantity: 94,
        rating: 4.4,
        reviewCount: 567,
        tags: ["kids", "cotton", "comfortable", "playful"],
        isFeatured: true,
        isOnSale: true
      },

      // 7. Home Decor - Throw Pillows
      {
        name: "Decorative Throw Pillow Set",
        slug: "decorative-throw-pillow-set",
        description: "Set of 2 premium throw pillows with removable covers. Made from soft velvet fabric with hidden zipper closure. Perfect for sofas, beds, and chairs.",
        brand: "Hednor Home",
        categoryId: homeCategory._id,
        price: 1799,
        salePrice: 1399,
        images: [
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
        ],
        sizes: ["18x18 inches", "20x20 inches"],
        colors: ["Emerald Green", "Navy Blue", "Mustard Yellow", "Blush Pink"],
        inStock: true,
        stockQuantity: 76,
        rating: 4.3,
        reviewCount: 432,
        tags: ["home", "decor", "pillows", "velvet"],
        isFeatured: false,
        isOnSale: true
      },

      // 8. Women's Casual Sneakers
      {
        name: "Canvas Low-Top Sneakers",
        slug: "canvas-low-top-sneakers",
        description: "Classic canvas sneakers with rubber sole and cotton laces. Versatile design perfect for casual wear. Comfortable padding and durable construction.",
        brand: "Hednor Casual",
        categoryId: womenCategory._id,
        price: 2499,
        salePrice: 1999,
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600&h=800&fit=crop"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["White", "Black", "Pink", "Navy Blue", "Red"],
        inStock: true,
        stockQuantity: 112,
        rating: 4.5,
        reviewCount: 1289,
        tags: ["sneakers", "canvas", "casual", "comfortable"],
        isFeatured: true,
        isOnSale: true
      },

      // 9. Men's Formal Dress Shirt
      {
        name: "Classic Formal Dress Shirt",
        slug: "classic-formal-dress-shirt",
        description: "Premium cotton dress shirt with spread collar and French cuffs. Perfect for business meetings and formal events. Easy care, wrinkle-resistant fabric.",
        brand: "Hednor Formal",
        categoryId: menCategory._id,
        price: 2299,
        salePrice: 1799,
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400",
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400"
        ],
        sizes: ["14.5", "15", "15.5", "16", "16.5", "17", "17.5"],
        colors: ["White", "Light Blue", "Light Pink", "Lavender"],
        inStock: true,
        stockQuantity: 58,
        rating: 4.6,
        reviewCount: 945,
        tags: ["formal", "dress-shirt", "business", "premium"],
        isFeatured: true,
        isOnSale: true
      },

      // 10. Beauty - Skincare Set
      {
        name: "Complete Skincare Routine Set",
        slug: "complete-skincare-routine-set",
        description: "5-step skincare routine including cleanser, toner, serum, moisturizer, and sunscreen. Suitable for all skin types. Dermatologist tested and cruelty-free.",
        brand: "Hednor Beauty",
        categoryId: beautyCategory?._id || homeCategory._id,
        price: 3499,
        salePrice: 2799,
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
          "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400"
        ],
        sizes: ["Full Size Set", "Travel Size Set"],
        colors: ["Natural"],
        inStock: true,
        stockQuantity: 43,
        rating: 4.8,
        reviewCount: 1167,
        tags: ["skincare", "beauty", "routine", "dermatologist-tested"],
        isFeatured: true,
        isOnSale: true
      },

      // Additional Men's Products
      // 11. Men's Polo Shirt
      {
        name: "Classic Polo Shirt",
        slug: "classic-polo-shirt",
        description: "Timeless polo shirt made from premium pique cotton. Features ribbed collar and cuffs with three-button placket. Perfect for casual and smart-casual occasions.",
        brand: "Hednor Polo",
        categoryId: menCategory._id,
        price: 1799,
        salePrice: 1399,
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy Blue", "White", "Maroon", "Forest Green", "Black"],
        inStock: true,
        stockQuantity: 95,
        rating: 4.4,
        reviewCount: 876,
        tags: ["polo", "casual", "cotton", "classic"],
        isFeatured: true,
        isOnSale: true
      },

      // 12. Men's Hoodie
      {
        name: "Premium Cotton Hoodie",
        slug: "premium-cotton-hoodie",
        description: "Comfortable fleece-lined hoodie with adjustable drawstring hood and kangaroo pocket. Made from 80% cotton and 20% polyester blend for warmth and comfort.",
        brand: "Hednor Comfort",
        categoryId: menCategory._id,
        price: 2799,
        salePrice: 2199,
        images: [
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
          "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=400"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Charcoal Grey", "Navy Blue", "Black", "Olive Green"],
        inStock: true,
        stockQuantity: 67,
        rating: 4.7,
        reviewCount: 1234,
        tags: ["hoodie", "comfortable", "casual", "winter"],
        isFeatured: true,
        isOnSale: true
      },

      // 13. Men's Chinos
      {
        name: "Slim Fit Chino Pants",
        slug: "slim-fit-chino-pants",
        description: "Versatile chino pants in slim fit with stretch cotton fabric. Perfect for both casual and semi-formal occasions. Features classic five-pocket styling.",
        brand: "Hednor Classics",
        categoryId: menCategory._id,
        price: 2299,
        salePrice: 1799,
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400",
          "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400"
        ],
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Khaki", "Navy Blue", "Charcoal", "Olive Green", "Stone"],
        inStock: true,
        stockQuantity: 78,
        rating: 4.5,
        reviewCount: 1567,
        tags: ["chinos", "slim-fit", "versatile", "smart-casual"],
        isFeatured: true,
        isOnSale: true
      },

      // 14. Men's Jacket
      {
        name: "Bomber Jacket",
        slug: "bomber-jacket",
        description: "Classic bomber jacket with ribbed collar, cuffs, and hem. Made from premium polyester with quilted lining. Perfect for layering in cool weather.",
        brand: "Hednor Outerwear",
        categoryId: menCategory._id,
        price: 4499,
        salePrice: 3599,
        images: [
          "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Navy Blue", "Olive Green", "Burgundy"],
        inStock: true,
        stockQuantity: 45,
        rating: 4.6,
        reviewCount: 987,
        tags: ["jacket", "bomber", "outerwear", "trendy"],
        isFeatured: true,
        isOnSale: true
      },

      // 15. Men's Watch
      {
        name: "Classic Analog Watch",
        slug: "classic-analog-watch",
        description: "Elegant analog watch with stainless steel case and leather strap. Water-resistant with date display. Perfect accessory for formal and casual wear.",
        brand: "Hednor Timepieces",
        categoryId: menCategory._id,
        price: 3999,
        salePrice: 3199,
        images: [
          "https://images.unsplash.com/photo-1524805444973-bf390e5d5dc8?w=400",
          "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400"
        ],
        sizes: ["One Size"],
        colors: ["Black Leather", "Brown Leather", "Silver Steel", "Gold Steel"],
        inStock: true,
        stockQuantity: 56,
        rating: 4.8,
        reviewCount: 654,
        tags: ["watch", "analog", "classic", "accessory"],
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
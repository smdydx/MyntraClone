
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

    // Men's Subcategories
    const menSubcategories = [
      { name: "Topwear", slug: "men-topwear", description: "Men's topwear collection", parentId: menCategory._id },
      { name: "T-Shirts", slug: "men-tshirts", description: "Men's T-shirts", parentId: menCategory._id },
      { name: "Casual Shirts", slug: "men-casual-shirts", description: "Men's casual shirts", parentId: menCategory._id },
      { name: "Formal Shirts", slug: "men-formal-shirts", description: "Men's formal shirts", parentId: menCategory._id },
      { name: "Sweatshirts", slug: "men-sweatshirts", description: "Men's sweatshirts", parentId: menCategory._id },
      { name: "Sweaters", slug: "men-sweaters", description: "Men's sweaters", parentId: menCategory._id },
      { name: "Jackets", slug: "men-jackets", description: "Men's jackets", parentId: menCategory._id },
      { name: "Blazers & Coats", slug: "men-blazers-coats", description: "Men's blazers and coats", parentId: menCategory._id },
      { name: "Suits", slug: "men-suits", description: "Men's suits", parentId: menCategory._id },
      { name: "Rain Jackets", slug: "men-rain-jackets", description: "Men's rain jackets", parentId: menCategory._id },
      { name: "Indian & Festive Wear", slug: "men-indian-festive", description: "Men's Indian and festive wear", parentId: menCategory._id },
      { name: "Kurtas & Kurta Sets", slug: "men-kurtas", description: "Men's kurtas and kurta sets", parentId: menCategory._id },
      { name: "Sherwanis", slug: "men-sherwanis", description: "Men's sherwanis", parentId: menCategory._id },
      { name: "Nehru Jackets", slug: "men-nehru-jackets", description: "Men's Nehru jackets", parentId: menCategory._id },
      { name: "Dhotis", slug: "men-dhotis", description: "Men's dhotis", parentId: menCategory._id },
      { name: "Bottomwear", slug: "men-bottomwear", description: "Men's bottomwear", parentId: menCategory._id },
      { name: "Jeans", slug: "men-jeans", description: "Men's jeans", parentId: menCategory._id },
      { name: "Casual Trousers", slug: "men-casual-trousers", description: "Men's casual trousers", parentId: menCategory._id },
      { name: "Formal Trousers", slug: "men-formal-trousers", description: "Men's formal trousers", parentId: menCategory._id },
      { name: "Shorts", slug: "men-shorts", description: "Men's shorts", parentId: menCategory._id },
      { name: "Track Pants & Joggers", slug: "men-track-pants", description: "Men's track pants and joggers", parentId: menCategory._id },
      { name: "Innerwear & Sleepwear", slug: "men-innerwear", description: "Men's innerwear and sleepwear", parentId: menCategory._id },
      { name: "Briefs & Trunks", slug: "men-briefs-trunks", description: "Men's briefs and trunks", parentId: menCategory._id },
      { name: "Boxers", slug: "men-boxers", description: "Men's boxers", parentId: menCategory._id },
      { name: "Vests", slug: "men-vests", description: "Men's vests", parentId: menCategory._id },
      { name: "Sleepwear & Loungewear", slug: "men-sleepwear", description: "Men's sleepwear and loungewear", parentId: menCategory._id },
      { name: "Thermals", slug: "men-thermals", description: "Men's thermals", parentId: menCategory._id },
      { name: "Plus Size", slug: "men-plus-size", description: "Men's plus size clothing", parentId: menCategory._id },
      { name: "Footwear", slug: "men-footwear", description: "Men's footwear", parentId: menCategory._id },
      { name: "Casual Shoes", slug: "men-casual-shoes", description: "Men's casual shoes", parentId: menCategory._id },
      { name: "Sports Shoes", slug: "men-sports-shoes", description: "Men's sports shoes", parentId: menCategory._id },
      { name: "Formal Shoes", slug: "men-formal-shoes", description: "Men's formal shoes", parentId: menCategory._id },
      { name: "Sneakers", slug: "men-sneakers", description: "Men's sneakers", parentId: menCategory._id },
      { name: "Sandals & Floaters", slug: "men-sandals-floaters", description: "Men's sandals and floaters", parentId: menCategory._id },
      { name: "Flip Flops", slug: "men-flip-flops", description: "Men's flip flops", parentId: menCategory._id },
      { name: "Socks", slug: "men-socks", description: "Men's socks", parentId: menCategory._id },
      { name: "Personal Care & Grooming", slug: "men-personal-care", description: "Men's personal care and grooming", parentId: menCategory._id },
      { name: "Sunglasses & Frames", slug: "men-sunglasses", description: "Men's sunglasses and frames", parentId: menCategory._id },
      { name: "Watches", slug: "men-watches", description: "Men's watches", parentId: menCategory._id },
      { name: "Sports & Active Wear", slug: "men-sports-active", description: "Men's sports and active wear", parentId: menCategory._id },
      { name: "Sports Shoes", slug: "men-sports-shoes-active", description: "Men's sports shoes", parentId: menCategory._id },
      { name: "Sports Sandals", slug: "men-sports-sandals", description: "Men's sports sandals", parentId: menCategory._id },
      { name: "Active T-Shirts", slug: "men-active-tshirts", description: "Men's active T-shirts", parentId: menCategory._id },
      { name: "Track Pants & Shorts", slug: "men-track-pants-shorts", description: "Men's track pants and shorts", parentId: menCategory._id },
      { name: "Tracksuits", slug: "men-tracksuits", description: "Men's tracksuits", parentId: menCategory._id },
      { name: "Jackets & Sweatshirts", slug: "men-jackets-sweatshirts", description: "Men's jackets and sweatshirts", parentId: menCategory._id },
      { name: "Sports Accessories", slug: "men-sports-accessories", description: "Men's sports accessories", parentId: menCategory._id },
      { name: "Swimwear", slug: "men-swimwear", description: "Men's swimwear", parentId: menCategory._id },
      { name: "Gadgets", slug: "men-gadgets", description: "Men's gadgets", parentId: menCategory._id },
      { name: "Smart Wearables", slug: "men-smart-wearables", description: "Men's smart wearables", parentId: menCategory._id },
      { name: "Fitness Gadgets", slug: "men-fitness-gadgets", description: "Men's fitness gadgets", parentId: menCategory._id },
      { name: "Headphones", slug: "men-headphones", description: "Men's headphones", parentId: menCategory._id },
      { name: "Speakers", slug: "men-speakers", description: "Men's speakers", parentId: menCategory._id },
      { name: "Fashion & Accessories", slug: "men-fashion-accessories", description: "Men's fashion and accessories", parentId: menCategory._id },
      { name: "Wallets", slug: "men-wallets", description: "Men's wallets", parentId: menCategory._id },
      { name: "Belts", slug: "men-belts", description: "Men's belts", parentId: menCategory._id },
      { name: "Perfumes & Body Mists", slug: "men-perfumes", description: "Men's perfumes and body mists", parentId: menCategory._id },
      { name: "Trimmers", slug: "men-trimmers", description: "Men's trimmers", parentId: menCategory._id },
      { name: "Deodorants", slug: "men-deodorants", description: "Men's deodorants", parentId: menCategory._id }
    ];

    // Women's Subcategories
    const womenSubcategories = [
      { name: "Indian & Fusion Wear", slug: "women-indian-fusion", description: "Women's Indian and fusion wear", parentId: womenCategory._id },
      { name: "Kurtas & Suits", slug: "women-kurtas-suits", description: "Women's kurtas and suits", parentId: womenCategory._id },
      { name: "Kurtis, Tunics & Tops", slug: "women-kurtis-tunics", description: "Women's kurtis, tunics and tops", parentId: womenCategory._id },
      { name: "Sarees", slug: "women-sarees", description: "Women's sarees", parentId: womenCategory._id },
      { name: "Ethnic Wear", slug: "women-ethnic", description: "Women's ethnic wear", parentId: womenCategory._id },
      { name: "Leggings, Salwars & Churidars", slug: "women-leggings-salwars", description: "Women's leggings, salwars and churidars", parentId: womenCategory._id },
      { name: "Skirts & Palazzos", slug: "women-skirts-palazzos", description: "Women's skirts and palazzos", parentId: womenCategory._id },
      { name: "Dress Materials", slug: "women-dress-materials", description: "Women's dress materials", parentId: womenCategory._id },
      { name: "Lehenga Cholis", slug: "women-lehenga-cholis", description: "Women's lehenga cholis", parentId: womenCategory._id },
      { name: "Dupattas & Shawls", slug: "women-dupattas-shawls", description: "Women's dupattas and shawls", parentId: womenCategory._id },
      { name: "Jackets", slug: "women-jackets", description: "Women's jackets", parentId: womenCategory._id },
      { name: "Western Wear", slug: "women-western", description: "Women's western wear", parentId: womenCategory._id },
      { name: "Dresses", slug: "women-dresses", description: "Women's dresses", parentId: womenCategory._id },
      { name: "Tops", slug: "women-tops", description: "Women's tops", parentId: womenCategory._id },
      { name: "Tshirts", slug: "women-tshirts", description: "Women's T-shirts", parentId: womenCategory._id },
      { name: "Jeans", slug: "women-jeans", description: "Women's jeans", parentId: womenCategory._id },
      { name: "Trousers & Capris", slug: "women-trousers-capris", description: "Women's trousers and capris", parentId: womenCategory._id },
      { name: "Shorts & Skirts", slug: "women-shorts-skirts", description: "Women's shorts and skirts", parentId: womenCategory._id },
      { name: "Co-ords", slug: "women-coords", description: "Women's co-ords", parentId: womenCategory._id },
      { name: "Playsuits", slug: "women-playsuits", description: "Women's playsuits", parentId: womenCategory._id },
      { name: "Jumpsuits", slug: "women-jumpsuits", description: "Women's jumpsuits", parentId: womenCategory._id },
      { name: "Shrugs", slug: "women-shrugs", description: "Women's shrugs", parentId: womenCategory._id },
      { name: "Sweaters & Sweatshirts", slug: "women-sweaters-sweatshirts", description: "Women's sweaters and sweatshirts", parentId: womenCategory._id },
      { name: "Jackets & Coats", slug: "women-jackets-coats", description: "Women's jackets and coats", parentId: womenCategory._id },
      { name: "Blazers & Waistcoats", slug: "women-blazers-waistcoats", description: "Women's blazers and waistcoats", parentId: womenCategory._id },
      { name: "Plus Size", slug: "women-plus-size", description: "Women's plus size clothing", parentId: womenCategory._id },
      { name: "Maternity", slug: "women-maternity", description: "Women's maternity wear", parentId: womenCategory._id },
      { name: "Sunglasses & Frames", slug: "women-sunglasses", description: "Women's sunglasses and frames", parentId: womenCategory._id },
      { name: "Watches", slug: "women-watches", description: "Women's watches", parentId: womenCategory._id },
      { name: "Sports & Active Wear", slug: "women-sports-active", description: "Women's sports and active wear", parentId: womenCategory._id },
      { name: "Clothing", slug: "women-sports-clothing", description: "Women's sports clothing", parentId: womenCategory._id },
      { name: "Footwear", slug: "women-sports-footwear", description: "Women's sports footwear", parentId: womenCategory._id },
      { name: "Sports Accessories", slug: "women-sports-accessories", description: "Women's sports accessories", parentId: womenCategory._id },
      { name: "Sports Equipment", slug: "women-sports-equipment", description: "Women's sports equipment", parentId: womenCategory._id },
      { name: "Lingerie & Sleepwear", slug: "women-lingerie-sleepwear", description: "Women's lingerie and sleepwear", parentId: womenCategory._id },
      { name: "Bra", slug: "women-bra", description: "Women's bras", parentId: womenCategory._id },
      { name: "Briefs", slug: "women-briefs", description: "Women's briefs", parentId: womenCategory._id },
      { name: "Shapewear", slug: "women-shapewear", description: "Women's shapewear", parentId: womenCategory._id },
      { name: "Sleepwear & Loungewear", slug: "women-sleepwear-loungewear", description: "Women's sleepwear and loungewear", parentId: womenCategory._id },
      { name: "Swimwear", slug: "women-swimwear", description: "Women's swimwear", parentId: womenCategory._id },
      { name: "Camisoles", slug: "women-camisoles", description: "Women's camisoles", parentId: womenCategory._id },
      { name: "Beauty & Personal Care", slug: "women-beauty-personal-care", description: "Women's beauty and personal care", parentId: womenCategory._id },
      { name: "Makeup", slug: "women-makeup", description: "Women's makeup", parentId: womenCategory._id },
      { name: "Skincare", slug: "women-skincare", description: "Women's skincare", parentId: womenCategory._id },
      { name: "Premium Beauty", slug: "women-premium-beauty", description: "Women's premium beauty", parentId: womenCategory._id },
      { name: "Lipsticks", slug: "women-lipsticks", description: "Women's lipsticks", parentId: womenCategory._id },
      { name: "Fragrances", slug: "women-fragrances", description: "Women's fragrances", parentId: womenCategory._id },
      { name: "Gadgets", slug: "women-gadgets", description: "Women's gadgets", parentId: womenCategory._id },
      { name: "Smart Wearables", slug: "women-smart-wearables", description: "Women's smart wearables", parentId: womenCategory._id },
      { name: "Fitness Gadgets", slug: "women-fitness-gadgets", description: "Women's fitness gadgets", parentId: womenCategory._id },
      { name: "Headphones", slug: "women-headphones", description: "Women's headphones", parentId: womenCategory._id },
      { name: "Speakers", slug: "women-speakers", description: "Women's speakers", parentId: womenCategory._id },
      { name: "Jewellery", slug: "women-jewellery", description: "Women's jewellery", parentId: womenCategory._id },
      { name: "Fashion Jewellery", slug: "women-fashion-jewellery", description: "Women's fashion jewellery", parentId: womenCategory._id },
      { name: "Fine Jewellery", slug: "women-fine-jewellery", description: "Women's fine jewellery", parentId: womenCategory._id },
      { name: "Earrings", slug: "women-earrings", description: "Women's earrings", parentId: womenCategory._id },
      { name: "Backpacks", slug: "women-backpacks", description: "Women's backpacks", parentId: womenCategory._id },
      { name: "Handbags", slug: "women-handbags", description: "Women's handbags", parentId: womenCategory._id },
      { name: "Wallets", slug: "women-wallets", description: "Women's wallets", parentId: womenCategory._id },
      { name: "Belts", slug: "women-belts", description: "Women's belts", parentId: womenCategory._id },
      { name: "Casual Shoes", slug: "women-casual-shoes", description: "Women's casual shoes", parentId: womenCategory._id },
      { name: "Heels", slug: "women-heels", description: "Women's heels", parentId: womenCategory._id },
      { name: "Boots", slug: "women-boots", description: "Women's boots", parentId: womenCategory._id },
      { name: "Sports Shoes", slug: "women-sports-shoes", description: "Women's sports shoes", parentId: womenCategory._id },
      { name: "Flats", slug: "women-flats", description: "Women's flats", parentId: womenCategory._id },
      { name: "Flip Flops", slug: "women-flip-flops", description: "Women's flip flops", parentId: womenCategory._id },
      { name: "Socks", slug: "women-socks", description: "Women's socks", parentId: womenCategory._id }
    ];

    // Kids Subcategories
    const kidsSubcategories = [
      { name: "Boys Clothing", slug: "kids-boys-clothing", description: "Boys clothing", parentId: kidsCategory._id },
      { name: "T-Shirts", slug: "kids-boys-tshirts", description: "Boys T-shirts", parentId: kidsCategory._id },
      { name: "Shirts", slug: "kids-boys-shirts", description: "Boys shirts", parentId: kidsCategory._id },
      { name: "Shorts", slug: "kids-boys-shorts", description: "Boys shorts", parentId: kidsCategory._id },
      { name: "Jeans", slug: "kids-boys-jeans", description: "Boys jeans", parentId: kidsCategory._id },
      { name: "Polos", slug: "kids-boys-polos", description: "Boys polos", parentId: kidsCategory._id },
      { name: "Trousers", slug: "kids-boys-trousers", description: "Boys trousers", parentId: kidsCategory._id },
      { name: "Ethnic Wear", slug: "kids-boys-ethnic", description: "Boys ethnic wear", parentId: kidsCategory._id },
      { name: "Thermals", slug: "kids-boys-thermals", description: "Boys thermals", parentId: kidsCategory._id },
      { name: "Girls Clothing", slug: "kids-girls-clothing", description: "Girls clothing", parentId: kidsCategory._id },
      { name: "Dresses", slug: "kids-girls-dresses", description: "Girls dresses", parentId: kidsCategory._id },
      { name: "Tops", slug: "kids-girls-tops", description: "Girls tops", parentId: kidsCategory._id },
      { name: "T-Shirts", slug: "kids-girls-tshirts", description: "Girls T-shirts", parentId: kidsCategory._id },
      { name: "Clothing Sets", slug: "kids-girls-clothing-sets", description: "Girls clothing sets", parentId: kidsCategory._id },
      { name: "Lehenga choli", slug: "kids-girls-lehenga-choli", description: "Girls lehenga choli", parentId: kidsCategory._id },
      { name: "Kurta Sets", slug: "kids-girls-kurta-sets", description: "Girls kurta sets", parentId: kidsCategory._id },
      { name: "Party wear", slug: "kids-girls-party-wear", description: "Girls party wear", parentId: kidsCategory._id },
      { name: "Dungarees & Jumpsuits", slug: "kids-girls-dungarees-jumpsuits", description: "Girls dungarees and jumpsuits", parentId: kidsCategory._id },
      { name: "Skirts & shorts", slug: "kids-girls-skirts-shorts", description: "Girls skirts and shorts", parentId: kidsCategory._id },
      { name: "Tights & Leggings", slug: "kids-girls-tights-leggings", description: "Girls tights and leggings", parentId: kidsCategory._id },
      { name: "Jeans, Trousers & Capris", slug: "kids-girls-jeans-trousers-capris", description: "Girls jeans, trousers and capris", parentId: kidsCategory._id },
      { name: "Innerwear & Thermals", slug: "kids-girls-innerwear-thermals", description: "Girls innerwear and thermals", parentId: kidsCategory._id },
      { name: "Nightwear & Loungewear", slug: "kids-girls-nightwear-loungewear", description: "Girls nightwear and loungewear", parentId: kidsCategory._id },
      { name: "Sweaters", slug: "kids-girls-sweaters", description: "Girls sweaters", parentId: kidsCategory._id },
      { name: "Jackets & Coats", slug: "kids-girls-jackets-coats", description: "Girls jackets and coats", parentId: kidsCategory._id },
      { name: "Brand Store", slug: "kids-brand-store", description: "Kids brand store", parentId: kidsCategory._id },
      { name: "Character Store", slug: "kids-character-store", description: "Kids character store", parentId: kidsCategory._id },
      { name: "Footwear", slug: "kids-footwear", description: "Kids footwear", parentId: kidsCategory._id },
      { name: "Casual Shoes", slug: "kids-casual-shoes", description: "Kids casual shoes", parentId: kidsCategory._id },
      { name: "Flipflops", slug: "kids-flipflops", description: "Kids flipflops", parentId: kidsCategory._id },
      { name: "Sports Shoes", slug: "kids-sports-shoes", description: "Kids sports shoes", parentId: kidsCategory._id },
      { name: "Flats", slug: "kids-flats", description: "Kids flats", parentId: kidsCategory._id },
      { name: "Sandals", slug: "kids-sandals", description: "Kids sandals", parentId: kidsCategory._id },
      { name: "Heels", slug: "kids-heels", description: "Kids heels", parentId: kidsCategory._id },
      { name: "School Shoes", slug: "kids-school-shoes", description: "Kids school shoes", parentId: kidsCategory._id },
      { name: "Socks", slug: "kids-socks", description: "Kids socks", parentId: kidsCategory._id },
      { name: "Toys & Games", slug: "kids-toys", description: "Kids toys and games", parentId: kidsCategory._id },
      { name: "Learning & Development", slug: "kids-learning-toys", description: "Kids learning and development toys", parentId: kidsCategory._id },
      { name: "Activity Toys", slug: "kids-activity-toys", description: "Kids activity toys", parentId: kidsCategory._id },
      { name: "Soft Toys", slug: "kids-soft-toys", description: "Kids soft toys", parentId: kidsCategory._id },
      { name: "Action Figure / Play set", slug: "kids-action-figures", description: "Kids action figures and play sets", parentId: kidsCategory._id },
      { name: "Infants", slug: "kids-infants", description: "Infant products", parentId: kidsCategory._id },
      { name: "Bodysuits", slug: "kids-bodysuits", description: "Infant bodysuits", parentId: kidsCategory._id },
      { name: "Rompers & Sleepsuits", slug: "kids-rompers", description: "Infant rompers and sleepsuits", parentId: kidsCategory._id },
      { name: "Kids Accessories", slug: "kids-accessories", description: "Kids accessories", parentId: kidsCategory._id },
      { name: "Bags & Backpacks", slug: "kids-bags-backpacks", description: "Kids bags and backpacks", parentId: kidsCategory._id },
      { name: "Watches", slug: "kids-watches", description: "Kids watches", parentId: kidsCategory._id },
      { name: "Jewellery & Hair accessory", slug: "kids-jewellery-hair", description: "Kids jewellery and hair accessories", parentId: kidsCategory._id },
      { name: "Sunglasses", slug: "kids-sunglasses", description: "Kids sunglasses", parentId: kidsCategory._id },
      { name: "Caps & Hats", slug: "kids-caps-hats", description: "Kids caps and hats", parentId: kidsCategory._id }
    ];

    // Home & Living Subcategories
    const homeSubcategories = [
      { name: "Bed Linen", slug: "home-bed-linen", description: "Bed linen and bedding", parentId: homeCategory._id },
      { name: "Bedsheets", slug: "home-bedsheets", description: "Bedsheets", parentId: homeCategory._id },
      { name: "Bedding Sets", slug: "home-bedding-sets", description: "Bedding sets", parentId: homeCategory._id },
      { name: "Blankets, Quilts & Dohars", slug: "home-blankets-quilts", description: "Blankets, quilts and dohars", parentId: homeCategory._id },
      { name: "Pillows & Pillow Covers", slug: "home-pillows-covers", description: "Pillows and pillow covers", parentId: homeCategory._id },
      { name: "Bed Covers", slug: "home-bed-covers", description: "Bed covers", parentId: homeCategory._id },
      { name: "Diwan Sets", slug: "home-diwan-sets", description: "Diwan sets", parentId: homeCategory._id },
      { name: "Chair Pads & Covers", slug: "home-chair-covers", description: "Chair pads and covers", parentId: homeCategory._id },
      { name: "Sofa Covers", slug: "home-sofa-covers", description: "Sofa covers", parentId: homeCategory._id },
      { name: "Flooring", slug: "home-flooring", description: "Flooring solutions", parentId: homeCategory._id },
      { name: "Floor Runners", slug: "home-floor-runners", description: "Floor runners", parentId: homeCategory._id },
      { name: "Carpets", slug: "home-carpets", description: "Carpets", parentId: homeCategory._id },
      { name: "Floor Mats & Dhurries", slug: "home-floor-mats", description: "Floor mats and dhurries", parentId: homeCategory._id },
      { name: "Door Mats", slug: "home-door-mats", description: "Door mats", parentId: homeCategory._id },
      { name: "Bath", slug: "home-bath", description: "Bath essentials", parentId: homeCategory._id },
      { name: "Bath Towels", slug: "home-bath-towels", description: "Bath towels", parentId: homeCategory._id },
      { name: "Hand & Face Towels", slug: "home-hand-towels", description: "Hand and face towels", parentId: homeCategory._id },
      { name: "Beach Towels", slug: "home-beach-towels", description: "Beach towels", parentId: homeCategory._id },
      { name: "Towels Set", slug: "home-towels-set", description: "Towel sets", parentId: homeCategory._id },
      { name: "Bath Rugs", slug: "home-bath-rugs", description: "Bath rugs", parentId: homeCategory._id },
      { name: "Bath Robes", slug: "home-bath-robes", description: "Bath robes", parentId: homeCategory._id },
      { name: "Bathroom Accessories", slug: "home-bathroom-accessories", description: "Bathroom accessories", parentId: homeCategory._id },
      { name: "Shower Curtains", slug: "home-shower-curtains", description: "Shower curtains", parentId: homeCategory._id },
      { name: "Lamps & Lighting", slug: "home-lamps-lighting", description: "Lamps and lighting", parentId: homeCategory._id },
      { name: "Home Décor", slug: "home-decor", description: "Home decoration items", parentId: homeCategory._id },
      { name: "Plants & Planters", slug: "home-plants", description: "Plants and planters", parentId: homeCategory._id },
      { name: "Aromas & Candles", slug: "home-candles", description: "Aromas and candles", parentId: homeCategory._id },
      { name: "Clocks", slug: "home-clocks", description: "Clocks", parentId: homeCategory._id },
      { name: "Mirrors", slug: "home-mirrors", description: "Mirrors", parentId: homeCategory._id },
      { name: "Wall Décor", slug: "home-wall-decor", description: "Wall decoration", parentId: homeCategory._id },
      { name: "Festive Decor", slug: "home-festive-decor", description: "Festive decoration", parentId: homeCategory._id },
      { name: "Pooja Essentials", slug: "home-pooja", description: "Pooja essentials", parentId: homeCategory._id },
      { name: "Wall Shelves", slug: "home-wall-shelves", description: "Wall shelves", parentId: homeCategory._id },
      { name: "Fountains", slug: "home-fountains", description: "Fountains", parentId: homeCategory._id },
      { name: "Showpieces & Vases", slug: "home-showpieces", description: "Showpieces and vases", parentId: homeCategory._id },
      { name: "Ottoman", slug: "home-ottoman", description: "Ottoman", parentId: homeCategory._id },
      { name: "Cushions & Cushion Covers", slug: "home-cushions", description: "Cushions and cushion covers", parentId: homeCategory._id },
      { name: "Curtains", slug: "home-curtains", description: "Curtains", parentId: homeCategory._id },
      { name: "Furniture", slug: "home-furniture", description: "Furniture", parentId: homeCategory._id },
      { name: "Home Gift Sets", slug: "home-gift-sets", description: "Home gift sets", parentId: homeCategory._id },
      { name: "Kitchen & Table", slug: "home-kitchen", description: "Kitchen and table essentials", parentId: homeCategory._id },
      { name: "Table Runners", slug: "home-table-runners", description: "Table runners", parentId: homeCategory._id },
      { name: "Dinnerware & Serveware", slug: "home-dinnerware", description: "Dinnerware and serveware", parentId: homeCategory._id },
      { name: "Cups and Mugs", slug: "home-cups-mugs", description: "Cups and mugs", parentId: homeCategory._id },
      { name: "Bakeware & Cookware", slug: "home-cookware", description: "Bakeware and cookware", parentId: homeCategory._id },
      { name: "Kitchen Storage & Tools", slug: "home-kitchen-storage", description: "Kitchen storage and tools", parentId: homeCategory._id },
      { name: "Bar & Drinkware", slug: "home-barware", description: "Bar and drinkware", parentId: homeCategory._id },
      { name: "Table Covers & Furnishings", slug: "home-table-covers", description: "Table covers and furnishings", parentId: homeCategory._id },
      { name: "Storage", slug: "home-storage", description: "Home storage solutions", parentId: homeCategory._id },
      { name: "Bins", slug: "home-bins", description: "Storage bins", parentId: homeCategory._id },
      { name: "Hangers", slug: "home-hangers", description: "Hangers", parentId: homeCategory._id },
      { name: "Organisers", slug: "home-organisers", description: "Organisers", parentId: homeCategory._id },
      { name: "Hooks & Holders", slug: "home-hooks", description: "Hooks and holders", parentId: homeCategory._id },
      { name: "Laundry Bags", slug: "home-laundry-bags", description: "Laundry bags", parentId: homeCategory._id }
    ];

    // Beauty Subcategories
    const beautySubcategories = [
      { name: "Makeup", slug: "beauty-makeup", description: "Makeup products", parentId: beautyCategory._id },
      { name: "Skincare", slug: "beauty-skincare", description: "Skincare products", parentId: beautyCategory._id },
      { name: "Premium Beauty", slug: "beauty-premium", description: "Premium beauty products", parentId: beautyCategory._id },
      { name: "Lipsticks", slug: "beauty-lipsticks", description: "Lipsticks", parentId: beautyCategory._id },
      { name: "Fragrances", slug: "beauty-fragrances", description: "Fragrances", parentId: beautyCategory._id },
      { name: "Hair Care", slug: "beauty-hair-care", description: "Hair care products", parentId: beautyCategory._id },
      { name: "Personal Care", slug: "beauty-personal-care", description: "Personal care products", parentId: beautyCategory._id }
    ];

    // GenZ Subcategories
    const genzSubcategories = [
      { name: "GenZ Fashion", slug: "genz-fashion", description: "GenZ fashion trends", parentId: genzCategory._id },
      { name: "Streetwear", slug: "genz-streetwear", description: "Streetwear collection", parentId: genzCategory._id },
      { name: "Sneakers", slug: "genz-sneakers", description: "Trendy sneakers", parentId: genzCategory._id },
      { name: "Accessories", slug: "genz-accessories", description: "GenZ accessories", parentId: genzCategory._id },
      { name: "Tech Gadgets", slug: "genz-tech", description: "Tech gadgets for GenZ", parentId: genzCategory._id }
    ];

    // Studio Subcategories
    const studioSubcategories = [
      { name: "Collections", slug: "studio-collections", description: "Designer collections", parentId: studioCategory._id },
      { name: "New Arrivals", slug: "studio-new", description: "New arrivals", parentId: studioCategory._id },
      { name: "Premium Collection", slug: "studio-premium", description: "Premium collection", parentId: studioCategory._id },
      { name: "Limited Edition", slug: "studio-limited", description: "Limited edition", parentId: studioCategory._id },
      { name: "Designer Wear", slug: "studio-designer", description: "Designer wear", parentId: studioCategory._id },
      { name: "Couture", slug: "studio-couture", description: "Couture collection", parentId: studioCategory._id },
      { name: "Ready to Wear", slug: "studio-ready-to-wear", description: "Ready to wear collection", parentId: studioCategory._id },
      { name: "Bridal Collection", slug: "studio-bridal", description: "Bridal collection", parentId: studioCategory._id },
      { name: "Accessories", slug: "studio-accessories", description: "Designer accessories", parentId: studioCategory._id },
      { name: "Handbags", slug: "studio-handbags", description: "Designer handbags", parentId: studioCategory._id },
      { name: "Jewelry", slug: "studio-jewelry", description: "Designer jewelry", parentId: studioCategory._id }
    ];

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

    if (!menCategory || !womenCategory || !kidsCategory) {
      throw new Error('Required categories not found. Please seed categories first.');
    }

    // Sample products
    const sampleProducts = [
      {
        name: "Classic Cotton T-Shirt",
        slug: "classic-cotton-tshirt",
        description: "Comfortable cotton t-shirt perfect for everyday wear",
        brand: "Hednor",
        categoryId: menCategory._id,
        price: 999,
        salePrice: 799,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray"],
        inStock: true,
        stockQuantity: 50,
        rating: 4.5,
        reviewCount: 25,
        tags: ["casual", "cotton", "comfortable"],
        isFeatured: true,
        isOnSale: true
      },
      {
        name: "Elegant Summer Dress",
        slug: "elegant-summer-dress",
        description: "Beautiful flowy dress perfect for summer occasions",
        brand: "Hednor",
        categoryId: womenCategory._id,
        price: 2499,
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "Pink", "White"],
        inStock: true,
        stockQuantity: 30,
        rating: 4.8,
        reviewCount: 42,
        tags: ["dress", "summer", "elegant"],
        isFeatured: true,
        isOnSale: false
      },
      {
        name: "Kids Cartoon T-Shirt",
        slug: "kids-cartoon-tshirt",
        description: "Fun cartoon print t-shirt for kids",
        brand: "Hednor Kids",
        categoryId: kidsCategory._id,
        price: 699,
        images: ["https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=500"],
        sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
        colors: ["Red", "Blue", "Yellow"],
        inStock: true,
        stockQuantity: 40,
        rating: 4.3,
        reviewCount: 18,
        tags: ["kids", "cartoon", "fun"],
        isFeatured: false,
        isOnSale: false
      }
    ];

    // Create products
    for (const productData of sampleProducts) {
      await productService.createProduct(productData);
    }

    console.log('Products seeded successfully!');
    
    const allProducts = await productService.getProducts({});
    return allProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  });

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
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: string;
  salePrice?: string;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface WishlistItem {
  id: number;
  productId: string;
  name: string;
  brand: string;
  price: string;
  salePrice?: string;
  image: string;
}

interface StoreState {
  // Cart state
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  
  // Wishlist state
  wishlistItems: WishlistItem[];
  
  // Cart actions
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Wishlist actions
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,
      isCartOpen: false,
      wishlistItems: [],
      
      // Cart actions
      addToCart: (item) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(
          (cartItem) => 
            cartItem.productId === item.productId &&
            cartItem.size === item.size &&
            cartItem.color === item.color
        );
        
        let newCartItems;
        if (existingItem) {
          newCartItems = cartItems.map((cartItem) =>
            cartItem.productId === item.productId &&
            cartItem.size === item.size &&
            cartItem.color === item.color
              ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) }
              : cartItem
          );
        } else {
          newCartItems = [...cartItems, { ...item, quantity: item.quantity || 1 }];
        }
        
        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
        const newCartTotal = newCartItems.reduce((total, item) => {
          const price = item.salePrice ? parseFloat(item.salePrice) : parseFloat(item.price);
          return total + (price * item.quantity);
        }, 0);
        
        set({
          cartItems: newCartItems,
          cartCount: newCartCount,
          cartTotal: newCartTotal,
        });
      },
      
      removeFromCart: (productId) => {
        const { cartItems } = get();
        const newCartItems = cartItems.filter((item) => item.productId !== productId);
        
        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
        const newCartTotal = newCartItems.reduce((total, item) => {
          const price = item.salePrice ? parseFloat(item.salePrice) : parseFloat(item.price);
          return total + (price * item.quantity);
        }, 0);
        
        set({
          cartItems: newCartItems,
          cartCount: newCartCount,
          cartTotal: newCartTotal,
        });
      },
      
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const { cartItems } = get();
        const newCartItems = cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        
        const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);
        const newCartTotal = newCartItems.reduce((total, item) => {
          const price = item.salePrice ? parseFloat(item.salePrice) : parseFloat(item.price);
          return total + (price * item.quantity);
        }, 0);
        
        set({
          cartItems: newCartItems,
          cartCount: newCartCount,
          cartTotal: newCartTotal,
        });
      },
      
      clearCart: () => {
        set({
          cartItems: [],
          cartCount: 0,
          cartTotal: 0,
        });
      },
      
      setCartOpen: (open) => {
        set({ isCartOpen: open });
      },
      
      // Wishlist actions
      addToWishlist: (item) => {
        const { wishlistItems } = get();
        const exists = wishlistItems.find((wishlistItem) => wishlistItem.productId === item.productId);
        
        if (!exists) {
          const newItem = {
            ...item,
            id: Date.now(), // Simple ID generation
          };
          set({
            wishlistItems: [...wishlistItems, newItem],
          });
        }
      },
      
      removeFromWishlist: (productId) => {
        const { wishlistItems } = get();
        const newWishlistItems = wishlistItems.filter((item) => item.productId !== productId);
        set({
          wishlistItems: newWishlistItems,
        });
      },
      
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.productId === productId);
      },
    }),
    {
      name: 'hednor-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartCount: state.cartCount,
        cartTotal: state.cartTotal,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
);

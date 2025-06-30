import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  brand: string;
  price: string;
  salePrice?: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  brand: string;
  price: string;
  salePrice?: string;
  image: string;
}

interface StoreState {
  // Cart
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cartItems: [],
      addToCart: (item) => 
    set((state) => {
      // Create unique key for cart item based on product, size, and color
      const itemKey = `${item.productId}-${item.size || 'no-size'}-${item.color || 'no-color'}`;

      const existingItem = state.cartItems.find(
        (cartItem) => {
          const cartItemKey = `${cartItem.productId}-${cartItem.size || 'no-size'}-${cartItem.color || 'no-color'}`;
          return cartItemKey === itemKey;
        }
      );

      if (existingItem) {
        return {
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === existingItem.id
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          ),
        };
      }

      // Generate unique ID based on timestamp and random number
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      return {
        cartItems: [...state.cartItems, { ...item, id: newId }],
      };
    }),
      removeFromCart: (id) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        }));
      },
      updateCartQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      get cartTotal() {
        return get().cartItems.reduce((total, item) => {
          const price = item.salePrice ? parseFloat(item.salePrice) : parseFloat(item.price);
          return total + price * item.quantity;
        }, 0);
      },
      get cartCount() {
        return get().cartItems.reduce((count, item) => count + item.quantity, 0);
      },

      // Wishlist
      wishlistItems: [],
      addToWishlist: (item) =>
    set((state) => {
      const existingItem = state.wishlistItems.find(
        (wishlistItem) => wishlistItem.productId === item.productId
      );

      if (existingItem) {
        return state; // Don't add duplicate
      }

      // Generate unique ID based on timestamp and random number
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      return {
        wishlistItems: [...state.wishlistItems, { ...item, id: newId }],
      };
    }),
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().wishlistItems.some((item) => item.productId === productId);
      },

      // UI State
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: 'hednor-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
);
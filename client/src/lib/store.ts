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
  cartCount: number;
  cartTotal: number;

  // Wishlist
  wishlistItems: WishlistItem[];
  wishlistCount: number;

  // Actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;

  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  get cartTotal(): number;
  get cartCount(): number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cartItems: [],
      cartCount: 0,
      cartTotal: 0,

      // Wishlist state
      wishlistItems: [],
      wishlistCount: 0,
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
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),
      updateCartItemQuantity: (id, quantity) => {
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
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlistItems: state.wishlistItems.filter(item => item.productId !== productId)
        })),
      clearWishlist: () => set({ wishlistItems: [] }),

      // UI State
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),

      // Computed properties
      get cartTotal() {
        return get().cartItems.reduce((total, item) => {
          const price = item.salePrice ? parseFloat(item.salePrice) : parseFloat(item.price);
          return total + (price * item.quantity);
        }, 0);
      },
      get cartCount() {
        return get().cartItems.reduce((count, item) => count + item.quantity, 0);
      },
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
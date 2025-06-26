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
  isMobileSearchOpen: boolean;
  setMobileSearchOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cartItems: [],
      addToCart: (item) => {
        const existingItem = get().cartItems.find(
          (cartItem) => 
            cartItem.productId === item.productId && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );

        if (existingItem) {
          set((state) => ({
            cartItems: state.cartItems.map((cartItem) =>
              cartItem.id === existingItem.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            ),
          }));
        } else {
          set((state) => ({
            cartItems: [...state.cartItems, { ...item, id: Date.now() }],
          }));
        }
      },
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
      addToWishlist: (item) => {
        const existingItem = get().wishlistItems.find(
          (wishlistItem) => wishlistItem.productId === item.productId
        );

        if (!existingItem) {
          set((state) => ({
            wishlistItems: [...state.wishlistItems, { ...item, id: Date.now() }],
          }));
        }
      },
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
      isMobileSearchOpen: false,
      setMobileSearchOpen: (open) => set({ isMobileSearchOpen: open }),
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

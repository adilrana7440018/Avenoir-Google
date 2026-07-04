import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // productId + variantId (or compatibility/color combo)
  productId: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  colorHex?: string;
  image: string;
  compatibility?: string;
}

export interface CouponInfo {
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}

interface StoreState {
  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  coupon: CouponInfo | null;
  
  // Actions
  setCartOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'quantity' | 'id'> & { id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: CouponInfo) => void;
  removeCoupon: () => void;

  // Wishlist State
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;

  // Search State
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      coupon: null,
      wishlist: [],
      isSearchOpen: false,

      setCartOpen: (open) => set({ isCartOpen: open }),
      
      addItem: (newItem) =>
        set((state) => {
          const itemKey = newItem.id || `${newItem.productId}-${newItem.color || 'default'}-${newItem.compatibility || 'default'}`;
          const existingItemIndex = state.cart.findIndex((item) => item.id === itemKey);

          if (existingItemIndex > -1) {
            const updatedCart = [...state.cart];
            updatedCart[existingItemIndex].quantity += 1;
            return { cart: updatedCart, isCartOpen: true };
          } else {
            return {
              cart: [
                ...state.cart,
                { ...newItem, id: itemKey, quantity: 1 },
              ],
              isCartOpen: true,
            };
          }
        }),

      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart
            .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
        })),

      clearCart: () => set({ cart: [], coupon: null }),
      
      applyCoupon: (coupon) => set({ coupon }),
      
      removeCoupon: () => set({ coupon: null }),

      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId],
          };
        }),

      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: 'avenoir-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        coupon: state.coupon,
      }),
    }
  )
);

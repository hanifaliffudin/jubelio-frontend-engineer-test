import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            // Update the quantity if exist
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );

            return {
              items: updatedItems,
              totalQuantity: state.totalQuantity + quantity,
              totalPrice: state.totalPrice + product.price * quantity,
            };
          } else {
            // add item to the cart
            const newItem: CartItem = {
              ...product,
              quantity,
            };

            return {
              items: [...state.items, newItem],
              totalQuantity: state.totalQuantity + quantity,
              totalPrice: state.totalPrice + product.price * quantity,
            };
          }
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

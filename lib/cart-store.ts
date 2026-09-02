"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  note?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: number, note?: string) => void
  updateQuantity: (id: number, quantity: number, note?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  setIsOpen: (open: boolean) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product) => {
        const items = get().items
        const existing = items.find((i) => i.id === product.id && i.note === product.note)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === product.id && i.note === product.note ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },
      removeItem: (id, note) => {
        set({
          items: get().items.filter((item) => !(item.id === id && item.note === note)),
        })
      },
      updateQuantity: (id, quantity, note) => {
        if (quantity <= 0) {
          get().removeItem(id, note)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.note === note ? { ...item, quantity } : item,
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      setIsOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "cart-storage",
    },
  ),
)
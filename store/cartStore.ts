'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variety: string) => void
  updateQuantity: (productId: string, variety: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  isCarton: () => boolean
  cartonProgress: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === newItem.productId && i.variety === newItem.variety
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId && i.variety === newItem.variety
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        }),

      removeItem: (productId, variety) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variety === variety)
          ),
        })),

      updateQuantity: (productId, variety, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && i.variety === variety)
                )
              : state.items.map((i) =>
                  i.productId === productId && i.variety === variety
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      isCarton: () => get().getTotalItems() >= 10,
      cartonProgress: () => get().getTotalItems() % 10,
    }),
    { name: 'bbk-cart' }
  )
)

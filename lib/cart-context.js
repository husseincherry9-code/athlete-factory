'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'af-cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  // تحميل السلة المحفوظة عند فتح الموقع
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  // حفظ السلة عند كل تغيير
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, loaded])

  const clamp = (qty, stock) => (stock > 0 ? Math.min(qty, stock) : qty)

  function addItem(item) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId)
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: clamp(i.quantity + item.quantity, item.stock) }
            : i
        )
      }
      return [...prev, { ...item, quantity: clamp(item.quantity, item.stock) }]
    })
  }

  function updateQuantity(variantId, quantity) {
    if (quantity < 1) return removeItem(variantId)
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity: clamp(quantity, i.stock) } : i))
    )
  }

  function removeItem(variantId) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId))
  }

  function clearCart() {
    setItems([])
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, loaded, count, subtotal, addItem, updateQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
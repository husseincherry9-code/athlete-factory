'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, loaded, count, subtotal, updateQuantity, removeItem, clearCart } = useCart()

  if (!loaded) {
    return <main className="mx-auto max-w-6xl px-4 py-20 text-center text-gray-400">Loading cart...</main>
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-light">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-12 w-12 text-black">
            <path d="M6 7h12l-1 13H7z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-black uppercase text-black">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Find the right supplements for your goals.</p>
        <Link
          href="/products"
          className="mt-8 rounded-lg bg-brand px-8 py-4 font-black uppercase text-black transition hover:bg-brand-dark"
        >
          Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-black uppercase text-black">
          Your Cart <span className="text-gray-300">({count})</span>
        </h1>
        <button onClick={clearCart} className="text-sm font-semibold text-gray-400 hover:text-red-600">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* المنتجات */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4">
              <Link
                href={`/products/${item.productId}`}
                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-50"
              >
                {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={`/products/${item.productId}`} className="font-bold text-black hover:underline">
                      {item.name}
                    </Link>
                    {item.option && <p className="text-sm text-gray-500">{item.option}</p>}
                    <p className="mt-1 text-sm text-gray-400">{formatPrice(item.price)} each</p>
                  </div>
                  <p className="shrink-0 text-lg font-black text-black">{formatPrice(item.price * item.quantity)}</p>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-lg border-2 border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-3 py-1 font-bold text-black"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      disabled={item.stock > 0 && item.quantity >= item.stock}
                      className="px-3 py-1 font-bold text-black disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-sm font-semibold text-gray-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* الملخص */}
        <aside className="h-fit rounded-2xl bg-black p-6 text-white lg:sticky lg:top-36">
          <h2 className="text-xl font-black uppercase">Order Summary</h2>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Items ({count})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between border-t border-white/10 pt-6 text-lg font-black">
            <span>Subtotal</span>
            <span className="text-brand">{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-lg bg-brand py-4 text-center font-black uppercase text-black transition hover:bg-brand-dark"
          >
            Proceed to Checkout
          </Link>
          <Link href="/products" className="mt-4 block text-center text-sm text-gray-400 hover:text-brand">
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </main>
  )
}
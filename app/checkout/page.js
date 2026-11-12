'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

const REGIONS = [
  'Beirut',
  'Mount Lebanon',
  'North Lebanon',
  'Akkar',
  'South Lebanon',
  'Nabatieh',
  'Bekaa',
  'Baalbek-Hermel',
]

const inputClass =
  'w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-black outline-none transition focus:border-brand'

export default function CheckoutPage() {
  const [supabase] = useState(() => createClient())
  const router = useRouter()
  const { items, loaded, count, subtotal, clearCart } = useCart()

  const [user, setUser] = useState(undefined) // undefined = جاري التحميل
  const [form, setForm] = useState({ fullName: '', phone: '', city: 'Beirut', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))
  }, [supabase])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { data: orderId, error } = await supabase.rpc('place_order', {
      p_full_name: form.fullName.trim(),
      p_phone: form.phone.trim(),
      p_city: form.city,
      p_address: form.address.trim(),
      p_notes: form.notes.trim() || null,
      p_items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
    })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    clearCart()
    router.push(`/orders?placed=${orderId}`)
  }

  // جاري التحميل
  if (!loaded || user === undefined) {
    return <main className="mx-auto max-w-6xl px-4 py-24 text-center text-gray-400">Loading...</main>
  }

  // يجب تسجيل الدخول
  if (!user) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="text-3xl font-black uppercase text-black">Login required</h1>
        <p className="mt-3 text-gray-500">Log in or create a free account to complete your order and track it.</p>
        <Link
          href="/login?next=/checkout"
          className="mt-8 rounded-lg bg-brand px-8 py-4 font-black uppercase text-black transition hover:bg-brand-dark"
        >
          Log in to continue
        </Link>
      </main>
    )
  }

  // السلة فارغة
  if (items.length === 0 && !submitting) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="text-3xl font-black uppercase text-black">Your cart is empty</h1>
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
      <h1 className="mb-8 text-4xl font-black uppercase text-black">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* معلومات التوصيل */}
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-black uppercase text-black">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm">1</span>
              Delivery Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Full name</label>
                <input required value={form.fullName} onChange={update('fullName')} className={inputClass} placeholder="Hussein ..." />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Phone number</label>
                <input
                  required
                  type="tel"
                  minLength={8}
                  value={form.phone}
                  onChange={update('phone')}
                  className={inputClass}
                  placeholder="+961 70 000 000"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Region</label>
                <select value={form.city} onChange={update('city')} className={inputClass}>
                  {REGIONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-gray-700">Address</label>
                <input
                  required
                  value={form.address}
                  onChange={update('address')}
                  className={inputClass}
                  placeholder="Area, street, building, floor"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-gray-700">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={update('notes')}
                  className={inputClass}
                  placeholder="Delivery instructions..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-black uppercase text-black">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm">2</span>
              Payment Method
            </h2>
            <label className="flex items-center gap-4 rounded-xl border-2 border-brand bg-brand-light p-4">
              <input type="radio" checked readOnly className="h-5 w-5 accent-black" />
              <div>
                <p className="font-black text-black">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when your order arrives</p>
              </div>
            </label>
          </div>
        </section>

        {/* ملخص الطلب */}
        <aside className="h-fit rounded-2xl bg-black p-6 text-white lg:sticky lg:top-36">
          <h2 className="text-xl font-black uppercase">Your Order</h2>

          <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 rounded-lg bg-white">
                  {item.image && <img src={item.image} alt="" className="h-full w-full object-contain p-1" />}
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black text-black">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{item.name}</p>
                  {item.option && <p className="truncate text-xs text-gray-400">{item.option}</p>}
                </div>
                <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal ({count} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Delivery</span>
              <span className="font-bold text-brand">FREE</span>
            </div>
          </div>

          <div className="mt-6 flex justify-between border-t border-white/10 pt-6 text-xl font-black">
            <span>Total</span>
            <span className="text-brand">{formatPrice(subtotal)}</span>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-brand py-4 font-black uppercase text-black transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? 'Placing order...' : 'Place Order'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">Prices and stock are verified when you place the order.</p>
        </aside>
      </form>
    </main>
  )
}
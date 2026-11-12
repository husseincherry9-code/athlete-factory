'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { formatPrice } from '@/lib/utils'

const STATUS_STYLES = {
  pending: 'bg-brand-light text-brand-deep',
  confirmed: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
}

const shortId = (id) => id.slice(0, 8).toUpperCase()

export default function OrdersPage() {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState(undefined)
  const [orders, setOrders] = useState([])
  const [placedId, setPlacedId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setPlacedId(new URLSearchParams(window.location.search).get('placed'))

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
      if (!user) return

      // جلب الطلبات مع منتجاتها في استعلام واحد (علاقة orders → order_items)
      const { data, error } = await supabase
        .from('orders')
        .select('id, created_at, status, total, city, order_items(id, name, option, quantity, unit_price, image)')
        .order('created_at', { ascending: false })

      if (error) setError(error.message)
      else setOrders(data)
    }
    load()
  }, [supabase])

  if (user === undefined) {
    return <main className="mx-auto max-w-4xl px-4 py-24 text-center text-gray-400">Loading...</main>
  }

  if (!user) {
    return (
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <h1 className="text-3xl font-black uppercase text-black">Login required</h1>
        <Link
          href="/login?next=/orders"
          className="mt-8 rounded-lg bg-brand px-8 py-4 font-black uppercase text-black hover:bg-brand-dark"
        >
          Log in
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      {placedId && (
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-black p-6 text-white">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-black text-black">
            ✓
          </div>
          <div>
            <p className="text-lg font-black uppercase">Order placed successfully!</p>
            <p className="text-sm text-gray-300">
              Order <span className="font-bold text-brand">#{shortId(placedId)}</span> — our team will call you to confirm delivery.
            </p>
          </div>
        </div>
      )}

      <h1 className="mb-8 text-4xl font-black uppercase text-black">My Orders</h1>

      {error && <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-500">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="mt-4 inline-block font-bold text-brand-deep hover:underline">
            Start shopping →
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`overflow-hidden rounded-2xl border-2 bg-white ${order.id === placedId ? 'border-brand' : 'border-gray-200'}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 px-6 py-4">
                <div>
                  <p className="font-black text-black">Order #{shortId(order.id)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}
                    {order.city}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-lg font-black text-black">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="divide-y divide-gray-100 px-6">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-gray-50">
                      {item.image && <img src={item.image} alt="" className="h-full w-full object-contain p-1" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-black">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.option ? `${item.option} · ` : ''}Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-black">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
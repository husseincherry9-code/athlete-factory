import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { firstImage } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

const FEATURED_CATEGORIES = ['Whey Protein', 'Creatine', 'Pre-Workout', 'Isolate Protein']

export default async function Home() {
  // 1) الفئات والماركات من استعلام واحد
  const { data: rows } = await supabase
    .from('products')
    .select('category, brand')
    .eq('type', 'variable')
    .eq('status', 'Active')

  const all = rows ?? []
  const catCounts = {}
  for (const r of all) {
    if (r.category) catCounts[r.category] = (catCounts[r.category] || 0) + 1
  }
  const topCategories = Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  const brandCount = new Set(all.map((r) => r.brand).filter(Boolean)).size

  // 2) منتجات مميزة من الفئات الأساسية
  const { data: parents } = await supabase
    .from('products')
    .select('id, name, brand, category, regular_price, sale_price')
    .eq('type', 'variable')
    .eq('status', 'Active')
    .in('category', FEATURED_CATEGORIES)
    .order('stock', { ascending: false })
    .limit(8)

  const ids = (parents ?? []).map((p) => p.id)
  const { data: variations } = ids.length
    ? await supabase.from('products').select('parent_id, images, stock').in('parent_id', ids)
    : { data: [] }

  const featured = (parents ?? []).map((p) => {
    const vars = (variations ?? []).filter((v) => v.parent_id === p.id)
    return {
      ...p,
      image: firstImage(vars.find((v) => v.images)?.images),
      stock: vars.reduce((sum, v) => sum + (v.stock || 0), 0),
    }
  })

  return (
    <main>
      {/* Hero */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
            Sports Nutrition Store
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
            Fuel Your <span className="text-orange-500">Performance</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-300">
            Proteins, creatine, pre-workouts and everything you need to train harder and recover faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Shop Now
            </Link>
            <Link
              href={`/products?category=${encodeURIComponent('Whey Protein')}`}
              className="rounded-lg border border-gray-600 px-6 py-3 font-semibold text-white transition hover:border-orange-500"
            >
              Browse Proteins
            </Link>
          </div>

          {/* أرقام من قاعدة البيانات */}
          <div className="mt-14 flex flex-wrap gap-10">
            <div>
              <p className="text-3xl font-bold">{all.length}</p>
              <p className="text-sm text-gray-400">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{brandCount}</p>
              <p className="text-sm text-gray-400">Brands</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{Object.keys(catCounts).length}</p>
              <p className="text-sm text-gray-400">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* الفئات */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/products" className="text-sm font-medium text-orange-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {topCategories.map(([name, count]) => (
            <Link
              key={name}
              href={`/products?category=${encodeURIComponent(name)}`}
              className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-orange-600 hover:shadow-md"
            >
              <p className="font-semibold text-gray-900">{name}</p>
              <p className="mt-1 text-sm text-gray-500">{count} products</p>
            </Link>
          ))}
        </div>
      </section>

      {/* منتجات مميزة */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
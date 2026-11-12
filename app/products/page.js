import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { firstImage } from '@/lib/utils'
import ProductDetails from '@/components/ProductDetails'
import ProductCard from '@/components/ProductCard'

// عنوان التبويب حسب المنتج (SEO)
export async function generateMetadata({ params }) {
  const { id } = await params
  const { data } = await supabase.from('products').select('name, brand').eq('id', id).maybeSingle()
  return {
    title: data ? `${data.name} | The Athlete Factory` : 'Product not found',
    description: data ? `Buy authentic ${data.name} by ${data.brand} in Lebanon at The Athlete Factory.` : undefined,
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params

  // المنتج الأب
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('type', 'variable')
    .maybeSingle()

  if (!product) notFound()

  // النسخ + المنتجات المشابهة بالتوازي
  const [variationsRes, similarRes] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, product_code, regular_price, sale_price, stock, flavor, size, images')
      .eq('parent_id', id)
      .eq('status', 'Active')
      .order('name'),
    supabase
      .from('products')
      .select('id, name, brand, category, regular_price, sale_price')
      .eq('type', 'variable')
      .eq('status', 'Active')
      .eq('category', product.category)
      .neq('id', id)
      .order('stock', { ascending: false })
      .limit(4),
  ])

  const variations = variationsRes.data ?? []
  const similarParents = similarRes.data ?? []

  // صور ومخزون المنتجات المشابهة
  const similarIds = similarParents.map((p) => p.id)
  const { data: similarVars } = similarIds.length
    ? await supabase.from('products').select('parent_id, images, stock').in('parent_id', similarIds)
    : { data: [] }

  const similar = similarParents.map((p) => {
    const vars = (similarVars ?? []).filter((v) => v.parent_id === p.id)
    return {
      ...p,
      image: firstImage(vars.find((v) => v.images)?.images),
      stock: vars.reduce((sum, v) => sum + (v.stock || 0), 0),
    }
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* مسار التنقل */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-black">Shop</Link>
        <span>/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-black"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="font-semibold text-black">{product.name}</span>
      </nav>

      <ProductDetails product={product} variations={variations} />

      {/* منتجات مشابهة */}
      {similar.length > 0 && (
        <section className="mt-20 border-t border-gray-200 pt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep">
                <span className="inline-block h-0.5 w-8 bg-brand" />
                You may also like
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-black">Similar Products</h2>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="group flex items-center gap-2 text-sm font-bold uppercase text-black"
            >
              More {product.category}
              <span className="transition group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
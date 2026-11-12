import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProductDetails from '@/components/ProductDetails'

// عنوان التبويب يتغير حسب المنتج (مفيد لـ SEO)
export async function generateMetadata({ params }) {
  const { id } = await params
  const { data } = await supabase.from('products').select('name').eq('id', id).maybeSingle()
  return { title: data ? `${data.name} | The Athlete Factory` : 'Product not found' }
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

  // نسخه النشطة
  const { data: variations } = await supabase
    .from('products')
    .select('id, name, product_code, regular_price, sale_price, stock, flavor, size, images')
    .eq('parent_id', id)
    .eq('status', 'Active')
    .order('name')

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:text-orange-600">Products</Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
          className="hover:text-orange-600"
        >
          {product.category}
        </Link>
      </nav>

      <ProductDetails product={product} variations={variations ?? []} />
    </main>
  )
}
import { supabase } from '@/lib/supabase'

export default async function Home() {
  // عدد كل الأسطر في الجدول
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // أول 5 منتجات أب نشطة
  const { data: products } = await supabase
    .from('products')
    .select('id, name, brand, category, regular_price')
    .eq('type', 'variable')
    .eq('status', 'Active')
    .limit(5)

  if (error) return <p className="p-8 text-red-600">خطأ: {error.message}</p>

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">عدد الأسطر: {count}</h1>
      <ul className="space-y-2">
        {products?.map((p) => (
          <li key={p.id}>
            {p.name} — {p.brand} — {p.category} — ${p.regular_price}
          </li>
        ))}
      </ul>
    </main>
  )
}
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { firstImage, formatPrice, withVariantInfo } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'

const FEATURED_CATEGORIES = ['Whey Protein', 'Creatine', 'Pre-Workout', 'Isolate Protein', 'Mass Gainer']

const BRANCHES = [
  { area: 'Ein el Remmeneh', detail: 'Chyah - Emile Naim St' },
  { area: 'Sin El Fil', detail: 'Horch Tabet' },
  { area: 'Batroun', detail: 'Hadadi Street' },
  { area: 'Mtayleb', detail: 'Main Road' },
  { area: 'Aramoun', detail: 'Rotana Street' },
]

const WHATSAPP_URL = `https://wa.me/96171185166?text=${encodeURIComponent(
  'Hello! I need advice choosing the right supplements.'
)}`

const mapsUrl = (area) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`The Athlete Factory ${area} Lebanon`)}`

/* ---------- أيقونات بسيطة ---------- */
function Icon({ children, className = 'h-7 w-7' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  )
}

function SectionHeader({ eyebrow, title, href, linkLabel, dark = false }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] ${dark ? 'text-brand' : 'text-brand-deep'}`}>
          <span className="inline-block h-0.5 w-8 bg-brand" />
          {eyebrow}
        </p>
        <h2 className={`text-3xl font-black uppercase tracking-tight md:text-4xl ${dark ? 'text-white' : 'text-black'}`}>
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`group flex items-center gap-2 text-sm font-bold uppercase ${dark ? 'text-white' : 'text-black'}`}
        >
          {linkLabel}
          <span className="transition group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  )
}

export default async function Home() {
  // كل الاستعلامات المستقلة تعمل بالتوازي
  const [metaRes, featuredRes, dealsRes, catImgRes] = await Promise.all([
    supabase.from('products').select('category, brand').eq('type', 'variable').eq('status', 'Active'),
    supabase
      .from('products')
      .select('id, name, brand, category, regular_price, sale_price')
      .eq('type', 'variable')
      .eq('status', 'Active')
      .in('category', FEATURED_CATEGORIES)
      .order('stock', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('id, name, brand, category, regular_price, sale_price')
      .eq('type', 'variable')
      .eq('status', 'Active')
      .not('sale_price', 'is', null)
      .limit(8),
    supabase
      .from('products')
      .select('category, images')
      .eq('type', 'variation')
      .eq('status', 'Active')
      .not('images', 'is', null)
      .limit(1000),
  ])

  const meta = metaRes.data ?? []
  const featuredParents = featuredRes.data ?? []
  const dealParents = dealsRes.data ?? []

  // صور ومخزون المنتجات المعروضة (استعلام واحد لكل الأقسام)
  const ids = [...new Set([...featuredParents, ...dealParents].map((p) => p.id))]
  const { data: variations } = ids.length
    ? await supabase.from('products').select('parent_id, images, stock, regular_price, sale_price').in('parent_id', ids)
    : { data: [] }

  const featured = withVariantInfo(featuredParents, variations ?? [])
  const deals = withVariantInfo(dealParents, variations ?? [])
  const heroProduct = featured.find((p) => p.image && p.stock > 0) ?? featured[0]

  // الإحصاءات
  const catCounts = {}
  const brandCounts = {}
  for (const r of meta) {
    if (r.category) catCounts[r.category] = (catCounts[r.category] || 0) + 1
    if (r.brand) brandCounts[r.brand] = (brandCounts[r.brand] || 0) + 1
  }
  const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const topBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([b]) => b)

  // صورة تمثيلية لكل فئة
  const categoryImage = {}
  for (const r of catImgRes.data ?? []) {
    if (r.category && !categoryImage[r.category]) categoryImage[r.category] = firstImage(r.images)
  }

  const stats = [
    { value: meta.length, label: 'Products' },
    { value: Object.keys(brandCounts).length, label: 'Brands' },
    { value: Object.keys(catCounts).length, label: 'Categories' },
    { value: BRANCHES.length, label: 'Branches' },
  ]

  return (
    <main className="bg-white">
      {/* حركة شريط الماركات */}
      <style>{`@keyframes af-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* شبكة خلفية */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        {/* توهج أصفر */}
        <div className="pointer-events-none absolute -right-32 top-10 h-[480px] w-[480px] rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:py-28 lg:grid-cols-2">
          {/* النص */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
              Lebanon&apos;s Supplements Store
            </span>

            <h1 className="mt-6 text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
              Raise
              <br />
              Your <span className="text-brand">Level</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-gray-300">
              100% authentic proteins, creatine, pre-workouts and vitamins from the world&apos;s top brands —
              delivered all over Lebanon.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-brand px-8 py-4 font-black uppercase tracking-wide text-black shadow-[0_0_40px_rgba(255,214,0,0.35)] transition hover:-translate-y-0.5 hover:bg-brand-dark"
              >
                Shop Now
              </Link>
              <Link
                href={`/products?category=${encodeURIComponent('Whey Protein')}`}
                className="rounded-lg border-2 border-white/20 px-8 py-4 font-black uppercase tracking-wide text-white transition hover:border-brand hover:text-brand"
              >
                Browse Proteins
              </Link>
            </div>

            <div className="mt-14 grid max-w-lg grid-cols-4 gap-4 border-t border-white/10 pt-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-black text-brand">{s.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* الشعار + بطاقة منتج عائمة */}
          <div className="relative hidden justify-center lg:flex">
            <div className="relative flex h-[420px] w-[420px] items-center justify-center rounded-full bg-white ring-8 ring-brand/30">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand/50" style={{ margin: '-24px' }} />
              <img src="/logo.png" alt="The Athlete Factory" className="h-auto w-3/4 object-contain" />
            </div>

            <span className="absolute right-0 top-6 rotate-6 rounded-lg bg-brand px-4 py-2 text-sm font-black uppercase text-black shadow-xl">
              100% Authentic
            </span>

            {heroProduct && (
              <Link
                href={`/products/${heroProduct.id}`}
                className="absolute -left-4 bottom-4 flex w-72 items-center gap-4 rounded-2xl bg-white p-3 text-black shadow-2xl transition hover:-translate-y-1"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                  {heroProduct.image && (
                    <img src={heroProduct.image} alt={heroProduct.name} className="h-full w-full object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-deep">Best Seller</p>
                  <p className="truncate font-bold">{heroProduct.name}</p>
                  <p className="font-black">{formatPrice(heroProduct.sale_price ?? heroProduct.regular_price)}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="bg-brand">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-black md:grid-cols-4">
          {[
            {
              title: '100% Authentic',
              sub: 'Original products only',
              icon: (<><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="m9 12 2 2 4-4" /></>),
            },
            {
              title: 'Fast Delivery',
              sub: 'All over Lebanon',
              icon: (<><path d="M3 7h11v8H3z" /><path d="M14 10h4l3 3v2h-7z" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>),
            },
            {
              title: '5 Branches',
              sub: 'Beirut, Batroun & more',
              icon: (<><path d="M3 4h18l-1 6H4z" /><path d="M4 10v10h16V10" /><path d="M10 20v-5h4v5" /></>),
            },
            {
              title: 'Expert Advice',
              sub: 'Chat with us on WhatsApp',
              icon: (<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />),
            },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-brand">
                <Icon className="h-6 w-6">{item.icon}</Icon>
              </div>
              <div>
                <p className="font-black uppercase leading-tight">{item.title}</p>
                <p className="text-sm text-black/70">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader eyebrow="Find your stack" title="Shop by Category" href="/products" linkLabel="All products" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {topCategories.map(([name, count], i) => (
            <Link
              key={name}
              href={`/products?category=${encodeURIComponent(name)}`}
              className={`group relative flex h-48 overflow-hidden rounded-2xl p-6 transition md:h-56 ${
                i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-brand'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-between">
                <div>
                  <p className="text-xl font-black uppercase leading-tight md:text-2xl">{name}</p>
                  <p className={`mt-1 text-sm ${i === 0 ? 'text-gray-400' : 'text-gray-600 group-hover:text-black/70'}`}>
                    {count} products
                  </p>
                </div>
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase ${
                    i === 0 ? 'bg-brand text-black' : 'bg-black text-white'
                  }`}
                >
                  Shop now <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </div>
              {categoryImage[name] && (
                <img
                  src={categoryImage[name]}
                  alt=""
                  className="absolute -right-4 bottom-0 h-36 w-36 object-contain transition duration-500 group-hover:-rotate-6 group-hover:scale-110 md:h-44 md:w-44"
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ================= BRANDS MARQUEE ================= */}
      <section className="overflow-hidden border-y border-gray-200 bg-white py-8">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
          Official brands we carry
        </p>
        <div className="flex w-max gap-14" style={{ animation: 'af-marquee 40s linear infinite' }}>
          {[...topBrands, ...topBrands].map((b, i) => (
            <Link
              key={`${b}-${i}`}
              href={`/products?brand=${encodeURIComponent(b)}`}
              className="whitespace-nowrap text-2xl font-black uppercase tracking-tight text-gray-300 transition hover:text-black"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* ================= HOT DEALS ================= */}
      {deals.length > 0 && (
        <section className="bg-black py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeader eyebrow="Limited time" title="Hot Deals 🔥" href="/products" linkLabel="Shop all" dark />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {deals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= BEST SELLERS ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHeader eyebrow="Top picks" title="Best Sellers" href="/products" linkLabel="View all" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ================= JOIN + ADVICE ================= */}
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-black p-10 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/20 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Members</p>
          <h3 className="mt-3 text-3xl font-black uppercase leading-tight">
            Join the <span className="text-brand">Factory</span>
          </h3>
          <p className="mt-3 max-w-sm text-gray-300">
            Create your free account and get a faster, more personal shopping experience.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-black uppercase text-black transition hover:bg-brand-dark"
          >
            Create Account
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-brand p-10 text-black">
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-white/40 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/60">Need help?</p>
          <h3 className="mt-3 text-3xl font-black uppercase leading-tight">Talk to an expert</h3>
          <p className="mt-3 max-w-sm text-black/70">
            Not sure what fits your goal? Our team will help you build the right stack on WhatsApp.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-black uppercase text-white transition hover:bg-gray-800"
          >
            <Icon className="h-5 w-5"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></Icon>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* ================= BRANCHES ================= */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader eyebrow="Visit us" title="Our Branches" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {BRANCHES.map((b) => (
              <a
                key={b.area}
                href={mapsUrl(b.area)}
                target="_blank"
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-brand transition group-hover:bg-brand group-hover:text-black">
                  <Icon className="h-5 w-5">
                    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </Icon>
                </div>
                <p className="mt-4 font-black uppercase text-black">{b.area}</p>
                <p className="mt-1 text-sm text-gray-500">{b.detail}</p>
                <p className="mt-4 text-xs font-bold uppercase text-brand-deep">Get directions →</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
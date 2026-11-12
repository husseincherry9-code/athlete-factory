import Link from 'next/link'
import AuthButton from '@/components/AuthButton'
import CartButton from '@/components/CartButton'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40">
      {/* شريط الإعلانات */}
      <div className="bg-brand px-4 py-2 text-center text-xs font-semibold text-black">
        100% Authentic Products · Delivery All Over Lebanon · 5 Branches
      </div>

      <div className="bg-black text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 p-4">
          {/* الشعار على خلفية بيضاء حتى يظهر الجزء الأسود */}
          <Link
            href="/"
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-2 ring-brand/40 transition hover:ring-brand"
          >
            <img src="/logo.png" alt="The Athlete Factory" className="h-full w-full scale-150 object-contain" />
          </Link>

          <form action="/products" className="hidden max-w-md flex-1 md:block">
            <input
              name="q"
              placeholder="Search supplements..."
              className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-brand"
            />
          </form>

          <div className="flex shrink-0 items-center gap-6 text-sm font-semibold uppercase">
            <Link href="/products" className="hover:text-brand">Shop</Link>
            <CartButton />
            <AuthButton />
          </div>
        </nav>

        {/* البحث على الهاتف */}
        <form action="/products" className="px-4 pb-3 md:hidden">
          <input
            name="q"
            placeholder="Search supplements..."
            className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-brand"
          />
        </form>
      </div>
    </header>
  )
}
import Link from 'next/link'

const BRANCHES = [
  'Ein el Remmeneh (Chyah) - Emile Naim St',
  'Sin El Fil - Horch Tabet',
  'Batroun - Hadadi Street',
  'Mtayleb - Main Road',
  'Aramoun - Rotana Street',
]

export default function Footer() {
  return (
    <footer className="mt-10 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-black">
            The Athlete <span className="text-brand">Factory</span>
          </p>
          <p className="mt-3 text-sm">Lebanon&apos;s supplements store. 100% authentic products, delivery all over Lebanon.</p>
          <p className="mt-3 text-sm font-semibold text-brand">RAISE YOUR LEVEL</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-brand">All Products</Link></li>
            <li><Link href="/products?category=Whey%20Protein" className="hover:text-brand">Whey Protein</Link></li>
            <li><Link href="/products?category=Creatine" className="hover:text-brand">Creatine</Link></li>
            <li><Link href="/products?category=Pre-Workout" className="hover:text-brand">Pre-Workout</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">Our Branches</h3>
          <ul className="space-y-2 text-sm">
            {BRANCHES.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-black">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>info@athletefactorylb.com</li>
            <li>+961 70 701046</li>
            <li>+961 71 185166</li>
          </ul>
          <div className="mt-4 flex gap-4 text-sm">
            <a href="https://www.instagram.com/theathletefactoryleb/" target="_blank" className="hover:text-brand">Instagram</a>
            <a href="https://www.tiktok.com/@theathletefactoryleb" target="_blank" className="hover:text-brand">TikTok</a>
            <a href="https://www.facebook.com/people/The-Athlete-Factory/100087472898535/" target="_blank" className="hover:text-brand">Facebook</a>
          </div>
        </div>
      </div>
      <p className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} The Athlete Factory. All rights reserved.
      </p>
    </footer>
  )
}
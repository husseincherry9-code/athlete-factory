import Link from 'next/link'
import AuthButton from '@/components/AuthButton'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-extrabold text-gray-900">
          The Athlete <span className="text-orange-600">Factory</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/products" className="hover:text-orange-600">Products</Link>
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}
'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CartButton() {
  const { count } = useCart()

  return (
    <Link href="/cart" aria-label="Cart" className="relative hover:text-brand">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M6 7h12l-1 13H7z" />
        <path d="M9 7a3 3 0 0 1 6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-black text-black">
          {count}
        </span>
      )}
    </Link>
  )
}
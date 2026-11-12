import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }) {
  const onSale = product.sale_price && product.sale_price < product.regular_price
  const discount = onSale
    ? Math.round((1 - product.sale_price / product.regular_price) * 100)
    : 0
  const outOfStock = product.stock === 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:border-brand hover:shadow-xl"
    >
      <div className="relative flex aspect-square items-center justify-center bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-contain p-4 transition group-hover:scale-105 ${outOfStock ? 'opacity-50' : ''}`}
          />
        ) : (
          <span className="text-sm text-gray-400">No image</span>
        )}

        {onSale && (
          <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-xs font-black text-black">
            -{discount}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3 rounded-md bg-black px-2 py-1 text-xs font-bold uppercase text-white">
            Sold out
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 min-h-12 font-bold text-gray-900">{product.name}</h3>

        <div className="mt-3 flex items-center gap-2">
          {onSale ? (
            <>
              <span className="text-lg font-black text-black">{formatPrice(product.sale_price)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.regular_price)}</span>
            </>
          ) : (
            <span className="text-lg font-black text-black">{formatPrice(product.regular_price)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
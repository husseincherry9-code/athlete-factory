import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function ProductCard({ product }) {
  const onSale = product.sale_price && product.sale_price < product.regular_price

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className="flex aspect-square items-center justify-center bg-gray-50">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition group-hover:scale-105"
          />
        ) : (
          <span className="text-sm text-gray-400">No image</span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">{product.brand}</p>
        <h3 className="line-clamp-2 font-semibold text-gray-900">{product.name}</h3>

        <div className="mt-2 flex items-center gap-2">
          {onSale ? (
            <>
              <span className="font-bold text-red-600">{formatPrice(product.sale_price)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(product.regular_price)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{formatPrice(product.regular_price)}</span>
          )}
        </div>

        {product.stock === 0 && <p className="mt-1 text-xs text-red-500">Out of stock</p>}
      </div>
    </Link>
  )
}
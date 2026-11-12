'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

function splitList(text) {
  return text ? text.split(',').map((s) => s.trim()).filter(Boolean) : []
}

function variantLabel(v) {
  const parts = [v.flavor, v.size].filter(Boolean)
  return parts.length ? parts.join(' — ') : v.product_code || 'Default'
}

export default function ProductDetails({ product, variations }) {
  const [selectedId, setSelectedId] = useState(variations[0]?.id ?? null)
  const [imageIndex, setImageIndex] = useState(0)

  const selected = variations.find((v) => v.id === selectedId) ?? null

  // الصور: من النسخة المختارة، وإلا من المنتج الأب، وإلا من أول نسخة فيها صور
  let images = splitList(selected?.images)
  if (!images.length) images = splitList(product.images)
  if (!images.length) images = splitList(variations.find((v) => v.images)?.images)
  const mainImage = images[imageIndex] ?? images[0]

  const price = selected?.regular_price ?? product.regular_price
  const sale = selected?.sale_price ?? product.sale_price
  const onSale = sale && sale < price
  const stock = selected ? selected.stock : product.stock
  const tags = splitList(product.tags)

  function selectVariant(id) {
    setSelectedId(id)
    setImageIndex(0)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* معرض الصور */}
      <div>
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-white">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="h-full w-full object-contain p-6" />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImageIndex(i)}
                className={`h-20 w-20 shrink-0 rounded-lg border-2 bg-white p-1 ${
                  i === imageIndex ? 'border-orange-600' : 'border-gray-200'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">{product.brand}</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="mt-1 text-gray-500">{product.category}</p>

        <div className="mt-6 flex items-center gap-3">
          {onSale ? (
            <>
              <span className="text-3xl font-bold text-red-600">{formatPrice(sale)}</span>
              <span className="text-lg text-gray-400 line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-3xl font-bold text-gray-900">{formatPrice(price)}</span>
          )}
        </div>

        <p className={`mt-2 text-sm font-medium ${stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {stock > 0 ? `In stock (${stock})` : 'Out of stock'}
        </p>

        {/* اختيار النسخة */}
        {variations.length > 1 && (
          <div className="mt-8">
            <h2 className="mb-3 font-semibold text-gray-900">Options</h2>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVariant(v.id)}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    v.id === selectedId
                      ? 'border-orange-600 bg-orange-50 text-orange-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-orange-600'
                  } ${v.stock === 0 ? 'opacity-50' : ''}`}
                >
                  {variantLabel(v)}
                </button>
              ))}
            </div>
          </div>
        )}

        {variations.length === 1 && variantLabel(variations[0]) !== 'Default' && (
          <p className="mt-8 text-gray-700">
            <span className="font-semibold">Option:</span> {variantLabel(variations[0])}
          </p>
        )}

        {selected?.product_code && (
          <p className="mt-6 text-sm text-gray-500">Code: {selected.product_code}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
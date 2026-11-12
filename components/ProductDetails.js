'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

function splitList(text) {
  return text ? text.split(',').map((s) => s.trim()).filter(Boolean) : []
}

function variantLabel(v) {
  const parts = [v.flavor, v.size].filter(Boolean)
  return parts.length ? parts.join(' — ') : v.product_code || 'Default'
}

export default function ProductDetails({ product, variations }) {
  const { addItem } = useCart()
  const [selectedId, setSelectedId] = useState(variations[0]?.id ?? null)
  const [imageIndex, setImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const selected = variations.find((v) => v.id === selectedId) ?? null

  let images = splitList(selected?.images)
  if (!images.length) images = splitList(product.images)
  if (!images.length) images = splitList(variations.find((v) => v.images)?.images)
  const mainImage = images[imageIndex] ?? images[0]

  const price = selected?.regular_price ?? product.regular_price
  const sale = selected?.sale_price ?? product.sale_price
  const onSale = sale && sale < price
  const finalPrice = onSale ? sale : price
  const stock = selected ? selected.stock : product.stock
  const inStock = stock > 0
  const tags = splitList(product.tags)

  function selectVariant(id) {
    setSelectedId(id)
    setImageIndex(0)
    setQuantity(1)
    setAdded(false)
  }

  function handleAddToCart() {
    const label = selected ? variantLabel(selected) : null
    addItem({
      variantId: selected?.id ?? product.id,
      productId: product.id,
      name: product.name,
      option: label && label !== 'Default' ? label : null,
      price: Number(finalPrice),
      image: mainImage ?? null,
      stock,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* معرض الصور */}
      <div>
        <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-white">
          {mainImage ? (
            <img src={mainImage} alt={product.name} className="h-full w-full object-contain p-8" />
          ) : (
            <span className="text-gray-400">No image</span>
          )}
          {onSale && (
            <span className="absolute left-4 top-4 rounded-md bg-brand px-3 py-1 text-sm font-black text-black">
              -{Math.round((1 - sale / price) * 100)}%
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setImageIndex(i)}
                className={`h-20 w-20 shrink-0 rounded-lg border-2 bg-white p-1 transition ${
                  i === imageIndex ? 'border-brand' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* المعلومات */}
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-brand-deep">{product.brand}</p>
        <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-black md:text-4xl">{product.name}</h1>
        <p className="mt-2 text-gray-500">{product.category}</p>

        <div className="mt-6 flex items-end gap-3">
          <span className="text-4xl font-black text-black">{formatPrice(finalPrice)}</span>
          {onSale && <span className="pb-1 text-lg text-gray-400 line-through">{formatPrice(price)}</span>}
        </div>

        <p className={`mt-3 inline-flex items-center gap-2 text-sm font-semibold ${inStock ? 'text-green-700' : 'text-red-600'}`}>
          <span className={`h-2 w-2 rounded-full ${inStock ? 'bg-green-600' : 'bg-red-600'}`} />
          {inStock ? `In stock (${stock} available)` : 'Out of stock for this selection'}
        </p>

        {/* النكهات / الأحجام */}
        {variations.length > 1 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-black uppercase text-black">Choose an option</h2>
            <div className="flex flex-wrap gap-2">
              {variations.map((v) => (
                <button
                  key={v.id}
                  onClick={() => selectVariant(v.id)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                    v.id === selectedId
                      ? 'border-brand bg-brand-light text-black'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  } ${v.stock === 0 ? 'opacity-40 line-through' : ''}`}
                >
                  {variantLabel(v)}
                </button>
              ))}
            </div>
          </div>
        )}

        {variations.length === 1 && variantLabel(variations[0]) !== 'Default' && (
          <p className="mt-8 text-gray-700">
            <span className="font-bold">Option:</span> {variantLabel(variations[0])}
          </p>
        )}

        {/* الكمية + الإضافة للسلة */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-lg border-2 border-gray-200">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!inStock || quantity <= 1}
              className="px-4 py-3 text-lg font-bold text-black disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center font-black text-black">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={!inStock || quantity >= stock}
              className="px-4 py-3 text-lg font-bold text-black disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`flex-1 rounded-lg px-8 py-4 font-black uppercase tracking-wide transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 ${
              added ? 'bg-green-600 text-white' : 'bg-brand text-black hover:bg-brand-dark'
            }`}
          >
            {!inStock ? 'Sold Out' : added ? 'Added to cart ✓' : 'Add to Cart'}
          </button>
        </div>

        {/* معلومات الثقة */}
        <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-gray-50 p-3"><span className="font-bold text-black">✓ 100% Authentic</span></div>
          <div className="rounded-lg bg-gray-50 p-3"><span className="font-bold text-black">✓ Delivery all over Lebanon</span></div>
        </div>

        {selected?.product_code && <p className="mt-6 text-sm text-gray-400">SKU: {selected.product_code}</p>}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
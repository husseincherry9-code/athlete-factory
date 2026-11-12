// الصور محفوظة كنص مفصول بفواصل، نأخذ أول رابط
export function firstImage(images) {
    if (!images) return null
    return images.split(',')[0].trim()
  }
  
  export function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`
  }

// يضيف لكل منتج أب: صورة أول نسخة + مجموع المخزون
// + سعر احتياطي من النسخ إذا كان سعر الأب 0 أو فارغاً (أقل سعر بين النسخ)
export function withVariantInfo(parents, variations) {
  return parents.map((p) => {
    const vars = variations.filter((v) => v.parent_id === p.id)
    const prices = vars.map((v) => Number(v.regular_price)).filter((n) => n > 0)
    const sales = vars.map((v) => Number(v.sale_price)).filter((n) => n > 0)
    const missingPrice = !(Number(p.regular_price) > 0)
    return {
      ...p,
      image: firstImage(vars.find((v) => v.images)?.images),
      stock: vars.reduce((sum, v) => sum + Math.max(0, v.stock || 0), 0),
      regular_price: missingPrice && prices.length ? Math.min(...prices) : p.regular_price,
      sale_price: missingPrice && sales.length ? Math.min(...sales) : p.sale_price,
    }
  })
}

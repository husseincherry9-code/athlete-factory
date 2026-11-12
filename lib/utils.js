// الصور محفوظة كنص مفصول بفواصل، نأخذ أول رابط
export function firstImage(images) {
    if (!images) return null
    return images.split(',')[0].trim()
  }
  
  export function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`
  }
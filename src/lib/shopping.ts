export interface PricedItem {
  quantity: number
  products?: { price: number } | null
}

export function estimatedListTotal(items: PricedItem[]) {
  return items.reduce((sum, item) => sum + Number(item.products?.price || 0) * item.quantity, 0)
}

export function discountPercentage(originalPrice: number, promotionalPrice: number) {
  if (originalPrice <= 0 || promotionalPrice >= originalPrice) return 0
  return Math.round((1 - promotionalPrice / originalPrice) * 100)
}

export function clampQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) return 1
  return Math.max(1, Math.floor(quantity))
}

import { describe, expect, it } from 'vitest'
import { clampQuantity, discountPercentage, estimatedListTotal } from './shopping'

describe('shopping rules', () => {
  it('calcula o total apenas dos itens com preço de catálogo', () => {
    expect(estimatedListTotal([
      { quantity: 2, products: { price: 5.5 } },
      { quantity: 3, products: null },
      { quantity: 1, products: { price: 10 } },
    ])).toBe(21)
  })

  it('calcula desconto arredondado e ignora valores inválidos', () => {
    expect(discountPercentage(10, 7.49)).toBe(25)
    expect(discountPercentage(0, 5)).toBe(0)
    expect(discountPercentage(10, 12)).toBe(0)
  })

  it('mantém quantidade como inteiro positivo', () => {
    expect(clampQuantity(-2)).toBe(1)
    expect(clampQuantity(2.9)).toBe(2)
    expect(clampQuantity(Number.NaN)).toBe(1)
  })
})

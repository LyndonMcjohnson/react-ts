/** 12 -> "$12.00" */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`
}

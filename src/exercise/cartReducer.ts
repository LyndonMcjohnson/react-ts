import type { MenuItem } from '../api/restaurants'

export type CartLine = { item: MenuItem; quantity: number }
export type CartState = { lines: CartLine[] }

// TODO (Task 6): add a 'remove' action ({ type: 'remove'; itemId: string })
export type CartAction =
  | { type: 'add'; item: MenuItem }
  | { type: 'clear' }

export const initialCart: CartState = { lines: [] }

export function cartReducer(state: CartState, action: CartAction): CartState {
  // TODO (Task 6):
  //  'add'    -> if the item is already in the cart, add 1 to its quantity; otherwise add a line with quantity 1
  //  'remove' -> remove that line
  //  'clear'  -> back to initialCart
  // Always RETURN A NEW OBJECT — never mutate `state`.
  console.log('cartReducer received', action)
  return state
}

export function cartTotal(cart: CartState): number {
  // TODO (Task 6): sum of price * quantity (hint: reduce)
  console.log('cartTotal', cart)
  return 0
}

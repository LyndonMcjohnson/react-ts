import type { MenuItem } from '../api/restaurants'

export type CartLine = { item: MenuItem; quantity: number }
export type CartState = { lines: CartLine[] }

export type CartAction =
  | { type: 'add'; item: MenuItem }
  | { type: 'remove'; itemId: string }
  | { type: 'clear' }

export const initialCart: CartState = { lines: [] }

// A reducer is a PURE function: (currentState, action) => newState. No mutation.
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.lines.find((l) => l.item.id === action.item.id)
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.item.id === action.item.id ? { ...l, quantity: l.quantity + 1 } : l,
          ),
        }
      }
      return { lines: [...state.lines, { item: action.item, quantity: 1 }] }
    }
    case 'remove':
      return { lines: state.lines.filter((l) => l.item.id !== action.itemId) }
    case 'clear':
      return initialCart
  }
}

export function cartTotal(cart: CartState): number {
  return cart.lines.reduce((sum, l) => sum + l.item.price * l.quantity, 0)
}

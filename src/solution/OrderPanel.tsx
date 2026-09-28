import { useReducer } from 'react'
import type { Restaurant } from '../api/restaurants'
import { formatPrice } from '../utils/format'
import { cartReducer, cartTotal, initialCart } from './cartReducer'

type OrderPanelProps = {
  restaurant: Restaurant
  onClose: () => void
}

export function OrderPanel({ restaurant, onClose }: OrderPanelProps) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)
  const total = cartTotal(cart) // derived value: compute it, don't store it in state

  return (
    <section className="panel" aria-label="Order">
      <h2>Order from {restaurant.name}</h2>

      <h3>Menu</h3>
      <ul>
        {restaurant.menu.map((item) => (
          <li key={item.id}>
            {item.name} — {formatPrice(item.price)}{' '}
            <button aria-label={`Add ${item.name}`} onClick={() => dispatch({ type: 'add', item })}>
              Add
            </button>
          </li>
        ))}
      </ul>

      <h3>Cart</h3>
      {cart.lines.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul aria-label="Cart">
          {cart.lines.map((line) => (
            <li key={line.item.id}>
              {line.item.name} × {line.quantity}{' '}
              <button
                aria-label={`Remove ${line.item.name}`}
                onClick={() => dispatch({ type: 'remove', itemId: line.item.id })}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <p>
        <strong>Total: {formatPrice(total)}</strong>
      </p>
      <div className="row">
        <button onClick={() => dispatch({ type: 'clear' })}>Clear cart</button>
        <button onClick={onClose}>Close</button>
      </div>
    </section>
  )
}

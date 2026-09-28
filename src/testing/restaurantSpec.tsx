// Shared tests for the exercise AND the solution.
// Run just one task with:  npm test -- -t "Task 3"
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'
import { mockServer } from '../api/restaurants'

export function runRestaurantSpec(label: string, App: ComponentType) {
  async function renderLoaded() {
    const user = userEvent.setup()
    render(<App />)
    const list = await screen.findByRole('list', { name: 'Restaurants' })
    return { user, list }
  }

  function namesIn(list: HTMLElement) {
    return within(list)
      .getAllByRole('listitem')
      .map((li) => li.getAttribute('aria-label'))
  }

  const ORIGINAL_ORDER = ['Pizza Palace', 'Sushi Spot', 'Taco Town', 'Jollof Junction', 'Burger Barn']

  describe(label, () => {
    describe('Task 1 — RestaurantCard (JSX + props)', () => {
      it('shows the name as a heading and a details line', async () => {
        const { list } = await renderLoaded()
        const card = within(list).getByRole('listitem', { name: 'Pizza Palace' })
        expect(within(card).getByRole('heading', { name: 'Pizza Palace' })).toBeInTheDocument()
        expect(card).toHaveTextContent('Italian · Accra · ⭐ 4.2')
        // rating always shows one decimal place
        expect(within(list).getByRole('listitem', { name: 'Burger Barn' })).toHaveTextContent('⭐ 4.0')
      })
    })

    describe('Task 2 — useRestaurants (useEffect data fetching)', () => {
      it('shows "Loading..." while the request is in flight', async () => {
        render(<App />)
        expect(screen.getByText('Loading...')).toBeInTheDocument()
        expect(await screen.findByRole('list', { name: 'Restaurants' })).toBeInTheDocument()
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
      })

      it('shows an error message when the request fails', async () => {
        mockServer.failRequests = true
        render(<App />)
        expect(await screen.findByRole('alert')).toHaveTextContent('Could not load restaurants')
      })
    })

    describe('Task 3 — search and city filter (controlled inputs, derived state)', () => {
      it('filters by name, case-insensitive', async () => {
        const { user, list } = await renderLoaded()
        await user.type(screen.getByLabelText('Search'), 'PIZZA')
        expect(namesIn(list)).toEqual(['Pizza Palace'])
      })

      it('offers each city once in the dropdown and filters by it', async () => {
        const { user, list } = await renderLoaded()
        const select = screen.getByLabelText('City')
        const options = within(select).getAllByRole('option').map((o) => o.textContent)
        expect(options).toEqual(['All cities', 'Accra', 'Kumasi', 'Takoradi'])

        await user.selectOptions(select, 'Kumasi')
        expect(namesIn(list)).toEqual(['Sushi Spot', 'Burger Barn'])
      })

      it('combines search and city, and shows a message when nothing matches', async () => {
        const { user } = await renderLoaded()
        await user.selectOptions(screen.getByLabelText('City'), 'Accra')
        await user.type(screen.getByLabelText('Search'), 'sushi')
        expect(screen.getByText('No restaurants match')).toBeInTheDocument()
      })
    })

    describe('Task 4 — bug hunt: "Sort by rating"', () => {
      it('sorts when checked and restores the original order when unchecked', async () => {
        const { user, list } = await renderLoaded()
        const checkbox = screen.getByRole('checkbox', { name: 'Sort by rating' })

        await user.click(checkbox)
        expect(namesIn(list)).toEqual(['Sushi Spot', 'Jollof Junction', 'Pizza Palace', 'Burger Barn', 'Taco Town'])

        await user.click(checkbox)
        expect(namesIn(list)).toEqual(ORIGINAL_ORDER)
      })
    })

    describe('Task 5 — favorites (Context API)', () => {
      it('toggles a favorite and updates the count in the header', async () => {
        const { user, list } = await renderLoaded()
        const card = within(list).getByRole('listitem', { name: 'Taco Town' })
        expect(screen.getByText('Favorites: 0')).toBeInTheDocument()

        await user.click(within(card).getByRole('button', { name: /favorite/i }))
        expect(screen.getByText('Favorites: 1')).toBeInTheDocument()
        expect(within(card).getByRole('button', { name: /favorite/i })).toHaveTextContent('★ Favorited')

        await user.click(within(card).getByRole('button', { name: /favorite/i }))
        expect(screen.getByText('Favorites: 0')).toBeInTheDocument()
      })
    })

    describe('Task 6 — cart (useReducer)', () => {
      it('adds, counts, totals and removes items', async () => {
        const { user, list } = await renderLoaded()
        const card = within(list).getByRole('listitem', { name: 'Pizza Palace' })
        await user.click(within(card).getByRole('button', { name: 'Order from here' }))

        const panel = screen.getByRole('region', { name: 'Order' })
        expect(panel).toHaveTextContent('Your cart is empty')

        await user.click(within(panel).getByRole('button', { name: 'Add Margherita' }))
        await user.click(within(panel).getByRole('button', { name: 'Add Margherita' }))
        await user.click(within(panel).getByRole('button', { name: 'Add Pepperoni' }))

        const cart = within(panel).getByRole('list', { name: 'Cart' })
        expect(cart).toHaveTextContent('Margherita × 2')
        expect(cart).toHaveTextContent('Pepperoni × 1')
        expect(panel).toHaveTextContent('Total: $38.50')

        await user.click(within(panel).getByRole('button', { name: 'Remove Margherita' }))
        expect(cart).not.toHaveTextContent('Margherita')
        expect(panel).toHaveTextContent('Total: $14.50')
      })
    })

    describe('Task 7 (stretch) — reset state with a key', () => {
      it('starts with an empty cart when switching restaurants', async () => {
        const { user, list } = await renderLoaded()
        const pizza = within(list).getByRole('listitem', { name: 'Pizza Palace' })
        await user.click(within(pizza).getByRole('button', { name: 'Order from here' }))
        await user.click(screen.getByRole('button', { name: 'Add Margherita' }))
        expect(screen.getByRole('region', { name: 'Order' })).toHaveTextContent('Margherita × 1')

        const sushi = within(list).getByRole('listitem', { name: 'Sushi Spot' })
        await user.click(within(sushi).getByRole('button', { name: 'Order from here' }))

        const panel = screen.getByRole('region', { name: 'Order' })
        expect(panel).toHaveTextContent('Order from Sushi Spot')
        expect(panel).toHaveTextContent('Your cart is empty')
      })
    })
  })
}

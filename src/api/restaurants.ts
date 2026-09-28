// A fake backend. In the real interview this would be a REST API called with fetch().
// Everything here is already written for you — read it, but you don't need to change it.

export type MenuItem = {
  id: string
  name: string
  price: number
}

export type Restaurant = {
  id: string
  name: string
  cuisine: string
  city: string
  rating: number
  menu: MenuItem[]
}

export const sampleRestaurants: Restaurant[] = [
  {
    id: 'r1', name: 'Pizza Palace', cuisine: 'Italian', city: 'Accra', rating: 4.2,
    menu: [
      { id: 'm1', name: 'Margherita', price: 12 },
      { id: 'm2', name: 'Pepperoni', price: 14.5 },
    ],
  },
  {
    id: 'r2', name: 'Sushi Spot', cuisine: 'Japanese', city: 'Kumasi', rating: 4.8,
    menu: [
      { id: 'm3', name: 'California Roll', price: 9 },
      { id: 'm4', name: 'Salmon Nigiri', price: 11 },
    ],
  },
  {
    id: 'r3', name: 'Taco Town', cuisine: 'Mexican', city: 'Accra', rating: 3.9,
    menu: [
      { id: 'm5', name: 'Beef Taco', price: 4.5 },
      { id: 'm6', name: 'Nachos', price: 7.25 },
    ],
  },
  {
    id: 'r4', name: 'Jollof Junction', cuisine: 'Ghanaian', city: 'Takoradi', rating: 4.6,
    menu: [
      { id: 'm7', name: 'Jollof Rice', price: 8 },
      { id: 'm8', name: 'Kelewele', price: 3.5 },
    ],
  },
  {
    id: 'r5', name: 'Burger Barn', cuisine: 'American', city: 'Kumasi', rating: 4.0,
    menu: [
      { id: 'm9', name: 'Cheeseburger', price: 10 },
      { id: 'm10', name: 'Fries', price: 3 },
    ],
  },
]

/** Switches for demos and tests. */
export const mockServer = {
  failRequests: false,
  delayMs: 800,
}

/** Pretend network call: resolves after a delay, or rejects if mockServer.failRequests is true. */
export function fetchRestaurants(): Promise<Restaurant[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockServer.failRequests) {
        reject(new Error('Network error'))
        return
      }
      // structuredClone = hand back a fresh copy, like a real server would
      resolve(structuredClone(sampleRestaurants))
    }, mockServer.delayMs)
  })
}

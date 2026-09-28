// Runs before every test file. Adds matchers like toBeInTheDocument / toHaveTextContent.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { mockServer } from '../api/restaurants'

beforeEach(() => {
  mockServer.failRequests = false
  mockServer.delayMs = 20 // keep tests fast
})

afterEach(() => cleanup())

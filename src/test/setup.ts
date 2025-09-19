// Vitest setup file
import { beforeAll, vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock environment variables
beforeAll(() => {
  vi.stubEnv('PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
  vi.stubEnv('PUBLIC_SUPABASE_ANON_KEY', 'test-key')
  vi.stubEnv('PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_test')
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_test')
})
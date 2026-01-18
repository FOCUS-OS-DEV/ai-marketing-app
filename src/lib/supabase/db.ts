import { createBrowserClient } from '@supabase/ssr'

// Create untyped client for dynamic table access
export function createUntypedClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type { Json } from '@/types/database'

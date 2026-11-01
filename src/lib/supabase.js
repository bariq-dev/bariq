import { createClient } from '@supabase/supabase-js'

// Directly reference import.meta.env so Vite can perform static build-time replacement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  try {
    return url && (url.startsWith('http://') || url.startsWith('https://'))
  } catch {
    return false
  }
}

export const hasSupabase = Boolean(isValidUrl(supabaseUrl) && supabaseAnonKey)

export const supabase = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
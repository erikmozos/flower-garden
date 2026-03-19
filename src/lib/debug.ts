// Debug utilities for Supabase connectivity
export function checkSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.warn('⚠️  Supabase environment variables missing!')
    return false
  }
  
  const isValidUrl = url.includes('supabase.co')
  const isValidKey = key.length > 50
  
  if (!isValidUrl || !isValidKey) {
    console.warn('⚠️  Supabase environment variables appear invalid!')
    return false
  }
  
  return true
}

export const isSupabaseConfigured = checkSupabaseConfig()

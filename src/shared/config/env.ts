const requiredEnv = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
} as const

export const env = {
  supabaseUrl: requiredEnv.supabaseUrl,
  supabaseAnonKey: requiredEnv.supabaseAnonKey,
} as const

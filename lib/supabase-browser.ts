import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build or if env vars are missing, return a mock client or null
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Authentication features will be disabled.');

    // For static build, return a minimal mock client that won't throw errors
    if (typeof window === 'undefined') {
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Not implemented') }),
          signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
          select: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
          insert: () => Promise.resolve({ error: null }),
        }),
      } as any;
    }
  }

  // For runtime with valid env vars, create a real client
  try {
    return createBrowserClient(
      supabaseUrl!,
      supabaseAnonKey!
    );
  } catch (error) {
    console.error('Error creating Supabase client:', error);

    // Return a minimal mock client that won't throw errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any;
  }
}

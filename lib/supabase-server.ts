import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build or if env vars are missing, return a mock client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Authentication features will be disabled.');

    // Return a minimal mock client that won't throw errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
        insert: () => Promise.resolve({ error: null }),
      }),
    } as any;
  }

  try {
    const cookieStore = cookies();

    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            // Handle cookies() returning a ReadonlyRequestCookies object
            const cookie = cookieStore.get(name);
            return cookie?.value;
          },
          set(name: string, value: string, options: any) {
            // Set cookie with the correct interface
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            // Remove cookie by setting an empty value
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating Supabase server client:', error);

    // Return a minimal mock client that won't throw errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null } }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
      },
    } as any;
  }
}

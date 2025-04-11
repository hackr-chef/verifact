import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
}

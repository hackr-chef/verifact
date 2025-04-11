import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
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

    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/app', request.url));
}

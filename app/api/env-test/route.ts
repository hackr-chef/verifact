import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  // Return environment variable information (without revealing the full keys)
  return new Response(
    JSON.stringify({
      environment: process.env.NODE_ENV,
      // API Keys
      openai_key_set: !!process.env.OPENAI_API_KEY,
      openai_key_prefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 5) + '...' : null,
      serpapi_key_set: !!process.env.SERPAPI_API_KEY,
      serpapi_key_prefix: process.env.SERPAPI_API_KEY ? process.env.SERPAPI_API_KEY.substring(0, 5) + '...' : null,
      serper_key_set: !!process.env.SERPER_API_KEY,
      serper_key_prefix: process.env.SERPER_API_KEY ? process.env.SERPER_API_KEY.substring(0, 5) + '...' : null,
      // Supabase Config
      supabase_url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabase_url_prefix: process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 15) + '...' : null,
      supabase_anon_key_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabase_anon_key_prefix: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + '...' : null,
      // Timestamp
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

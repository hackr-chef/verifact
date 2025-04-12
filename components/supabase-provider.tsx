'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import type { SupabaseClient, User } from '@supabase/supabase-js';

type SupabaseContext = {
  supabase: SupabaseClient | any; // Allow for mock client
  user: User | null;
  loading: boolean;
  isSupabaseAvailable: boolean; // Flag to indicate if Supabase is properly configured
};

const Context = createContext<SupabaseContext | undefined>(undefined);

// Check if Supabase environment variables are available
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseAvailable] = useState(isSupabaseConfigured());
  const router = useRouter();

  useEffect(() => {
    // Only set up auth state change if Supabase is available
    if (isSupabaseAvailable && supabase.auth) {
      try {
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user ?? null);
          setLoading(false);
          router.refresh();
        });

        // Set loading to false after a timeout in case Supabase is slow to respond
        const timeout = setTimeout(() => {
          setLoading(false);
        }, 1000);

        return () => {
          clearTimeout(timeout);
          subscription?.unsubscribe?.();
        };
      } catch (error) {
        console.error('Error setting up Supabase auth listener:', error);
        setLoading(false);
        return () => {};
      }
    } else {
      // If Supabase is not available, just set loading to false
      setLoading(false);
      return () => {};
    }
  }, [supabase, router, isSupabaseAvailable]);

  return (
    <Context.Provider value={{ supabase, user, loading, isSupabaseAvailable }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }
  return context;
};

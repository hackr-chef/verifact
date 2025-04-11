'use client';

import { useState } from 'react';
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';

export default function SignOutButton({ className = '' }: { className?: string }) {
  const [loading, setLoading] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`text-gray-600 hover:text-gray-900 ${className}`}
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

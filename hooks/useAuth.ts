'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  const user = session?.user;

  return {
    // User state
    user,
    isLoading,
    isAuthenticated: !!user,
    
    // User info
    userId: user?.id,
    userRole: user?.role,
    userName: user?.name,
    userEmail: user?.email,
    userImage: user?.image,
    userPhone: user?.phone,

    // Auth status
    status,

    // Auth actions
    signIn: (provider?: string, options?: any) => signIn(provider, options),
    signOut: (options?: any) => signOut(options),
    updateSession: update,

    // Role checks
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER',
    isModerator: user?.role === 'MODERATOR',
  };
}
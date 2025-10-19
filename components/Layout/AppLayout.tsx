'use client';

import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from './BottomNavigation';
import TopBar from './TopBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar - Always visible */}
      <TopBar />
      
      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Bottom Navigation - Only for authenticated users on mobile */}
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
}
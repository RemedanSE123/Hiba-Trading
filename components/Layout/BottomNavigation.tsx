'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: '🗂️',
    activeIcon: '🗂️',
  },
  {
    name: 'Cart',
    href: '/cart',
    icon: '🛒',
    activeIcon: '🛒',
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: '📦',
    activeIcon: '📦',
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: '👤',
    activeIcon: '👤',
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around items-center">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-3 px-4 flex-1 min-w-0 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <span className="text-xl mb-1">
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs font-medium truncate">
                {item.name}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
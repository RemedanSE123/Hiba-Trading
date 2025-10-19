import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Admin route protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token;
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // API rate limiting can be added here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN';
        }
        
        // Protect authenticated routes
        if (req.nextUrl.pathname.startsWith('/checkout') || 
            req.nextUrl.pathname.startsWith('/orders') ||
            req.nextUrl.pathname.startsWith('/profile')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/api/orders/:path*',
    '/api/cart/:path*',
  ],
};
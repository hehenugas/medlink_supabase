import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/me',
  ]

  if (publicRoutes.includes(pathname)) { return NextResponse.next() }

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const decoded = await verifyJWT(token);

  // Allow all API routes for authenticated users
  if (pathname.startsWith('/api/')) {
    try {
      const response = NextResponse.next();
      response.headers.set('x-user-id', decoded.userId?.toString() || "");
      response.headers.set('x-username', decoded.username?.toString() || "");
      response.headers.set('x-user-role', decoded.role?.toString() || "");

      return response;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Handle non-API routes
  try {
    // Restrict ADMIN to /admin/* only
    if (decoded.role === 'ADMIN' && !pathname.startsWith('/admin/')) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Restrict USER from accessing /admin/*
    if (decoded.role === 'USER' && pathname.startsWith('/admin/')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const response = NextResponse.next();
    return response;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/account/:path*',
    '/appointment/:path*',
    '/dashboard/:path*',
    '/doctors/:path*',
    '/healthcare/:path*',
    '/healthcare-monitoring/:path*',
    '/laboratory/:path*',
    '/message/:path*',
    '/pharmacy/:path*',
    '/api/((?!auth).*)',
    '/admin/:path*',
  ],
};
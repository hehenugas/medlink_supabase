import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  cookieStore.delete('auth_token');
  cookieStore.set({
    name: 'auth_token',
    value: '',
    maxAge: 0,
    path: '/',
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  const response = NextResponse.json(
    { message: 'Logged out successfully', success: true },
    { status: 200 }
  );

  req.cookies.delete('auth_token');

  response.headers.set(
    'Set-Cookie',
    'auth_token=; Max-Age=0; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict'
  );

  return response;
}
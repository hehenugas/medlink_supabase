import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

type Role = 'USER' | 'ADMIN';

const setAuthCookie = async (user: { id: number; email: string }, role: Role) => {
  const token = jwt.sign(
    { userId: user.id, email: user.email, role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  (await cookies()).set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600,
  });

  return token;
};

export async function POST(req: NextRequest) {
  try {
    const hashedPassword = req.nextUrl.searchParams.get('code');

    if (!hashedPassword) {
      return NextResponse.json({ error: 'QR code required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 });
    }

    const role = user.email === 'admin@ums.ac.id' ? 'ADMIN' : 'USER';
    const token = await setAuthCookie(user, role);

    return NextResponse.json(
      {
        message: 'QR Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          major: user.major,
          studentId: user.studentId,
          birthPlace: user.birthPlace,
          birthDate: user.birthDate,
          phoneNumber: user.phoneNumber,
          role: role,
        },
        token,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ error: 'Failed to login via QR' }, { status: 500 });
  }
}

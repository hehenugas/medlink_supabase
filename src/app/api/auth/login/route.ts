import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

type Role = 'USER' | 'ADMIN';

const setAuthCookie = async (user: any, role: Role) => {
  const token = jwt.sign(
    { userId: user.id, username: user.username, role },
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
    const { username, password } = await req.json();

    // Special admin login
    if (username === 'admin' && password === 'admin') {
      const adminUser = {
        id: 999999, // Special ID for hardcoded admin
        username: 'admin',
        email: 'admin@admin.com',
        name: 'Administrator',
        role: 'ADMIN',
        gender: null,
        major: null,
        studentId: null,
        birthPlace: null,
        birthDate: null,
        phoneNumber: null,
      };

      const token = await setAuthCookie(adminUser, 'ADMIN');
      return NextResponse.json(
        {
          message: 'Admin login successful',
          user: adminUser,
          token,
        },
        { status: 200 }
      );
    }

    // Regular user login
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await setAuthCookie(user, 'USER');

    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          gender: user.gender,
          major: user.major,
          studentId: user.studentId,
          birthPlace: user.birthPlace,
          birthDate: user.birthDate,
          phoneNumber: user.phoneNumber,
          role: 'USER',
        },
        token,
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json({ error: 'Failed to login' + error, }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

interface DecodedToken {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Handle special admin case
    if (decoded.userId === 999999 && decoded.email === 'admin@admin.com') {
      return NextResponse.json(
        {
          message: 'Token is valid',
          user: {
            id: 999999,
            username: "admin",
            email: 'admin@admin.com',
            name: 'Administrator',
            role: 'ADMIN',
            gender: null,
            major: null,
            studentId: null,
            birthPlace: null,
            birthDate: null,
            phoneNumber: null,
            avatar: null
          },
          token,
        },
        { status: 200 }
      );
    }

    // Regular user validation
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: 'Token is valid',
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
          avatar: user.avatar,
          role: decoded.role,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error validating token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
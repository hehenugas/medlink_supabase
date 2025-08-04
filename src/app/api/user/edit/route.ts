import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userIdNum = parseInt(userId, 10);

    const {
      email,
      name,
      gender,
      major,
      studentId,
      birthPlace,
      birthDate,
      phoneNumber,
    } = await req.json();

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userIdNum
          }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdNum },
      data: {
        email,
        name,
        gender,
        major,
        studentId,
        birthPlace,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        phoneNumber,
      },
    });

    return NextResponse.json(
      {
        message: 'User information updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          gender: updatedUser.gender,
          major: updatedUser.major,
          studentId: updatedUser.studentId,
          birthPlace: updatedUser.birthPlace,
          birthDate: updatedUser.birthDate,
          phoneNumber: updatedUser.phoneNumber,
          role: 'USER',
        },
      },
      { status: 200 }
    );

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update user information' },
      { status: 500 }
    );
  }
}
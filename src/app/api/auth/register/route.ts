import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function hashed(password: string) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      username,
      password,
      name,
      gender,
      major,
      studentId,
      birthPlace,
      birthDate,
      phoneNumber,
    } = await req.json();

    if (!email || !username || !password || !name || !gender || !major || !studentId || !birthPlace || !birthDate || !phoneNumber) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check for existing username
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Check for existing email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already taken' },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed(password),
        name,
        gender,
        major,
        studentId,
        birthPlace,
        birthDate: new Date(birthDate),
        phoneNumber,
        avatar: ""
      },
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          gender: newUser.gender,
          major: newUser.major,
          studentId: newUser.studentId,
          birthPlace: newUser.birthPlace,
          birthDate: newUser.birthDate,
          phoneNumber: newUser.phoneNumber,
          role: 'USER',
        },
      },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to register' },
      { status: 500 }
    );
  }
}
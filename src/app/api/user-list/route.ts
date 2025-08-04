import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {

  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany();

    const formattedUser = users.map((user: User) => ({
      id: user.id,
      name: user.name,
      username: user.username,
    }));

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
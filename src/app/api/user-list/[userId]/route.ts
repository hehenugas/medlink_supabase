import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export interface UserDetailsResponse {
  id: number;
  name: string;
  username: string;
}

export async function GET(req: NextRequest, { params }: any) {

  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = (await params).userId;
    if (!id) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formattedUser: UserDetailsResponse = {
      id: user.id,
      name: user.name,
      username: user.username
    }

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

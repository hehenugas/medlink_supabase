import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export interface AllMessageUserResponse {
  userId: number;
  userName: string;
  userUsername: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
}

export async function GET(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doctorId = req.nextUrl.searchParams.get('doctorId');

  if(!doctorId) {
    return NextResponse.json({ error: 'Missing doctorId' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      doctorId: parseInt(doctorId),
    },
    orderBy: {
      time: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const seenUsers = new Set();
  const lastMessages: AllMessageUserResponse[] = [];

  for (const msg of messages) {
    if (!msg.userId || seenUsers.has(msg.userId)) continue;

    seenUsers.add(msg.userId);

    lastMessages.push({
      userId: msg.userId,
      userName: msg.user?.name ?? 'Unknown',
      userUsername: msg.user?.username ?? 'Unknown',
      avatar: msg.user?.avatar ?? null,
      lastMessage: msg.content,
      lastMessageTime: msg.time.toISOString(),
    });
  }

  return NextResponse.json(lastMessages);
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lastMessage = await prisma.message.findFirst({
    where: {
      userId: parseInt(userId),
      sender: 'DOCTOR',
      doctorId: {
        not: null,
      },
    },
    orderBy: {
      time: 'desc',
    },
    include: {
      doctor: {
        select: {
          name: true,
          specialist: true,
        },
      },
    },
  });

  if (!lastMessage) {
    return NextResponse.json({ message: null });
  }

  return NextResponse.json({
    doctorId: lastMessage.doctorId,
    name: lastMessage.doctor?.name,
    specialty: lastMessage.doctor?.specialist,
    avatar: "",
    lastMessage: lastMessage.content,
    lastMessageTime: lastMessage.time,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doctorId = (await params).doctorId;

  if (!doctorId) {
    return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      userId: parseInt(userId),
      doctorId: parseInt(doctorId),
    },
    include: {
      doctor: {
        select: {
          name: true,
          specialist: true,
        },
      }
    },
    orderBy: { time: 'asc' },
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: any) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const doctorId = (await params).doctorId;

  if (!doctorId) {
    return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        sender: 'USER',
        content: content.trim(),
        userId: parseInt(userId),
        doctorId: parseInt(doctorId),
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

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Failed to save message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


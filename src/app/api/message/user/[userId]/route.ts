import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: any) {
  const userRole = req.headers.get('x-user-role');

  if (userRole !== "ADMIN") {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (await params).userId;
  const doctorId = req.nextUrl.searchParams.get("doctorId");

  if (!userId || !doctorId) {
    return NextResponse.json({ error: "Missing userId or doctorId" }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      doctorId: parseInt(doctorId),
      userId: parseInt(userId),
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        },
      }
    },
    orderBy: { time: 'asc' },
  });

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: any) {
  const doctorId = req.nextUrl.searchParams.get("doctorId");

  if (!doctorId) {
    return NextResponse.json({ error: 'Missing doctorId in query' }, { status: 400 });
  }

  const userId = (await params).userId;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const body = await req.json();
  const { content } = body;

  if (!content || content.trim() === "") {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        sender: 'DOCTOR',
        content: content.trim(),
        doctorId: parseInt(doctorId),
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
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

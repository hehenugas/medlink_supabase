import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gt: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 3,
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialist: true,
            about: true,
            education: true,
            experience: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

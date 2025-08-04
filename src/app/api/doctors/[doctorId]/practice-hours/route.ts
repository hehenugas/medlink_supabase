import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: any ) {
  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const doctorId = (await params).doctorId;
    if (!doctorId) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    const { dayOfWeek, startTime, endTime } = await req.json();

    if (!dayOfWeek || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (!validDays.includes(dayOfWeek)) {
      return NextResponse.json({ error: "Invalid day of week" }, { status: 400 });
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ error: "Invalid time format" }, { status: 400 });
    }

    const newPracticeHour = await prisma.practiceHour.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        doctorId: parseInt(doctorId),
      },
    });

    return NextResponse.json(newPracticeHour, { status: 201 });
  } catch (error) {
    console.error("Error adding practice hour:", error);
    return NextResponse.json({ error: "Failed to add practice hour" }, { status: 500 });
  }
}
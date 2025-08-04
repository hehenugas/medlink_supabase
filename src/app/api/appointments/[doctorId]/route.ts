import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

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
  const { date, purpose, information } = body;

  if (!date || !purpose || !information) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const appointmentDate = new Date(date);
  const startOfDay = new Date(appointmentDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(appointmentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const newAppointment = await prisma.appointment.create({
    data: {
      date: appointmentDate,
      purpose,
      information,
      status: 'pending',
      confirmTime: new Date(),
      queueNum: 0,

      userId: parseInt(userId),
      doctorId: parseInt(doctorId),
    },
  });

  return NextResponse.json(newAppointment, { status: 201 });
}

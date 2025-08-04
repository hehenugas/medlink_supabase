import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: any) {
  try {
    const appointmentId = (await params).appointmentId;

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(appointmentId) },
      select: { date: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const appointmentDate = new Date(appointment.date);
    const startOfDay = new Date(appointmentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(appointmentDate.setHours(23, 59, 59, 999));

    const confirmedCount = await prisma.appointment.count({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: 'confirmed',
      },
    });

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: {
        status: 'confirmed',
        queueNum: confirmedCount + 1,
        confirmTime: new Date(),
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
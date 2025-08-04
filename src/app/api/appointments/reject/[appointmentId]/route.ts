import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const appointmentId = params.appointmentId;

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: {
        status: 'rejected',
      },
    });

    return NextResponse.json(updatedAppointment, { status: 200 });
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

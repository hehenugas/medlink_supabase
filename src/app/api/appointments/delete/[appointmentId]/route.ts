import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const appointmentId = params.appointmentId;

    if (!appointmentId) {
      return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 });
    }

    await prisma.appointment.delete({
      where: { id: parseInt(appointmentId) },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

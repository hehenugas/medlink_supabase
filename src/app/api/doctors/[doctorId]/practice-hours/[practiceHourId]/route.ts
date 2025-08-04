import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: any) {
  const userRole = req.headers.get('x-user-role');

  if (userRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { doctorId, practiceHourId } = await params;

    if (!doctorId || !practiceHourId) {
      return NextResponse.json({ error: "Missing doctorId or practiceHourId" }, { status: 400 });
    }

    await prisma.practiceHour.delete({
      where: {
        id: parseInt(practiceHourId),
        doctorId: parseInt(doctorId),
      },
    });

    return NextResponse.json({ message: "Practice hour deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting practice hour:", error);
    return NextResponse.json({ error: "Failed to delete practice hour" }, { status: 500 });
  }
}
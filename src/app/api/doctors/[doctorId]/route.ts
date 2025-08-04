import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export interface DoctorPracticeHours {
  id: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  doctorId: number;
}

export interface DoctorDetailsResponse {
  id: number;
  name: string;
  specialist: string;
  education: string;
  experience: string;
  about: string;
  practiceHours: DoctorPracticeHours[];
}

export async function GET(req: NextRequest, { params }: any) {
  try {
    const doctorId = (await params).doctorId;
    if (!doctorId) {
      return NextResponse.json({ error: 'Missing ID parameter' }, { status: 400 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: parseInt(doctorId, 10) },
      include: { practiceHours: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}

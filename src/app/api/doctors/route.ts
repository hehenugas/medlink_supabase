import { NextRequest, NextResponse } from 'next/server';
import { Doctor, PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export interface DoctorResponse {
  id: number;
  name: string;
  specialist: string;
}

export async function GET(req: NextRequest) {
  const userRole = req.headers.get('x-user-role');

  try {
    const doctors = await prisma.doctor.findMany();

    if (userRole === 'ADMIN') {
      // Return full doctor data for admin
      return NextResponse.json(doctors, { status: 200 });
    }

    // Map data for non-admin users
    const doctorsData: DoctorResponse[] = doctors.map((doctor: Doctor) => ({
      id: doctor.id,
      name: doctor.name,
      specialist: doctor.specialist,
    }));

    return NextResponse.json(doctorsData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
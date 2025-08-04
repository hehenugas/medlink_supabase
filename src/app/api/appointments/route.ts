import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export interface AppointmentResponse {
  id: number;
  userName: string,
  doctorName: string;
  doctorSpecialty: string;
  date: Date;
  purpose: string;
  status: string;
  location: string;
  notes: string;
  queue: number;
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  const userRole = req.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const queryOptions = userRole === 'ADMIN'
      ? {
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
            user: {
              select: {
                name: true,
              }
            }
          },
        }
      : {
          where: {
            userId: parseInt(userId),
          },
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
            user: {
              select: {
                name: true,
              }
            }
          },
        };

    const appointments = await prisma.appointment.findMany(queryOptions as any);

    const formattedAppointments: AppointmentResponse[] = appointments.map((appt: any) => ({
      id: appt.id,
      userName: appt.user.name,
      doctorName: appt.doctor.name,
      doctorSpecialty: appt.doctor.specialist,
      date: new Date(appt.date),
      purpose: appt.purpose,
      status: appt.status,
      location: appt.doctor.location,
      notes: appt.information,
      queue: appt.queueNum,
    }));

    return NextResponse.json(formattedAppointments, { status: 200 });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
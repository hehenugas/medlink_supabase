import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, {params}: any) {
  try {
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'ADMIN'){
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 401 });
    }

    const historicalData = await prisma.historicalData.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        date: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    const formattedHistoricalData = historicalData.map((data) => ({
      id: data.id,
      parameter: data.parameter,
      value: data.value,
      unit: data.unit,
      information: data.information,
      date: data.date,
      userId: data.userId,
      userName: data.user.name,
      userUsername: data.user?.username,
    }));

    return NextResponse.json(formattedHistoricalData, { status: 200 });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dataId = req.nextUrl.searchParams.get('dataId');

    if (!dataId) {
      return NextResponse.json({ error: 'Missing dataId' }, { status: 400 });
    }

    const historicalData = await prisma.historicalData.findUnique({
      where: { id: parseInt(dataId) },
    });

    if (!historicalData) {
      return NextResponse.json({ error: 'Historical data not found' }, { status: 404 });
    }

    await prisma.historicalData.delete({
      where: { id: parseInt(dataId) },
    });

    return NextResponse.json({ message: 'Historical data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting historical data:', error);
    return NextResponse.json({ error: 'Failed to delete historical data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
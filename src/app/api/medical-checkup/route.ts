import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '#/prisma/db';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const historicalData = await prisma.historicalData.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(historicalData, { status: 200 });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return NextResponse.json({ error: 'Failed to fetch historical data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const prisma = new PrismaClient();

  try {
    const userId = req.headers.get("x-user-id");
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await prisma.historicalData.createMany({
      data: body.map((entry) => ({
        parameter: entry.parameter,
        value: entry.value,
        unit: entry.unit,
        information: entry.information,
        date: new Date(entry.date),
        userId: parseInt(userId),
      })),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error saving medical checkup data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

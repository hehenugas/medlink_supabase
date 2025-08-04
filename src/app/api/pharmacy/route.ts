import { PrismaClient } from "#/prisma/db";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export interface MedicationInfo {
  keteranganPenggunaan: string;
  dosis: string;
  usagePerDay: number;
  usageDay: number;
  tanggalMulaiObat: Date;
  tanggalSelesaiObat: Date;
  id: number;
  namaObat: string;
  jamPenggunaan: any;
  userId: number;
}

export async function GET(req: NextRequest) {
  const userRole = req.headers.get("x-user-role");
  const userId =
    userRole === "ADMIN"
      ? req.nextUrl.searchParams.get("userId")
      : req.headers.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const medications = await prisma.pharmacy.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    return NextResponse.json(medications);
  } catch (e) {
    console.error("Error fetching pharmacy info:", e);
    return NextResponse.json(
      { error: "Failed to fetch pharmacy info" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const userRole = req.headers.get("x-user-role");

  if (userRole !== "ADMIN" || !userId || isNaN(parseInt(userId ?? ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const newMedication = await prisma.pharmacy.create({
      data: {
        userId: parseInt(userId!),
        ...body,
      },
    });

    return NextResponse.json(newMedication, {
      status: 200,
    });
  } catch (e) {
    console.error("Error creating data:", e);
    return NextResponse.json(
      { error: "Failed to create medication data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const userRole = req.headers.get("x-user-role");

  if (userRole !== "ADMIN" || !id || isNaN(parseInt(id ?? ""))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.pharmacy.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      { message: "Medication data deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.error("Error deleting medication data:", e);
    return NextResponse.json(
      { error: "Failed to delete medication data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  const { userId } = await request.json();

  const glucoseLogs = await prisma.glucoseLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5, 
  });

  const insulinDoses = await prisma.insulinDose.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return NextResponse.json({ glucoseLogs, insulinDoses });
}
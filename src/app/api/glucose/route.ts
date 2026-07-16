import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.glucoseLog.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, value, type, mealType, note } = await request.json();
  const updated = await prisma.glucoseLog.update({
    where: { id },
    data: { value: parseFloat(value), type, mealType, note },
  });
  return NextResponse.json(updated);
}
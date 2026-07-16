import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.insulinDose.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const { id, units, type } = await request.json();
  const updated = await prisma.insulinDose.update({
    where: { id },
    data: { units: parseFloat(units), type },
  });
  return NextResponse.json(updated);
}
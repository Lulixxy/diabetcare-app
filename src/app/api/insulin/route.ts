import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    await prisma.insulinDose.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, units, type } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "Missing id" }, { status: 400 });
    }
    const updated = await prisma.insulinDose.update({
      where: { id },
      data: { units: parseFloat(units), type },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      {
        status: 500,
      },
    );
  }
}
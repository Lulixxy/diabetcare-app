import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, units, type } = await request.json();

    const newDose = await prisma.insulinDose.create({
      data: {
        userId,
        units: parseFloat(units),
        type,
      },
    });

    return NextResponse.json({ success: true, data: newDose });
  } catch (error) {
    return NextResponse.json({ error: "บันทึกข้อมูลอินซูลินไม่สำเร็จ" }, { status: 500 });
  }
}
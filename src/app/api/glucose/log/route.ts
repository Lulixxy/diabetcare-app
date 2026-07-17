import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, value, type, mealType, note } = await request.json();

    const user = await prisma.user.findUnique({
      where: {
        line_user_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const newLog = await prisma.glucoseLog.create({
      data: {
        userId: user.id,
        value: parseFloat(value),
        type,
        mealType,
        note,
      },
    });

    return NextResponse.json({
      success: true,
      data: newLog,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "บันทึกข้อมูลไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
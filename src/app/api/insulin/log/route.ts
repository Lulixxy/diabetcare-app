import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, units, type } = await request.json();

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

    const newDose = await prisma.insulinDose.create({
      data: {
        userId: user.id,
        units: parseFloat(units),
        type,
      },
    });

    return NextResponse.json({
      success: true,
      data: newDose,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "บันทึกข้อมูลอินซูลินไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
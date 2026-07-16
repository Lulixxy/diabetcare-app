import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import liff from "@line/liff"; // เราจะตรวจสอบ user จาก LINE ในฝั่ง client แต่ฝั่ง server ใช้ userId

export async function POST(request: Request) {
  try {
    const { userId, value, type, mealType, note } = await request.json();

    const newLog = await prisma.glucoseLog.create({
      data: {
        userId,
        value: parseFloat(value),
        type,
        mealType,
        note,
      },
    });

    return NextResponse.json({ success: true, data: newLog });
  } catch (error) {
    return NextResponse.json({ error: "บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "ยังไม่ได้เข้าสู่ระบบค่ะ" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้ใช้งาน" },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { glucose, type, mealType, note } = body; // รับค่าเพิ่ม

    const newRecord = await prisma.glucoseLog.create({
      data: {
        value: Number(glucose),
        type: type,
        mealType: mealType,
        note: note,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "บันทึกข้อมูลไม่สำเร็จค่ะ" },
      { status: 500 },
    );
  }
}

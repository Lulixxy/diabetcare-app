import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    // รับค่าจากหน้าสมัครสมาชิก
    const { line_user_id, name } = await request.json();

    // บันทึก User ใหม่ลงฐานข้อมูล
    const newUser = await prisma.user.create({
      data: {
        line_user_id: line_user_id,
        name: name,
        status: "active",
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "สมัครสมาชิกไม่สำเร็จ" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

/**
 * API Route: ตรวจสอบสถานะบัญชีด้วย LINE User ID
 */
export async function POST(request: Request) {
  try {
    // 1. รับค่า line_user_id จากหน้า Login (LoginPage)
    const { line_user_id } = await request.json();

    if (!line_user_id) {
      return NextResponse.json({ error: "ไม่พบข้อมูล LINE User ID" }, { status: 400 });
    }

    // 2. ค้นหาผู้ใช้ในฐานข้อมูลด้วย line_user_id
    const user = await prisma.user.findUnique({
      where: { line_user_id: line_user_id },
    });

    if (user) {
      // 3. ตรวจสอบสถานะบัญชี (Suspended หรือไม่)
      if (user.status === "suspended") {
        return NextResponse.json({ 
          exists: true, 
          suspended: true, 
          message: "บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อเจ้าหน้าที่" 
        }, { status: 403 });
      }

      // 4. กรณีบัญชีปกติ: ส่งข้อมูลกลับไปให้หน้า Dashboard
      return NextResponse.json({ exists: true, user, suspended: false });
    } else {
      // 5. กรณีไม่พบข้อมูลใน DB: แปลว่ายังไม่เคยลงทะเบียน
      return NextResponse.json({ exists: false });
    }

  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
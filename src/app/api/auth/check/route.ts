import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { line_user_id } = await request.json();

    if (!line_user_id) {
      return NextResponse.json({ error: "ไม่พบข้อมูล LINE User ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { line_user_id: line_user_id },
    });

    if (user) {
      if (user.status === "suspended") {
        return NextResponse.json({ 
          exists: true, 
          suspended: true, 
          message: "บัญชีของคุณถูกระงับการใช้งานชั่วคราว กรุณาติดต่อเจ้าหน้าที่" 
        }, { status: 403 });
      }

      return NextResponse.json({ exists: true, user, suspended: false });
    } else {
      return NextResponse.json({ exists: false });
    }

  } catch (error) {
    console.error("Auth Check Error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "ไม่พบ userId" }, { status: 400 });

  try {
    const logs = await prisma.glucoseLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }, 
      take: 12, 
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "ดึงข้อมูลไม่ได้" }, { status: 500 });
  }
}
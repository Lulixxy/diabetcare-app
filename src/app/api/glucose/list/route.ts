import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing LINE User ID" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        line_user_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json([]);
    }

    const logs = await prisma.glucoseLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ดึงข้อมูลไม่ได้" },
      { status: 500 }
    );
  }
}
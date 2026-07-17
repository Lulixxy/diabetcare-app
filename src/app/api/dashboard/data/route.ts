import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing LINE User ID" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        line_user_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({
        glucoseLogs: [],
        insulinDoses: [],
      });
    }

    const glucoseLogs = await prisma.glucoseLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    const insulinDoses = await prisma.insulinDose.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      glucoseLogs,
      insulinDoses,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
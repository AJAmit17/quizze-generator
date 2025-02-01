//app/api/quizAttempts/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json(quizAttempts);
  } catch (error) {
    console.error("Failed to fetch quiz attempts:", error);
    return NextResponse.json({ error: "Failed to fetch quiz attempts" }, { status: 500 });
  }
}
// app/api/quiz/[quizId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest, { params }: { params: { quizId: string } }) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!params.quizId) {
    return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      select: {
        id: true,
        title: true,
        description: true,
        questions: true,
        createdAt : true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Failed to fetch quiz details:", error);
    return NextResponse.json({ error: "Failed to fetch quiz details" }, { status: 500 });
  }
}